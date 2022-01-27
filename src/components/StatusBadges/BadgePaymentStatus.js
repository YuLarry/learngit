/*
 * @Author: lijunwei
 * @Date: 2022-01-26 14:50:33
 * @LastEditTime: 2022-01-27 15:19:34
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge } from "@shopify/polaris";
import { PAYMENT_STATUS, PAYMENT_STATUS_APPLYING, PAYMENT_STATUS_FAILURE, PAYMENT_STATUS_PAID, PAYMENT_STATUS_PASS, PAYMENT_STATUS_PENDING } from "../../utils/StaticData";

function BadgePaymentStatus(props) {

  let progress;
  let status;

  switch (props.status) {
    case PAYMENT_STATUS_PENDING:
      progress = "incomplete";
      break;
    case PAYMENT_STATUS_APPLYING:
      progress = "incomplete";
      status = "attention"
      break;
    case PAYMENT_STATUS_PASS:
      progress = "partiallyComplete";
      status = "warning"
      break;
    case PAYMENT_STATUS_PAID:
      progress = "complete";
      status = "success"
      break;
    case PAYMENT_STATUS_FAILURE:
      progress = "complete";
      status = "success"
      break;
    default:
      break;
  }

  return (
    <Badge progress={progress} status={status}>{PAYMENT_STATUS.get(props.status)}</Badge>
  );
}
export { BadgePaymentStatus }