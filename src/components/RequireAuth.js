/*
 * @Author: lijunwei
 * @Date: 2021-11-16 18:54:39
 * @LastEditTime: 2022-02-21 10:57:58
 * @LastEditors: lijunwei
 * @Description: RequireAuth component
 */

import { useEffect } from "react";
import { useNavigate } from "react-router";


function RequireAuth({children}) {
  
  const navigate = useNavigate();

  const authed = window.localStorage.getItem("token");

  useEffect(()=>{
    if( !authed ){
      navigate("/login");
    }
  },[])
  
  return children;
}
export { RequireAuth }
