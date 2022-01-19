/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:12:19
 * @LastEditTime: 2022-01-19 17:22:14
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Card } from "@shopify/polaris";
import { SourcingCardSection } from "./SourcingCardSection";

function SourcingProviCard(props) {

  return (
    <Card title="供应商">
      <SourcingCardSection title="名称" text="text 文字" />
      <SourcingCardSection title="地址" text="text 文字" />
      <SourcingCardSection title="电话" text="text 文字" />
      <SourcingCardSection title="联系人" text="text 文字" />
      <SourcingCardSection title="收款账户" text="text 文字" />
      
    </Card>
  );
}
export { SourcingProviCard }
