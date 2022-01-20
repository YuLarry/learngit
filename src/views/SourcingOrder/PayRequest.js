/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:05:46
 * @LastEditTime: 2022-01-20 15:57:57
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Button, Card, DropZone, IndexTable, Layout, Page, ResourceItem, ResourceList, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useMemo, useState } from "react";
import { DatePopover } from "../../components/DatePopover/DatePopover";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingCardSection } from "../../components/SecondaryCard/SourcingCardSection";

function PayRequest(props) {

  const [selectedItems, setSelectedItems] = useState([]);


  const productInfo = (product) => {
    return (
      <div className="product-container" style={{ maxWidth: "400px", display: "flex", alignItems: "flex-start" }}>

        <Thumbnail
          source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
          alt="Black choker necklace"
          size="small"
        />
        <div style={{ flex: 1, marginLeft: "1em" }}>
          <h4>ZTE Watch Live Black</h4>
          <h4>ZTE 手表 黑</h4>
          <span>$100</span>
        </div>
      </div>
    )
  }


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


  const items = [
    {
      id: 101,
      url: 'customers/341',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
    },
    {
      id: 201,
      url: 'customers/256',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
    },
  ];

  function renderItem(item, index) {
    const { id, url, name, location } = item;

    return (
      <ResourceItem
        id={id}
        // url={url}
        accessibilityLabel={`View details for ${name}`}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {index}
          </div>
          <div>
            <TextField />
          </div>
          <div>
            <DatePopover />
          </div>
          <div>
            <div style={{ width: "50px", height: "50px" }}>
              <DropZone
                id={`file-${id}`}
                style={{ height: "50px", width: "50px" }}
              >
                <DropZone.FileUpload />
              </DropZone>
            </div>
          </div>
        </div>
      </ResourceItem>
    );
  }


  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const { selectedResources } = useIndexResourceState(customers);



  const invoiceRowMarkup = useMemo(() => {
    return customers.map(
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
            <div style={{ width: "50px", height: "50px" }}>
              <DropZone
                id={`file-${index}`}
                style={{ height: "50px", width: "50px" }}
              >
                <DropZone.FileUpload />
              </DropZone>
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      ),
    )
  },
    [customers, selectedResources],
  );


  const rowMarkup = useMemo(() => {
    return customers.map(
      ({ id, name, location, orders, amountSpent }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <ProductInfoPopover popoverNode={productInfo()} tableCellText="custom text" />
          </IndexTable.Cell>
          {/* <IndexTable.Cell>{location}</IndexTable.Cell> */}
          <IndexTable.Cell>{orders}</IndexTable.Cell>
          <IndexTable.Cell>{amountSpent}</IndexTable.Cell>
        </IndexTable.Row>
      ),
    )
  },
    [customers, selectedResources]
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
              onSelectionChange={(v) => { console.log(v) }}
            >
              {invoiceRowMarkup}
            </IndexTable>
            {/* <ResourceList
              resourceName={resourceName}
              items={items}
              renderItem={renderItem}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              selectable
            /> */}

            <div style={{ textAlign: "center" }}>
              <Button onClick={() => { }}>添加发票</Button>
            </div>
          </Card>

          <Card
            title="采购明细"
          >
            <div>
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
            </div>


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

