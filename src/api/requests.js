/*
 * @Author: lijunwei
 * @Date: 2021-11-24 11:29:42
 * @LastEditTime: 2022-01-10 17:09:27
 * @LastEditors: lijunwei
 * @Description: 
 */

// import Axios from "axios";
import axios from "axios";
import { ax } from "../utils/FstlnAxios";
import * as REQUEST_URLS from "./apiUrl";

const { REACT_APP_AUTH_ORIGIN } = process.env;

export const loginRequest = (data)=>{
  // console.log(REACT_APP_AUTH_ORIGIN);
  return axios.post(`${REACT_APP_AUTH_ORIGIN}${REQUEST_URLS.LOGIN}`, data)
};


export const getSegmentList = (params)=>{
  return ax.get( REQUEST_URLS.SEGMENTS, {
    params,
  });
}
export const getSegmentDetail = (id)=>{
  return ax.get(`${REQUEST_URLS.SEGMENT}/${id}`);
}
export const addSegment = (segment)=>{
  return ax.post( REQUEST_URLS.SEGMENT, {
    ...segment,
  } );
}
export const updateSegment = (id, segment)=>{
  return ax.put(`${REQUEST_URLS.SEGMENT}/${id}`, {
    ...segment,
  });
}
export const deleteSegment = (id)=>{
  return ax.delete(`${REQUEST_URLS.SEGMENT}/${id}`);
}
export const exportSegment = (id)=>{
  return ax.get(`${REQUEST_URLS.SEGMENT}/${id}/export`);
}


export const getRuleSchema = ()=>{
  return ax.get(`${REQUEST_URLS.RULES}`)
}

export const execSavedSegment = (id, params)=>{
  return ax.get(`${REQUEST_URLS.SEGMENT}/${id}/exec`,{
    params
  });
}
export const execSavedSegmentCount = (id)=>{
  return ax.get(`${REQUEST_URLS.SEGMENT}/${id}/execcount`);
}


export const execTempSegment = (id, params)=>{
  let path = `${REQUEST_URLS.SEGMENT}/${id || 1}/temp`
  return ax.post(path,{
    ...params,
  });
}
export const execTempSegmentCount = (id, data)=>{
  let path = `${REQUEST_URLS.SEGMENT}/${id || 1}/tempcount`;
  return ax.post(path,{...data});
}

