/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:13:05
 * @LastEditTime: 2022-01-28 15:05:02
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Card } from "@shopify/polaris";
import { SourcingCardSection } from "./SourcingCardSection";

function SourcingRepoCard(props) {


  const { wareInfo = {} } = props;
  const {
    cn_address = "",
    code = "",
    contacts_cn_name = "",
    name = "",
    phone = "",
  } = wareInfo;

  return (

    <Card title="收货仓库">

      <SourcingCardSection title="名称" text={ name } />
      <SourcingCardSection title="地址" text={ cn_address } />
      <SourcingCardSection title="电话" text={ phone } />
      <SourcingCardSection title="联系人" text={ contacts_cn_name } />

    </Card>
  );
}
export { SourcingRepoCard }
