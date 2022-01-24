/*
 * @Author: lijunwei
 * @Date: 2022-01-24 15:50:14
 * @LastEditTime: 2022-01-24 16:10:48
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Card, IndexTable, Layout, Page, Thumbnail } from "@shopify/polaris";
import { useMemo } from "react";
import { FstlnTimeline } from "../../components/FstlnTimeline/FstlnTimeline";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingCardSection } from "../../components/SecondaryCard/SourcingCardSection";
import { InRepositoryManualModal } from "./piece/InRepositoryManualModal";

function RepositoryDetail(props) {

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
            title="产品明细"
          >
            <div>
              <IndexTable
                itemCount={orderList.length}
                headings={[
                  { title: '货品SKU' },
                  { title: '商品信息' },
                  { title: '预入库数量' },
                  { title: '已入库数量' },
                  { title: '关联采购单' },
                  { title: '关联发货单' },

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
          <Card title="基本信息">
            <SourcingCardSection title="入库单号" text="text 文字" />
            <SourcingCardSection title="单据类型" text="text 文字" />
            <SourcingCardSection title="货主" text="text 文字" />
            <SourcingCardSection title="货区" text="text 文字" />
            <SourcingCardSection title="供应商" text="text 文字" />
            <SourcingCardSection title="收货仓库" text="text 文字" />
            <SourcingCardSection title="第三方仓库" text="text 文字" />
          </Card>
          <Card title="费用信息">
            <SourcingCardSection title="运费" text="text 文字" />
          </Card>
        </Layout.Section>
      </Layout>


    <InRepositoryManualModal />
    </Page>
  );
}
export { RepositoryDetail }