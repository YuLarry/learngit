/*
 * @Author: lijunwei
 * @Date: 2022-01-24 17:49:30
 * @LastEditTime: 2022-01-24 18:50:23
 * @LastEditors: lijunwei
 * @Description: 
 */

export const AUDIT_STATUS = new Map([
  ["audit_unaudited", "待审核、未审批"],
  ["audit_auditing" , "审核中"],
  ["audit_pass"     , "审核通过"],
  ["audit_failure"  , "审核失败/支付失败"],
  ["audit_revoked"  , "审核撤销"],
])

export const PAYMENT_STATUS = new Map([
  ["payment_pending" , "未支付"],
  ["payment_applying", "支付中"],
  ["payment_prepaid" , "部分支付"],
  ["payment_pass"    , "已通过"],
  ["payment_revoked" , "被撤销"],
  ["payment_failure" , "已驳回"],
])

export const DELIVERY_STATUS = new Map([
  ["delivery_pending"          , "待发货"],
  ["delivery_partial_transport", "部分发货"],
  ["delivery_partial_finish"   , "部分收货"],
  ["delivery_transport"        , "发货中"],
  ["delivery_finish"           , "已收货"],
])