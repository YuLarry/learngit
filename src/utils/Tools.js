/*
 * @Author: lijunwei
 * @Date: 2021-12-14 11:11:31
 * @LastEditTime: 2021-12-27 14:31:48
 * @LastEditors: lijunwei
 * @Description: 
 */


export const getToken = ()=>{
  return window.localStorage.getItem("token") || "";
}

export const EMAIL_REG = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

