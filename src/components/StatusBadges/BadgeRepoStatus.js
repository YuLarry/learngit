/*
 * @Author: lijunwei
 * @Date: 2022-02-10 10:25:56
 * @LastEditTime: 2022-02-10 10:35:02
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge } from "@shopify/polaris";
import { REPO_STATUS, REPO_STATUS_PENDING, REPO_STATUS_PORTION, REPO_STATUS_SUCCESS } from "../../utils/StaticData";


function BadgeRepoStatus(props) {
  
  let progress;
  let status;

  switch (props.status) {
    case REPO_STATUS_PENDING:
      progress = "incomplete";
      break;
    case REPO_STATUS_PORTION:
      progress = "partiallyComplete";
      status = "attention"
      break;
    case REPO_STATUS_SUCCESS:
      progress = "complete";
      status = "success"
      break;
    default:
      break;
  }

  return (
    <Badge progress={progress} status={status}>{REPO_STATUS.get(props.status)}</Badge>
  );
}
export { BadgeRepoStatus }