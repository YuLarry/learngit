/*
 * @Author: lijunwei
 * @Date: 2021-11-23 19:45:00
 * @LastEditTime: 2022-02-11 11:40:19
 * @LastEditors: lijunwei
 * @Description: request urls config
 */


export const LOGIN    = `/login`;


// public apis
export const GET_PROVIDER_LIST       = "/select-provider";       //  供应商
export const GET_WAREHOUSE_LIST      = "/select-warehouse";      //  仓库
export const GET_SUBJECT_LIST        = "/select-subject";        //  采购方
export const GET_PROJECT_LIST        = "/select-brand"           //  项目列表
export const GET_PROVIDER_DETAIL     = "/provider-account"       // 供应商详情
export const GET_CLIENT_ACCOUNT_LIST = "/select-client-account"  // 货主选项
export const GET_WAREHOUSE_AREA      = "/select-warehouse-area"  // 货区选项

export const QUERY_SOURCING_ORDER_LIST  = "/po/list";
export const COMMIT_APPROVAL            = "/po/po_approval";     // 提交审批
export const CANCEL_SOURING_ORDER       = "/po/cancel";          // 取消采购单
export const EXPORT_SOURING_ORDER_PDF   = "/po-download-pdf";    // 导出
export const EXPORT_SOURING_ORDER_EXCEL = "/po-download-pdf";    // 导出
export const DELETE_SOURING_ORDER       = "/po/delete";          //删除采购单
export const COMMIT_PAYMENT_REQUEST     = "/po/payment_invoice"  // 提交付款
export const GET_SOURCING_ORDER_DETAIL  = "/po/detail"           // 采购单详情
export const GET_GOODS_QUERY            = "/po/get-goods-quote"  // 商品列表查询
export const EDIT_SOURCING_ORDER        = "/po/store"            // 添加|编辑采购单

export const GET_SHIPPING_LIST = "/shipping/list"  // 获取发货单列表
export const GET_PO_ITEM_LIST = "/shipping/get-po-item"// 查询发货明细列表

export const GET_SHIPPING_DETAIL = "/shipping/detail" // 获取发货单详情

export const GET_SKU_OPTIONS = "/shipping/get-warehouse-relation" // 获取sku下拉选项

export const GET_REPO_TABLE_LIST = "/inbound/list"      // 获取入库列表
export const GET_INBOUND_DETAIL = "/inbound/detail"    // 获取入库单详情

