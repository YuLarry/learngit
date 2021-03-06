/*
 * @Author: lijunwei
 * @Date: 2021-11-23 19:45:00
 * @LastEditTime: 2022-03-14 17:13:09
 * @LastEditors: lijunwei
 * @Description: request urls config
 */


export const LOGIN    = `/login`;

export const BACKEND_GOODS_DETAIL = `${process.env.REACT_APP_API_ORIGIN}/admin/goods/list`


// public apis
export const GET_PROVIDER_LIST       = "/select-provider";       //  供应商
export const GET_WAREHOUSE_LIST      = "/select-warehouse";      //  仓库
export const GET_SUBJECT_LIST        = "/select-subject";        //  采购方
export const GET_BRAND_LIST          = "/select-brand"           //  项目列表
export const GET_PROVIDER_DETAIL     = "/provider-account"       // 供应商详情
export const GET_CLIENT_ACCOUNT_LIST = "/select-client-account"  // 货主选项
export const GET_WAREHOUSE_AREA      = "/select-warehouse-area"  // 货区选项
export const GET_PLATFORM_LIST       = "/select-platform"        //获取平台列表
export const GET_BUSINESS_TYPE_LIST  = "/select-business"        // 获取业务类型
export const GET_DEPARTMENT_LIST     = "/select-division"        // 获取部门

export const QUERY_SOURCING_ORDER_LIST  = "/po/list";
export const COMMIT_APPROVAL            = "/po/po_approval";     // 提交审批
export const CANCEL_SOURING_ORDER       = "/po/cancel";          // 取消采购单
export const EXPORT_SOURING_ORDER_PDF   = "/po/export_pdf";      // 导出pdf
export const EXPORT_SOURING_ORDER_EXCEL = "/po/export_excel";    // 导出excel
export const DELETE_SOURING_ORDER       = "/po/delete";          //删除采购单
export const COMMIT_PAYMENT_REQUEST     = "/po/payment_invoice"  // 提交付款
export const GET_SOURCING_ORDER_DETAIL  = "/po/detail"           // 采购单详情
export const GET_GOODS_QUERY            = "/po/get-goods-quote"  // 商品列表查询
export const EDIT_SOURCING_ORDER        = "/po/store"            // 添加|编辑采购单

export const GET_SHIPPING_LIST = "/shipping/list"         // 获取发货单列表
export const GET_PO_ITEM_LIST  = "/shipping/get-po-item"  // 查询发货明细列表

export const GET_SHIPPING_DETAIL       = "/shipping/detail"                // 获取发货单详情
export const GET_WAITING_SHIPPING_LIST = "/shipping/shipping-item-detail"  // 获取未发货商品列表
export const SAVE_SHIPPING_ORDER       = "/shipping/store"                 // 保存发货单
export const DELETE_SHIPPING_ORDER     = "/shipping/delete"                // 删除发货单
export const INBOUND_COMMIT            = "/inbound/prediction-warehouse"   // 预报仓库

export const GET_SKU_OPTIONS = "/shipping/get-warehouse-goods" // 获取sku下拉选项
export const CHECK_SKUS = "/shipping/get-warehouse-relation" // check sku ok

export const GET_REPO_TABLE_LIST = "/inbound/list"             // 获取入库列表
export const GET_INBOUND_DETAIL  = "/inbound/detail"           // 获取入库单详情
export const COMMIT_REPO_SKUS    = "/inbound/confirm_inbound"  // 手动入库



