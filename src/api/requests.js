/*
 * @Author: lijunwei
 * @Date: 2021-11-24 11:29:42
 * @LastEditTime: 2022-01-25 12:09:36
 * @LastEditors: lijunwei
 * @Description: 
 */

// import Axios from "axios";
import axios from "axios";
import { ax } from "../utils/FstlnAxios";
import * as REQUEST_URLS from "./apiUrl";

const { REACT_APP_AUTH_URL } = process.env;



export const loginRequest = (data)=>{
  // return axios.post(`${REACT_APP_AUTH_ORIGIN}${REQUEST_URLS.LOGIN}`, data)
  return axios.post(`${REACT_APP_AUTH_URL}`)
};


export const getProviderList = () => ax.get(REQUEST_URLS.GET_PROVIDER_LIST);
export const getWarehouseList = () => ax.get(REQUEST_URLS.GET_WAREHOUSE_LIST);
export const getSubjectList = () => ax.get(REQUEST_URLS.GET_SUBJECT_LIST);



