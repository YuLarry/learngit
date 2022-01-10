/*
 * @Author: lijunwei
 * @Date: 2021-12-02 17:57:34
 * @LastEditTime: 2021-12-27 11:46:08
 * @LastEditors: lijunwei
 * @Description: 
 */

import { createContext } from "react";


export const ModalContextInit = {
  active: false,
  title: "",
  message: "",
  primaryAction:{
    content: "",
    onAction: ()=>{},
  },
  secondaryActions:[],
  onClose: ()=>{},
  
  modal: ()=>{},

  section: null,
}

export const ModalContext = createContext( ModalContextInit );

