/*
 * @Author: lijunwei
 * @Date: 2021-11-23 19:45:00
 * @LastEditTime: 2022-01-28 11:42:11
 * @LastEditors: lijunwei
 * @Description: request urls config
 */


export const LOGIN    = `/login`;


// public apis
export const GET_PROVIDER_LIST  = "/select-provider";   //  供应商
export const GET_WAREHOUSE_LIST = "/select-warehouse";  //  仓库
export const GET_SUBJECT_LIST   = "/select-subject";    //  采购方
export const GET_PROJECT_LIST   = "/select-brand"  //  项目列表
export const GET_PROVIDER_DETAIL = "/provider-account"   // 供应商详情


// export const apply_payment        = ""
export const COMMIT_AUDIT         = "/po/po_approval";
export const CANCEL_SOURING_ORDER = "/po/cancel";          // 取消采购单
export const EXPORT_SOURING_ORDER = "/po-download-pdf/4";  // 导出
export const DELETE_SOURING_ORDER = "/po/delete";          //删除采购单