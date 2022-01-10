/*
 * @Author: lijunwei
 * @Date: 2021-11-24 15:28:33
 * @LastEditTime: 2021-12-23 15:25:15
 * @LastEditors: lijunwei
 * @Description: Global Feedback context
 */

import { createContext } from "react";


const ToastContext = createContext({
  active  : false,
  message : "",
  duration: 3000,
  error   : false,
  onDismiss: ()=>{},
  toast  : ()=>{},
})

export { ToastContext }

