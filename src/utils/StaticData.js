/*
 * @Author: lijunwei
 * @Date: 2022-01-24 17:49:30
 * @LastEditTime: 2022-01-26 15:33:57
 * @LastEditors: lijunwei
 * @Description: 
 */

export const AUDIT_STATUS = new Map([
  ["audit_unaudited", "待审批"],
  ["audit_auditing" , "审批中"],
  ["audit_pass"     , "已通过"],
  ["audit_failure"  , "已驳回"],
  ["audit_revoking" , "撤销中"],
  ["audit_revoked"  , "已撤销"],
])

export const PAYMENT_STATUS = new Map([
  ["payment_pending" , "未支付"],
  ["payment_applying", "支付中"],
  ["payment_prepaid" , "部分支付"],
  ["payment_pass"    , "已支付"],
  // ["payment_revoked" , "被撤销"],
  // ["payment_failure" , "已驳回"],
])

export const DELIVERY_STATUS = new Map([
  ["delivery_pending"          , "未发货"],
  ["delivery_transport"        , "发货中"],
  ["delivery_partial_transport", "部分发货"],
  ["delivery_already_transport", "已发货"],
  ["delivery_partial_finish"   , "部分收货"],
  ["delivery_finish"           , "已收货"],
])