/*
 * @Author: lijunwei
 * @Date: 2022-01-24 17:49:30
 * @LastEditTime: 2022-01-27 12:28:28
 * @LastEditors: lijunwei
 * @Description: 
 */


export const AUDIT_UNAUDITED            = "audit_unaudited"
export const AUDIT_AUDITING             = "audit_auditing"
export const AUDIT_PASS                 = "audit_pass"
export const AUDIT_FAILURE              = "audit_failure"
export const AUDIT_REVOKING             = "audit_revoking"
export const AUDIT_REVOKED              = "audit_revoked"

export const PAYMENT_PENDING            = "payment_pending"
export const PAYMENT_APPLYING           = "payment_applying"
export const PAYMENT_PREPAID            = "payment_prepaid"
export const PAYMENT_PASS               = "payment_pass"
// export const PAYMENT_REVOKED            = "payment_revoked"
// export const PAYMENT_FAILURE            = "payment_failure"

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
  [ AUDIT_REVOKING , "撤销中"],
  [ AUDIT_REVOKED  , "已撤销"],
])

export const PAYMENT_STATUS = new Map([
  [ PAYMENT_PENDING , "未支付"],
  [ PAYMENT_APPLYING, "支付中"],
  [ PAYMENT_PREPAID , "部分支付"],
  [ PAYMENT_PASS    , "已支付"],
  // [ PAYMENT_REVOKED , "被撤销"],
  // [ PAYMENT_FAILURE , "已驳回"],
])

export const DELIVERY_STATUS = new Map([
  [ DELIVERY_PENDING          , "未发货"],
  [ DELIVERY_TRANSPORT        , "发货中"],
  [ DELIVERY_PARTIAL_TRANSPORT, "部分发货"],
  [ DELIVERY_ALREADY_TRANSPORT, "已发货"],
  [ DELIVERY_PARTIAL_FINISH   , "部分收货"],
  [ DELIVERY_FINISH           , "已收货"],
])