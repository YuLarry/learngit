/*
 * @Author: lijunwei
 * @Date: 2022-01-26 14:50:33
 * @LastEditTime: 2022-01-26 16:25:09
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge } from "@shopify/polaris";
import { PAYMENT_STATUS } from "../../utils/StaticData";

function BadgePaymentStatus(props) {

  let progress;
  let status;

  switch (props.status) {
    case "payment_pending":
      progress = "incomplete";
      break;
    case "payment_applying":
      progress = "incomplete";
      status = "attention"
      break;
    case "payment_prepaid":
      progress = "partiallyComplete";
      status = "warning"
      break;
    case "payment_pass":
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