/*
 * @Author: lijunwei
 * @Date: 2022-01-20 16:25:34
 * @LastEditTime: 2022-01-20 16:30:31
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Card } from "@shopify/polaris";
import { SourcingCardSection } from "./SourcingCardSection";


function SourcingInfoCard(props) {

  return (
    <Card title="采购信息">
      <SourcingCardSection title="项目" text="text 文字" />
      <SourcingCardSection title="采购方" text="text 文字" />
      <SourcingCardSection title="供应商" text="text 文字" />
      <SourcingCardSection title="收款账户" text="text 文字" />
      <SourcingCardSection title="收货仓库" text="text 文字" />
      <SourcingCardSection title="金额" text="text 文字" />
      <SourcingCardSection title="币制" text="text 文字" />
      <SourcingCardSection title="采购数量" text="text 文字" />
      <SourcingCardSection title="事业部" text="text 文字" />
      <SourcingCardSection title="业务类型" text="text 文字" />
      <SourcingCardSection title="平台" text="text 文字" />
    </Card>
  );
}
export { SourcingInfoCard }