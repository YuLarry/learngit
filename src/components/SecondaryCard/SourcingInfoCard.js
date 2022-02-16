/*
 * @Author: lijunwei
 * @Date: 2022-01-20 16:25:34
 * @LastEditTime: 2022-02-15 18:24:33
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Card } from "@shopify/polaris";
import { SourcingCardSection } from "./SourcingCardSection";


function SourcingInfoCard(props) {

  const { poInfo = {}, hasMore=false } = props;
  const {
    brand_name = "",
    subject_title = "",
    provider_name = "",
    bank_card_number = "",
    warehouse_name = "",
    purchase_total = "",
    currency = "",
    purchase_qty = "",
    remark = "",
    division = "",
    business_type = "",
    platform = "",
  } = poInfo;

  return (
    <Card title="采购信息">
      <SourcingCardSection title="项目" text={ brand_name } />
      <SourcingCardSection title="采购方" text={ subject_title } />
      { hasMore && <SourcingCardSection title="供应商" text={ provider_name } /> }
      { hasMore && <SourcingCardSection title="收款账户" text={ bank_card_number } /> }
      { hasMore && <SourcingCardSection title="收货仓库" text={ warehouse_name } /> }
      <SourcingCardSection title="金额" text={ purchase_total } />
      <SourcingCardSection title="币制" text={ currency } />
      <SourcingCardSection title="采购数量" text={ purchase_qty } />
      <SourcingCardSection title="事业部" text={ division } />
      <SourcingCardSection title="业务类型" text={ business_type } />
      <SourcingCardSection title="平台" text={ platform } />
    </Card>
  );
}
export { SourcingInfoCard }