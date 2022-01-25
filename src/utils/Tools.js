/*
 * @Author: lijunwei
 * @Date: 2021-12-14 11:11:31
 * @LastEditTime: 2022-01-25 11:25:03
 * @LastEditors: lijunwei
 * @Description: 
 */

export const fstlnTool = {

  saveToken: (token)=>{
    return window.localStorage.setItem("token", token);
  },

  getToken: ()=>{
    return window.localStorage.getItem("token") || "";
  },

  clearToken: ()=>{
    return window.localStorage.removeItem("token");
  },

  EMAIL_REG: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  

}


