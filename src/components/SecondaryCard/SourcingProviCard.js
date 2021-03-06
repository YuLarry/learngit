/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:12:19
 * @LastEditTime: 2022-03-11 19:32:16
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Card } from "@shopify/polaris";
import { SourcingCardSection } from "./SourcingCardSection";

function SourcingProviCard(props) {

  const { provInfo = {}, noCardNum = false } = props;
  const {
    business_address = "",
    business_name = "",
    contacts = "",
    id = "",
    phone = "",
    account_id = "",
    provider_account = null,
  } = provInfo


  return (
    <Card title="供应商">
      <SourcingCardSection title="名称" text={ business_name } />
      <SourcingCardSection title="地址" text={ business_address } />
      <SourcingCardSection title="电话" text={ phone } />
      <SourcingCardSection title="联系人" text={ contacts } />
      { !noCardNum && <SourcingCardSection title="收款账户" text={ account_id || ( provider_account && provider_account.bank_card_number ) || "" } /> }

    </Card>
  );
}
export { SourcingProviCard }
