/*
 * @Author: lijunwei
 * @Date: 2021-11-24 11:36:44
 * @LastEditTime: 2022-02-21 11:10:29
 * @LastEditors: lijunwei
 * @Description: 
 */

import axios from "axios";


const { REACT_APP_API_ORIGIN, REACT_APP_API_VERSION } = process.env;

const ax = axios.create({
  baseURL: `${REACT_APP_API_ORIGIN}/api/pms`,
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



