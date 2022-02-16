/*
 * @Author: lijunwei
 * @Date: 2021-11-24 11:29:42
 * @LastEditTime: 2022-02-16 11:53:39
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
export const getBrandList = () => ax.get(REQUEST_URLS.GET_BRAND_LIST);

// 获取供应商详情
export const getProviderDetail = (id) => ax.get(`${REQUEST_URLS.GET_PROVIDER_DETAIL}/${id}`);

// 获取货主列表
export const getClientAccount = ()=> ax.get(REQUEST_URLS.GET_CLIENT_ACCOUNT_LIST);

// 获取货区列表
export const getWarehouseArea = ()=> ax.get(REQUEST_URLS.GET_WAREHOUSE_AREA);




// 获取采购单列表
export const querySourcingList = (params) => ax.get(REQUEST_URLS.QUERY_SOURCING_ORDER_LIST, { params })

// 获取采购单详情
export const getSourcingOrderDetail = (id) => ax.get(`${REQUEST_URLS.GET_SOURCING_ORDER_DETAIL}/${id}`)

// 查询商品列表
export const getGoodsQuery = (params) => ax.get(REQUEST_URLS.GET_GOODS_QUERY, { params });

// 提交审批
export const commitApproval = (id) => ax.put(`${REQUEST_URLS.COMMIT_APPROVAL}`, { id })

// 取消采购单
export const cancelSourcingOrder = (id) => ax.put(`${REQUEST_URLS.CANCEL_SOURING_ORDER}`, { id })

// 删除采购单
export const deleteSourcingOrder = (id) => ax.delete(`${REQUEST_URLS.DELETE_SOURING_ORDER}`, { data: { id } })

// 导出采购单 pdf
export const exportOrderPdf = (data)=> ax.get(`${REQUEST_URLS.EXPORT_SOURING_ORDER_PDF}`, { params: data })

// 导出采购单 excel
export const exportOrderExcel = (params)=> ax.get(`${REQUEST_URLS.EXPORT_SOURING_ORDER_EXCEL}`,{ params,responseType: 'blob' })

// 创建|更新采购单
export const editSourcingOrder = (body)=> ax.post(`${REQUEST_URLS.EDIT_SOURCING_ORDER}`, { ...body })

// 申请付款
export const commitPaymentRequest = (formData) => ax({
  method: "POST",
  url: `${REQUEST_URLS.COMMIT_PAYMENT_REQUEST}`, 
  data: formData,
  headers: { "Content-Type": "multipart/form-data" }
})



/*  发货单  */
// 获取发货单列表
export const getShipingList = (query) => ax.get(REQUEST_URLS.GET_SHIPPING_LIST, { params: query});

// 获取发货明细列表
export const getPoItemList = (query) => ax.get(REQUEST_URLS.GET_PO_ITEM_LIST, { params: query});

// 获取发货单详情
export const getShippingDetail = (id) => ax.get(`${REQUEST_URLS.GET_SHIPPING_DETAIL}/${id}`);

// 获取sku下拉列表
export const getSkuOptionsList = (query) => ax.get(REQUEST_URLS.GET_SKU_OPTIONS, { params: query });



/* 入库 */
// 入库单表格
export const getRepoTableList = (query) => ax.get(REQUEST_URLS.GET_REPO_TABLE_LIST, {params: query})

export const getInboundDetail = (id) => ax.get(`${REQUEST_URLS.GET_INBOUND_DETAIL}/${id}`);





