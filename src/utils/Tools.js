/*
 * @Author: lijunwei
 * @Date: 2021-12-14 11:11:31
 * @LastEditTime: 2022-03-01 14:37:03
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

  EMAIL_REG: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  
  INT_MORE_THAN_ZERO_REG: /^[+]{0,1}(\d+)$/,
  FLOAT_MORE_THAN_ZERO_REG: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
  
  downloadBlob: ( blob, fileName )=>{
    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
  }

}


