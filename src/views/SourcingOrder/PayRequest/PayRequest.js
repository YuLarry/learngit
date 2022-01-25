/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:05:46
 * @LastEditTime: 2022-01-25 16:20:45
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Button, Card, DropZone, IndexTable, Layout, Page, ResourceItem, ResourceList, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useMemo, useState } from "react";
import { DatePopover } from "../../../components/DatePopover/DatePopover";
import { ProductInfoPopover } from "../../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingCardSection } from "../../../components/SecondaryCard/SourcingCardSection";
import { SourcingInfoCard } from "../../../components/SecondaryCard/SourcingInfoCard";
import {
  DeleteMinor
} from '@shopify/polaris-icons';
import "./payRequest.scss";

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


  const invoiceItem = useMemo(() => {
    return customers.map(
      ({ id, name, location, orders, amountSpent }, index) => (
        <Card.Section>
          
          <div className="invoice-item">
            <div className="invoice-col">
              <p>发票金额</p>
              <div style={{ maxWidth: "15rem" }}>
                <TextField
                  type="number"
                />
              </div>
              
            </div>
            <div className="invoice-col">
              <p>发票日期</p>
              <DatePopover />

            </div>
            <div className="invoice-col">
              <p>发票文件</p>
              <div style={{ width: "50px", height: "50px" }}>
                <DropZone
                  id={`file-${index}`}
                >
                  <DropZone.FileUpload />
                </DropZone>
              </div>
            </div>
            <div className="invoice-col invoice-del">
              <span>
                <Button
                  icon={DeleteMinor}
                ></Button>
              </span>
            </div>
          </div>
        </Card.Section>
      ),
    )
  },
    [customers, selectedResources]
  );



  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/sourcing' }]}
      title="申请付款"
      titleMetadata={<div><Badge status="attention">Verified</Badge> <Badge status="attention">Verified</Badge> <Badge status="attention">Verified</Badge></div>}
      subtitle="2021-12-25 10:05:00 由xxxxxxxxx创建"
    >
      <Layout>
        <Layout.Section>
          <Card title="发票信息"
          >

            {invoiceItem}

            <div style={{ textAlign: "center", padding: "1em" }}>
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
          <SourcingInfoCard />
        </Layout.Section>
      </Layout>



    </Page>
  );
}
export { PayRequest }

