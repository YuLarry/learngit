/*
 * @Author: lijunwei
 * @Date: 2022-01-21 15:28:14
 * @LastEditTime: 2022-01-21 15:39:17
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Page } from "@shopify/polaris";

function DeliveryInbound(props) {
  
  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/delivery' }]}
      title="xxxxf发货单"
      subtitle="2021-12-25 10:05:00 由xxxxxxxxx创建"
    >
      hello inbound

    </Page>
  );
}
export { DeliveryInbound }

