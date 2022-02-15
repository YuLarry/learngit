/*
 * @Author: lijunwei
 * @Date: 2021-12-20 16:40:04
 * @LastEditTime: 2022-02-15 17:15:54
 * @LastEditors: lijunwei
 * @Description: 
 */


import React, { Suspense, useContext } from "react";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { AppFrame } from "./components/AppFrame/AppFrame";
import { FstlnLoading } from "./components/FstlnLoading";
import { ToastContext } from "./context/ToastContext";
import { ax } from "./utils/FstlnAxios";
import { Login } from "./views/Login/Login";



function EntryRoute() {

  const toastContext = useContext(ToastContext);

  // init srcm axios response interceptor


  !ax['_INTERCEPTOR_SETTED_'] && ax.interceptors.response.use(
    (res) => {
      if( res.config.responseType === "blob" ){
        return Promise.resolve(res.data)
      }else{
        const { code, message } = res.data;
        if( code === 200 ){
          return Promise.resolve(res.data);
        }else{
          toastContext.toast({ active: true, message, error: true });
          return Promise.reject("message")
        }
      }
      
    },
    (err) => {
      // console.dir(err);
      const { data: { message } } = err.response;
      const _msg = message ? message : err.message;

      toastContext.toast({ active: true, message: _msg, error: true });
      return Promise.reject(err)

    })
  ax['_INTERCEPTOR_SETTED_'] = true;

  return (
    <BrowserRouter>
      <Suspense fallback={<FstlnLoading />}>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/*" element={<AppFrame />}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
export { EntryRoute }
