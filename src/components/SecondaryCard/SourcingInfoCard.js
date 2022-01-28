/*
 * @Author: lijunwei
 * @Date: 2022-01-20 16:25:34
 * @LastEditTime: 2022-01-28 18:10:06
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Card } from "@shopify/polaris";
import { SourcingCardSection } from "./SourcingCardSection";


function SourcingInfoCard(props) {

  const { poInfo = {} } = props;
  const {
    brand = "",
    subject_title = "",
    provider_name = "",
    bank_card_number = "",
    warehouse_name = "",
    price = "",
    currency = "",
    po_total = "",
    remark = "",
    cause_team = "",
    business_type = "",
    platform = "",
  } = poInfo;

  return (
    <Card title="采购信息">
      <SourcingCardSection title="项目" text={ brand } />
      <SourcingCardSection title="采购方" text={ subject_title } />
      <SourcingCardSection title="供应商" text={ provider_name } />
      <SourcingCardSection title="收款账户" text={ bank_card_number } />
      <SourcingCardSection title="收货仓库" text={ warehouse_name } />
      <SourcingCardSection title="金额" text={ price } />
      <SourcingCardSection title="币制" text={ currency } />
      <SourcingCardSection title="采购数量" text={ po_total } />
      <SourcingCardSection title="事业部" text={ cause_team } />
      <SourcingCardSection title="业务类型" text={ business_type } />
      <SourcingCardSection title="平台" text={ platform } />
    </Card>
  );
}
export { SourcingInfoCard }