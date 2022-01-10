/*
 * @Author: lijunwei
 * @Date: 2021-11-24 17:41:14
 * @LastEditTime: 2021-12-17 17:20:03
 * @LastEditors: lijunwei
 * @Description: App context component
 */

import { useCallback, useContext, useState } from "react";
import { LoadingContext } from "../context/LoadingContext";
import { ModalContext } from "../context/ModalContext";
import { ToastContext } from "../context/ToastContext";
import { UnsavedChangeContext } from "../context/UnsavedChangeContext";

import { AppContextConsumer } from "./AppContextConsumer";



function AppContext(props) {
  const { children } = props;


  // toast提示 context
  const [toastContext, setToastContext] = useState(useContext(ToastContext));
  const onDismiss = useCallback(() => {
    toast({ active: false });
  }, [])
  const toast = useCallback((toastObj) => {
    setToastContext({ ...toastContext, onDismiss, ...toastObj });
  }, []);
  

  // loading context
  const [loadingContext, setLoadingContext] = useState(useContext(LoadingContext));
  const loading = useCallback(( onOff ) => {
    setLoadingContext({ ...loadingContext, active: onOff });
  }, [])

  // unsaved change context
  const [unsavedChangeContext, setUnsavedChangeContext] = useState(useContext(UnsavedChangeContext));
  const remind = useCallback((unsaveContextObject) => {
    setUnsavedChangeContext({ ...unsavedChangeContext, ...unsaveContextObject })
  }, [])

  // modal context
  const [modalContext, setModalContext] = useState(useContext(ModalContext));
  const closeModal = useCallback(() => {
    setModalContext({active: false});
  }, [])
  const modal = useCallback((modalContextObject) => {
    setModalContext({ ...modalContext, onClose:closeModal, ...modalContextObject });
  }, [])


  return (
    <ToastContext.Provider value={{ ...toastContext, toast }}>
      <LoadingContext.Provider value={{ ...loadingContext, loading }}>
        <ModalContext.Provider value={{ ...modalContext, modal }}>
          <UnsavedChangeContext.Provider value={{ ...unsavedChangeContext, remind }}>
          

            <AppContextConsumer>{children}</AppContextConsumer>


          </UnsavedChangeContext.Provider>
        </ModalContext.Provider>
      </LoadingContext.Provider>
    </ToastContext.Provider>

  );
}
export { AppContext }
