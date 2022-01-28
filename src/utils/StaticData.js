/*
 * @Author: lijunwei
 * @Date: 2022-01-24 17:49:30
 * @LastEditTime: 2022-01-28 15:29:31
 * @LastEditors: lijunwei
 * @Description: 
 */

export const PO_STATUS = {
  ALL:      "",
  PENDING : "po_pending",   // 已创建/待完成
  FINISH  : "po_finish",    // 已完结
  CANCEL  : "po_cancel",    // 已取消
}


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