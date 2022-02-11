/*
 * @Author: lijunwei
 * @Date: 2022-02-10 10:25:56
 * @LastEditTime: 2022-02-10 19:03:50
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge } from "@shopify/polaris";
import { INBOUND_STATUS, INBOUND_STATUS_FINISH, INBOUND_STATUS_PENDING, INBOUND_STATUS_PORTION } from "../../utils/StaticData";


function BadgeInboundStatus(props) {
  
  let progress;
  let status;

  switch (props.status) {
    case INBOUND_STATUS_PENDING:
      progress = "incomplete";
      break;
    case INBOUND_STATUS_PORTION:
      progress = "partiallyComplete";
      status = "attention"
      break;
    case INBOUND_STATUS_FINISH:
      progress = "complete";
      status = "success"
      break;
    default:
      break;
  }

  return (
    <Badge progress={progress} status={status}>{INBOUND_STATUS.get(props.status)}</Badge>
  );
}
export { BadgeInboundStatus }