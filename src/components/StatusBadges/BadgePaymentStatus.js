/*
 * @Author: lijunwei
 * @Date: 2022-01-26 14:50:33
 * @LastEditTime: 2022-01-27 12:35:31
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge } from "@shopify/polaris";
import { PAYMENT_APPLYING, PAYMENT_PASS, PAYMENT_PENDING, PAYMENT_PREPAID, PAYMENT_STATUS } from "../../utils/StaticData";

function BadgePaymentStatus(props) {

  let progress;
  let status;

  switch (props.status) {
    case PAYMENT_PENDING:
      progress = "incomplete";
      break;
    case PAYMENT_APPLYING:
      progress = "incomplete";
      status = "attention"
      break;
    case PAYMENT_PREPAID:
      progress = "partiallyComplete";
      status = "warning"
      break;
    case PAYMENT_PASS:
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