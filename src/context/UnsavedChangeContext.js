/*
 * @Author: lijunwei
 * @Date: 2021-12-02 11:57:08
 * @LastEditTime: 2021-12-24 12:05:24
 * @LastEditors: lijunwei
 * @Description: topbar unsaved context
 */

import { createContext } from "react"


const UnsavedChangeContext = createContext({
  active: false,
  message: "Unsaved changes",
  actions:{
    saveAction:{
      content: "Save",
      onAction: ()=>{},
    },
    discardAction: {
      content: "Discard",
      onAction: ()=>{},
    }
  },
  remind: ()=>{},
})

export { UnsavedChangeContext }
