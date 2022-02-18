/*
 * @Author: lijunwei
 * @Date: 2022-02-18 14:18:39
 * @LastEditTime: 2022-02-18 14:47:26
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
      {/* <div>Token验证失败 <a href=""> 重新登录 </a></div> */}
      <div>Token验证失败 <a href="javascritp:;" onClick={ requestToken }> 重新登录 </a></div>
    </div>
  );
}
export { TokenErrorPage }