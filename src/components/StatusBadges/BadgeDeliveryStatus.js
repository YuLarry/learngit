/*
 * @Author: lijunwei
 * @Date: 2022-01-26 14:50:48
 * @LastEditTime: 2022-03-20 15:34:45
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge } from "@shopify/polaris";
import { DELIVERY_ALREADY_TRANSPORT, DELIVERY_FINISH, DELIVERY_PARTIAL_FINISH, DELIVERY_PARTIAL_TRANSPORT, DELIVERY_PENDING, DELIVERY_STATUS, DELIVERY_TRANSPORT } from "../../utils/StaticData";

function BadgeDeliveryStatus(props) {

  let progress;
  let status;

  switch (props.status) {
    case DELIVERY_PENDING:
      progress = "incomplete";
      break;
    // case DELIVERY_TRANSPORT:
    //   progress = "incomplete";
    //   status = "attention"
    //   break;
    case DELIVERY_PARTIAL_TRANSPORT:
      progress = "partiallyComplete";
      status = "warning"
      break;
    case DELIVERY_ALREADY_TRANSPORT:
      progress = "complete";
      status = "warning"
      break;
    case DELIVERY_PARTIAL_FINISH:
      progress = "partiallyComplete";
      status = "success"
      break;
    case DELIVERY_FINISH:
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