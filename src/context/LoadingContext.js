/*
 * @Author: lijunwei
 * @Date: 2021-11-29 17:01:52
 * @LastEditTime: 2021-12-15 14:07:33
 * @LastEditors: lijunwei
 * @Description: Global Spinner Context
 */

import { createContext } from "react";

const LoadingContext = createContext({
  active: false,
  loading: ()=>{},
})



export { LoadingContext };

