/*
 * @Author: lijunwei
 * @Date: 2022-01-26 14:50:48
 * @LastEditTime: 2022-01-26 16:25:15
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge } from "@shopify/polaris";
import { DELIVERY_STATUS } from "../../utils/StaticData";

function BadgeDeliveryStatus(props) {

  let progress;
  let status;

  switch (props.status) {
    case "delivery_pending":
      progress = "incomplete";
      break;
    case "delivery_transport":
      progress = "incomplete";
      status = "attention"
      break;
    case "delivery_partial_transport":
      progress = "partiallyComplete";
      status = "warning"
      break;
    case "delivery_already_transport":
      progress = "complete";
      status = "success"
      break;
    case "delivery_partial_finish":
      progress = "partiallyComplete";
      status = "warning"
      break;
    case "delivery_finish":
      progress = "complete";
      status = "success"
      break;
    default:
      break;
  }

  return (
    <Badge progress={progress} status={status}>{DELIVERY_STATUS.get(props.status)}</Badge>
  );
}
export { BadgeDeliveryStatus }