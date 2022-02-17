/*
 * @Author: lijunwei
 * @Date: 2022-01-24 17:49:30
 * @LastEditTime: 2022-02-17 15:26:40
 * @LastEditors: lijunwei
 * @Description: 
 */

export const PO_STATUS_ALL     = "";
export const PO_STATUS_PENDING = "po_pending";  // 已创建/待完成
export const PO_STATUS_FINISH  = "po_finish";   // 已完结
export const PO_STATUS_CANCEL  = "po_cancel";   // 已取消


export const AUDIT_UNAUDITED            = "audit_unaudited"
export const AUDIT_AUDITING             = "audit_auditing"
export const AUDIT_PASS                 = "audit_pass"
export const AUDIT_FAILURE              = "audit_failure"
// export const AUDIT_REVOKING             = "audit_revoking"
export const AUDIT_REVOKED              = "audit_revoked"

export const PAYMENT_STATUS_PENDING            = 'payment_pending';   // 未支付
export const PAYMENT_STATUS_APPLYING           = 'payment_applying';  // 审批中
export const PAYMENT_STATUS_PASS               = 'payment_pass';      // 已通过
export const PAYMENT_STATUS_PAID               = 'payment_paid';      // 已支付
export const PAYMENT_STATUS_FAILURE            = 'payment_failure';   // 已驳回

export const DELIVERY_PENDING           = "delivery_pending"
export const DELIVERY_TRANSPORT         = "delivery_transport"
export const DELIVERY_PARTIAL_TRANSPORT = "delivery_partial_transport"
export const DELIVERY_ALREADY_TRANSPORT = "delivery_already_transport"
export const DELIVERY_PARTIAL_FINISH    = "delivery_partial_finish"
export const DELIVERY_FINISH            = "delivery_finish"

export const REPO_STATUS_ALL     = "";
export const REPO_STATUS_PENDING = "pending";
export const REPO_STATUS_PORTION = "portion";
export const REPO_STATUS_FAILURE = "failure";
export const REPO_STATUS_SUCCESS = "success";

export const INBOUND_STATUS_ALL     = ''
export const INBOUND_STATUS_PENDING = 'inbound_pending'
export const INBOUND_STATUS_PORTION = 'inbound_portion'
export const INBOUND_STATUS_FINISH  = 'inbound_finish'


export const AUDIT_STATUS = new Map([
  [ AUDIT_UNAUDITED, "待审批"],
  [ AUDIT_AUDITING , "审批中"],
  [ AUDIT_PASS     , "已通过"],
  [ AUDIT_FAILURE  , "已驳回"],
  // [ AUDIT_REVOKING , "撤销中"],
  [ AUDIT_REVOKED  , "已撤销"],
])


export const PAYMENT_STATUS = new Map([
  [ PAYMENT_STATUS_PENDING  , "未支付" ],
  [ PAYMENT_STATUS_APPLYING , "审批中" ],
  [ PAYMENT_STATUS_PASS     , "已通过" ],
  [ PAYMENT_STATUS_PAID     , "已支付" ],
  [ PAYMENT_STATUS_FAILURE  , "已驳回" ],
])

export const DELIVERY_STATUS = new Map([
  [ DELIVERY_PENDING          , "未发货"],
  [ DELIVERY_TRANSPORT        , "发货中"],
  [ DELIVERY_PARTIAL_TRANSPORT, "部分发货"],
  [ DELIVERY_ALREADY_TRANSPORT, "已发货"],
  [ DELIVERY_PARTIAL_FINISH   , "部分收货"],
  [ DELIVERY_FINISH           , "已收货"],
])



export const BUSINESS_TYPE = [
 {label: "电商B2C", value: "电商B2C"},
 {label: "分销B2B", value: "分销B2B"},
]

export const PLATFORM_LIST = [
  {label: "", value: ""},
  {label: "亚马逊", value: "亚马逊"},
  {label: "Shopify", value: "Shopify"},
]
  

export const DEPARTMENT_LIST = [
  {label: "总部", value: "总部"},
  {label: "日本", value: "日本"},
  {label: "韩国", value: "韩国"},

]


export const REPO_STATUS = new Map([
  [ REPO_STATUS_PENDING , '未预报' ],     // 未预报
  [ REPO_STATUS_PORTION , '部分预报' ],   // 部分预报
  // [ REPO_STATUS_FAILURE , '预报失败' ],   // 预报失败
  [ REPO_STATUS_SUCCESS , '已预报' ],     // 完成、成功
])

export const INBOUND_STATUS = new Map([
  [ INBOUND_STATUS_PENDING , "待入库"],
  [ INBOUND_STATUS_PORTION , "部分入库"],
  [ INBOUND_STATUS_FINISH  , "已入库"]
])


export const INBOUND_TYPE = {
  PCS: "item_type_pcs",
  BOX: "item_type_box",
  PALLET: "item_type_pallet",
}