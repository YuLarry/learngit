/*
 * @Author: lijunwei
 * @Date: 2022-01-20 16:16:03
 * @LastEditTime: 2022-01-20 19:21:27
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Card, IndexTable, Layout, Page, Thumbnail } from "@shopify/polaris";
import { useMemo } from "react";
import { FstlnTimeline } from "../../components/FstlnTimeline/FstlnTimeline";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingInfoCard } from "../../components/SecondaryCard/SourcingInfoCard";
import { SourcingNoteCard } from "../../components/SecondaryCard/SourcingNoteCard";
import { SourcingProviCard } from "../../components/SecondaryCard/SourcingProviCard";
import { SourcingRepoCard } from "../../components/SecondaryCard/SourcingRepoCard";

function SourcingDetail(props) {


  const orderList = [
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

  const rowMarkup = useMemo(() => {
    return orderList.map(
      ({ id, name, location, orders, amountSpent }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          position={index}
        >
          <IndexTable.Cell>
            <ProductInfoPopover popoverNode={productInfo()} tableCellText="custom text" />

          </IndexTable.Cell>
          <IndexTable.Cell>{location}</IndexTable.Cell>
          <IndexTable.Cell>

          </IndexTable.Cell>
          <IndexTable.Cell>

          </IndexTable.Cell>
        </IndexTable.Row>
      ),
    )
  },
    []
  );

  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/sourcing' }]}
      title="order id"
      titleMetadata={<div><Badge status="attention">Verified</Badge> <Badge status="attention">Verified</Badge> <Badge status="attention">Verified</Badge></div>}
      subtitle="2021-12-25 10:05:00 由xxxxxxxxx创建"
    >
      <Layout>
        <Layout.Section>


          <Card
            title="采购明细"
          >
            <div>
              <IndexTable
                itemCount={orderList.length}
                headings={[
                  { title: '系统SKU' },
                  { title: '采购数量' },
                  { title: '金额' },

                ]}
                selectable={false}
              >
                {rowMarkup}
              </IndexTable>
            </div>


            <br />
          </Card>

          <Card
            title="操作记录"
          >
  
            <FstlnTimeline />
            
          </Card>

        </Layout.Section>
        <Layout.Section secondary>
          <SourcingInfoCard />
          <SourcingProviCard />
          <SourcingRepoCard />
          <SourcingNoteCard />
        </Layout.Section>
      </Layout>



    </Page>
  );
}
export { SourcingDetail }
