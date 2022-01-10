/*
 * @Author: lijunwei
 * @Date: 2021-11-24 11:36:44
 * @LastEditTime: 2022-01-10 17:08:54
 * @LastEditors: lijunwei
 * @Description: 
 */

import axios from "axios";
import { getToken } from "./Tools";


const { REACT_APP_API_ORIGIN, REACT_APP_API_VERSION } = process.env;

const ax = axios.create({
  // baseURL: `${REACT_APP_API_ORIGIN}/api/v${REACT_APP_API_VERSION}/`,
  baseURL: `${REACT_APP_API_ORIGIN}/2021-12`,
  headers: {
    // 'X-Fstln-Token': getToken()
  },
  timeout: 20000,
})

ax.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (err) => {
    return Promise.reject(err);
  }
)

export { ax };



