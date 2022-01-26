import { Badge } from "@shopify/polaris";
import { AUDIT_STATUS } from "../../utils/StaticData";

/*
 * @Author: lijunwei
 * @Date: 2022-01-26 14:49:36
 * @LastEditTime: 2022-01-26 16:24:54
 * @LastEditors: lijunwei
 * @Description: 
 */
function BadgeAuditStatus(props) {
  let progress;
  let status;

  switch (props.status) {
    case "audit_unaudited":
      progress = "incomplete";
      break;
    case "audit_auditing":
      progress = "incomplete";
      status = "attention"
      break;
    case "audit_failure":
      progress = "partiallyComplete";
      status = "critical"
      break;
    case "audit_revoking":
      progress = "complete";
      status = "success"
      break;
    case "audit_revoked":
      progress = "incomplete";
      status = "attention"
      break;
    case "audit_pass":
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