/*
 * @Author: lijunwei
 * @Date: 2022-02-18 14:18:39
 * @LastEditTime: 2022-02-21 11:19:57
 * @LastEditors: lijunwei
 * @Description: 
 */


import { useCallback } from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import { loginRequest } from "../../api/requests";
import { fstlnTool } from "../../utils/Tools";



function TokenErrorPage(props) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get( "token" );

  // const LOGIN_ADDRESS = "http://192.168.8.32:56002/admin/auth/login";
  const LOGIN_ADDRESS = `${process.env.REACT_APP_API_ORIGIN}/admin/auth/login`


  useEffect(()=>{
    if( token ){
      fstlnTool.saveToken(token);
    }
    const authed = fstlnTool.getToken();
    if( authed ){
      navigate("/sourcing");
    }
  },[])
  
  const requestToken = useCallback(()=>{
    loginRequest()
    .then(res=>{
      const { data:{data} } = res;
      const token = data[0];
      fstlnTool.saveToken(token);
      navigate(0);
    })
  },[])

  return (
    <div style={{ textAlign: "center", fontSize: "18px", marginTop: "200px" }}>
      <div>Token验证失败 <a href={LOGIN_ADDRESS}> 重新登录 </a></div>
      {/* <div>Token验证失败 <a href="javascritp:;" onClick={ requestToken }> 重新登录 </a></div> */}
    </div>
  );
}
export { TokenErrorPage }