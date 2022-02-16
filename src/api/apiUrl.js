/*
 * @Author: lijunwei
 * @Date: 2021-11-23 19:45:00
 * @LastEditTime: 2022-02-16 19:15:41
 * @LastEditors: lijunwei
 * @Description: request urls config
 */


export const LOGIN    = `/login`;


// public apis
export const GET_PROVIDER_LIST       = "/api/pms/select-provider";       //  供应商
export const GET_WAREHOUSE_LIST      = "/api/pms/select-warehouse";      //  仓库
export const GET_SUBJECT_LIST        = "/api/pms/select-subject";        //  采购方
export const GET_BRAND_LIST        = "/api/pms/select-brand"           //  项目列表
export const GET_PROVIDER_DETAIL     = "/api/pms/provider-account"       // 供应商详情
export const GET_CLIENT_ACCOUNT_LIST = "/api/pms/select-client-account"  // 货主选项
export const GET_WAREHOUSE_AREA      = "/api/pms/select-warehouse-area"  // 货区选项

export const QUERY_SOURCING_ORDER_LIST  = "/api/pms/po/list";
export const COMMIT_APPROVAL            = "/api/pms/po/po_approval";     // 提交审批
export const CANCEL_SOURING_ORDER       = "/api/pms/po/cancel";          // 取消采购单

export const EXPORT_SOURING_ORDER_PDF   = "/admin/downloadPdf";    // 导出

export const EXPORT_SOURING_ORDER_EXCEL = "/api/pms/po/export_excel";    // 导出
export const DELETE_SOURING_ORDER       = "/api/pms/po/delete";          //删除采购单
export const COMMIT_PAYMENT_REQUEST     = "/api/pms/po/payment_invoice"  // 提交付款
export const GET_SOURCING_ORDER_DETAIL  = "/api/pms/po/detail"           // 采购单详情
export const GET_GOODS_QUERY            = "/api/pms/po/get-goods-quote"  // 商品列表查询
export const EDIT_SOURCING_ORDER        = "/api/pms/po/store"            // 添加|编辑采购单

export const GET_SHIPPING_LIST = "/api/pms/shipping/list"         // 获取发货单列表
export const GET_PO_ITEM_LIST  = "/api/pms/shipping/get-po-item"  // 查询发货明细列表

export const GET_SHIPPING_DETAIL   = "/api/pms/shipping/detail"   // 获取发货单详情
export const SAVE_SHIPPING_ORDER   = "/api/pms/shipping/store"    // 保存发货单
export const DELETE_SHIPPING_ORDER = "/api/pms/shipping/delete"  // 删除发货单

export const GET_SKU_OPTIONS = "/api/pms/shipping/get-warehouse-relation" // 获取sku下拉选项

export const GET_REPO_TABLE_LIST = "/api/pms/inbound/list"      // 获取入库列表
export const GET_INBOUND_DETAIL = "/api/pms/inbound/detail"    // 获取入库单详情

