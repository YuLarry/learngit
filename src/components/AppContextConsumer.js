/*
 * @Author: lijunwei
 * @Date: 2021-12-14 19:24:19
 * @LastEditTime: 2022-03-16 16:14:53
 * @LastEditors: lijunwei
 * @Description: 
 */

import { ContextualSaveBar, Frame, Toast } from "@shopify/polaris";
import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";
import { ModalContext } from "../context/ModalContext";
import { ToastContext } from "../context/ToastContext";
import { UnsavedChangeContext } from "../context/UnsavedChangeContext";
import { FstlnModal } from "./FstlnModal";
import { LoadingMask } from "./LoadingMask";


function AppContextConsumer(props) {
  const { children } = props;

  // toast context
  const toastContext = useContext(ToastContext);

  // loading context
  const loadingContext = useContext(LoadingContext);

  // unsaved change context
  const unsavedChangeContext = useContext(UnsavedChangeContext);

  // modal context
  const modalContext = useContext(ModalContext);

  return (
    <Frame>
      {children}

      {loadingContext.active && <LoadingMask />}
      {toastContext.active && <Toast
        content={toastContext.message}
        duration={toastContext.duration}
        error={toastContext.error}
        onDismiss={toastContext.onDismiss} />}
      { <FstlnModal modalConfig={ modalContext } />}
      {unsavedChangeContext.active && <ContextualSaveBar
        message={unsavedChangeContext.message}
        saveAction={unsavedChangeContext.actions.saveAction}
        discardAction={unsavedChangeContext.actions.discardAction} />}
    </Frame>
  );
}
export { AppContextConsumer }