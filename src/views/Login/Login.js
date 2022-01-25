/*
 * @Author: lijunwei
 * @Date: 2021-11-15 17:51:39
 * @LastEditTime: 2022-01-25 11:15:40
 * @LastEditors: lijunwei
 * @Description: Login page
 */

import { Button, Card, Form, FormLayout, Frame, TextField, Toast } from "@shopify/polaris";
import { useMemo } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { loginRequest } from "../../api/requests";
import { AppContext } from "../../components/AppContext";
import { ToastContext } from "../../context/ToastContext";
import { fstlnTool } from "../../utils/Tools";
import "./login.scss";


function Login(props) {

  const [needLogin, setNeedLogin] = useState(false);
  const [loginFrom, setLoginForm] = useState({ account: "", password: "" })
  const [logging, setLogging] = useState(false);

  const navigate = useNavigate();
  const toastContext = useContext(ToastContext);

  // has userId redirect to Frame page
  useEffect(() => {
    if (fstlnTool.getToken()) {
      navigate("/users");
      return;
    }
    setNeedLogin(true);
  }, [])

  // textfield change
  const handleChange = useCallback((newVal, id) => {
    setLoginForm({ ...loginFrom, [id]: newVal })
  }, [loginFrom])

  // submit
  const handleSubmit = useCallback(() => {
    setLogging(true);
    loginRequest(loginFrom)
      .then((res) => {
        const { token } = res.data;
        window.localStorage.setItem("token", token);
        setLogging(false);
        navigate("/users");
      })
      .catch((e) => {
        toastContext.toast({ active: true, message: e.message, error: true });
        setLogging(false);

      })

  }, [loginFrom])

  const formValid = useMemo(() => {
    const { account, password } = loginFrom;
    return fstlnTool.EMAIL_REG.test(account) && password.trim().length > 0
  }, [loginFrom]);

  

  return (
    !needLogin ? null :
      <div className="login-page">
        <Card className="login-card" title="Login">
          <Card.Section>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  type="text"
                  label="Email"
                  value={loginFrom.account}
                  id="account"
                  onChange={handleChange}
                  disabled={logging}
                />
                <TextField
                  type="password"
                  label="Password"
                  value={loginFrom.password}
                  id="password"
                  onChange={handleChange}
                  disabled={logging}
                />
                <Button primary fullWidth submit
                  disabled={!formValid}
                  loading={logging}
                >Login</Button>
              </FormLayout>
            </Form>
          </Card.Section>
        </Card>
      </div>
  );
}
export { Login }