/*
 * @Author: lijunwei
 * @Date: 2021-11-24 11:29:42
 * @LastEditTime: 2022-02-08 19:25:17
 * @LastEditors: lijunwei
 * @Description: 
 */

// import Axios from "axios";
import axios from "axios";
import { ax } from "../utils/FstlnAxios";
import * as REQUEST_URLS from "./apiUrl";

const { REACT_APP_AUTH_URL } = process.env;


// 登录
export const loginRequest = (data)=>{
  // return axios.post(`${REACT_APP_AUTH_ORIGIN}${REQUEST_URLS.LOGIN}`, data)
  return axios.post(`${REACT_APP_AUTH_URL}`)
};

/*  采购单  */
// 获取供应商列表
export const getProviderList = () => ax.get(REQUEST_URLS.GET_PROVIDER_LIST);

// 获取仓库列表
export const getWarehouseList = () => ax.get(REQUEST_URLS.GET_WAREHOUSE_LIST);

// 获取采购方列表
export const getSubjectList = () => ax.get(REQUEST_URLS.GET_SUBJECT_LIST);

// 获取项目列表
export const getBrandList = () => ax.get(REQUEST_URLS.GET_PROJECT_LIST);

// 获取供应商详情
export const getProviderDetail = (id) => ax.get(`${REQUEST_URLS.GET_PROVIDER_DETAIL}/${id}`);

// 获取采购单列表
export const querySourcingList = (params) => ax.get(REQUEST_URLS.QUERY_SOURCING_ORDER_LIST, { params })

// 获取采购单详情
export const getSourcingOrderDetail = (id) => ax.get(`${REQUEST_URLS.GET_SOURCING_ORDER_DETAIL}/${id}`)

// 查询商品列表
export const getGoodsQuery = (params) => ax.get(REQUEST_URLS.GET_GOODS_QUERY, { params });

// 提交审批
export const commitApproval = (id) => ax.put(`${REQUEST_URLS.COMMIT_APPROVAL}/${id}`)

// 取消采购单
export const cancelSourcingOrder = (data) => ax.put(`${REQUEST_URLS.CANCEL_SOURING_ORDER}`, data)

// 删除采购单
export const deleteSourcingOrder = (id) => ax.delete(`${REQUEST_URLS.DELETE_SOURING_ORDER}/${id}`)

// 导出采购单 pdf
export const exportOrderPdf = (id)=> ax.get(`${REQUEST_URLS.EXPORT_SOURING_ORDER_PDF}/${id}`)

// 导出采购单 excel
export const exportOrderExcel = (params)=> ax.get(`${REQUEST_URLS.EXPORT_SOURING_ORDER_EXCEL}`,{ params })

// 创建|更新采购单
export const editSourcingOrder = (body)=> ax.post(`${REQUEST_URLS.EDIT_SOURCING_ORDER}`, { ...body })

// 申请付款
export const commitPaymentRequest = (data) => ax.post(`${REQUEST_URLS.COMMIT_PAYMENT_REQUEST}`, {...data})



/*  发货单  */
// 获取发货单列表
export const getShipingList = () => ax.get(REQUEST_URLS.GET_SHIPING_LIST);

