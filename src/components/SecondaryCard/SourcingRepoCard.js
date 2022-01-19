/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:13:05
 * @LastEditTime: 2022-01-19 17:24:04
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Card } from "@shopify/polaris";
import { SourcingCardSection } from "./SourcingCardSection";

function SourcingRepoCard(props) {

  return (
    
    <Card title="收货仓库">
    
      <SourcingCardSection title="名称" text="text 文字" />
      <SourcingCardSection title="地址" text="text 文字" />
      <SourcingCardSection title="电话" text="text 文字" />
      <SourcingCardSection title="联系人" text="text 文字" />

    </Card>
  );
}
export { SourcingRepoCard }
