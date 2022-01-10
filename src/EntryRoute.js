/*
 * @Author: lijunwei
 * @Date: 2021-12-20 16:40:04
 * @LastEditTime: 2022-01-10 17:11:20
 * @LastEditors: lijunwei
 * @Description: 
 */


import React, { Suspense, useContext, useEffect } from "react";
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
  useEffect(() => {
    ax.interceptors.response.use(
      (res) => {
        return Promise.resolve(res);
      },
      (err) => {
        // console.dir(err);
        const { data: { message } } = err.response;
        const _msg = message ? message : err.message;

        toastContext.toast({ active: true, message: _msg, error: true });
        return Promise.reject(err)

      })
  })

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
