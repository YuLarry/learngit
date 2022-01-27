import { Badge } from "@shopify/polaris";
import { AUDIT_AUDITING, AUDIT_FAILURE, AUDIT_PASS, AUDIT_REVOKED, AUDIT_REVOKING, AUDIT_STATUS, AUDIT_UNAUDITED } from "../../utils/StaticData";

/*
 * @Author: lijunwei
 * @Date: 2022-01-26 14:49:36
 * @LastEditTime: 2022-01-27 12:33:36
 * @LastEditors: lijunwei
 * @Description: 
 */
function BadgeAuditStatus(props) {
  let progress;
  let status;

  switch (props.status) {
    case AUDIT_UNAUDITED:
      progress = "incomplete";
      break;
    case AUDIT_AUDITING:
      progress = "incomplete";
      status = "attention"
      break;
    case AUDIT_FAILURE:
      progress = "partiallyComplete";
      status = "critical"
      break;
    case AUDIT_REVOKING:
      progress = "complete";
      status = "success"
      break;
    case AUDIT_REVOKED:
      progress = "incomplete";
      status = "attention"
      break;
    case AUDIT_PASS:
      progress = "complete";
      status = "success"
      break;
    default:
      break;
  }

  return (
    <Badge progress={progress} status={status}>{AUDIT_STATUS.get(props.status)}</Badge>
  );
}
export { BadgeAuditStatus }