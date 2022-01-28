/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:12:19
 * @LastEditTime: 2022-01-28 14:56:30
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Card } from "@shopify/polaris";
import { SourcingCardSection } from "./SourcingCardSection";

function SourcingProviCard(props) {

  const { provInfo = {} } = props;
  const {
    business_address = "",
    business_name = "",
    contacts = "",
    id = "",
    phone = "",
    account_id = "",
  } = provInfo


  return (
    <Card title="供应商">
      <SourcingCardSection title="名称" text={ business_name } />
      <SourcingCardSection title="地址" text={ business_address } />
      <SourcingCardSection title="电话" text={ phone } />
      <SourcingCardSection title="联系人" text={ contacts } />
      <SourcingCardSection title="收款账户" text={ account_id } />

    </Card>
  );
}
export { SourcingProviCard }
