/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:05:46
 * @LastEditTime: 2022-01-19 19:41:43
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Button, Card, DropZone, IndexTable, Layout, Page, TextStyle, useIndexResourceState } from "@shopify/polaris";
import { DatePopover } from "../../components/DatePopover/DatePopover";
import { SourcingCardSection } from "../../components/SecondaryCard/SourcingCardSection";

function PayRequest(props) {

  // ====

  const customers = [
    {
      id: '3411',
      url: 'customers/341',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      orders: 20,
      amountSpent: '$2,400',
    },
    {
      id: '2561',
      url: 'customers/256',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      orders: 30,
      amountSpent: '$140',
    },
  ];
  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const { selectedResources } = useIndexResourceState(customers);



  const invoiceRowMarkup = customers.map(
    ({ id, name, location, orders, amountSpent }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          {index}
        </IndexTable.Cell>
        <IndexTable.Cell>{location}</IndexTable.Cell>
        <IndexTable.Cell>
          <DatePopover />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ width: 50, height: 50 }}>
            <DropZone>
              <DropZone.FileUpload />
            </DropZone>
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );




  const rowMarkup = customers.map(
    ({ id, name, location, orders, amountSpent }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <TextStyle variation="strong">{name}</TextStyle>
        </IndexTable.Cell>
        <IndexTable.Cell>{location}</IndexTable.Cell>
        <IndexTable.Cell>{orders}</IndexTable.Cell>
        <IndexTable.Cell>{amountSpent}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  // ===

  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/sourcing' }]}
      title="申请付款"
      titleMetadata={<div><Badge status="attention">Verified</Badge> <Badge status="attention">Verified</Badge> <Badge status="attention">Verified</Badge></div>}
      subtitle="2021-12-25 10:05:00 由xxxxxxxxx创建"
    >
      <Layout>
        <Layout.Section>
          <Card title="发票信息" sectioned>
            <IndexTable
              resourceName={resourceName}
              itemCount={customers.length}
              headings={[
                { title: 'ID' },
                { title: '发票金额' },
                { title: '发票日期' },
                { title: '发票文件' },
              ]}
            >
              {invoiceRowMarkup}
            </IndexTable>
            <div style={{ textAlign: "center" }}>
              <Button onClick={() => { }}>添加发票</Button>
            </div>
          </Card>
          <Card
            title="采购明细"
          >
            <IndexTable
              resourceName={resourceName}
              itemCount={customers.length}
              selectable={false}
              headings={[
                { title: '系统SKU' },
                { title: '采购数量' },
                { title: '金额' },
              ]}
            >
              {rowMarkup}
            </IndexTable>

            <br />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
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

        </Layout.Section>
      </Layout>



    </Page>
  );
}
export { PayRequest }

