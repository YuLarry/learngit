/*
 * @Author: lijunwei
 * @Date: 2021-11-24 18:51:07
 * @LastEditTime: 2021-12-08 16:20:03
 * @LastEditors: lijunwei
 * @Description: 
 */

import Mock from "mockjs";
import * as REQUEST_URLS from "../api/apiUrl";

const BASE_URL = process.env.REACT_APP_API_ORIGIN;

Mock.mock( `${BASE_URL}${REQUEST_URLS.LOGIN}`, {
  user: "Caixukun",
  id: 123,
  address: "test address",
})
