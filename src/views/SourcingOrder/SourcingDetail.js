/*
 * @Author: lijunwei
 * @Date: 2022-01-20 16:16:03
 * @LastEditTime: 2022-02-11 15:34:24
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Card, IndexTable, Layout, Page, Thumbnail } from "@shopify/polaris";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getSourcingOrderDetail } from "../../api/requests";
import { FstlnTimeline } from "../../components/FstlnTimeline/FstlnTimeline";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingInfoCard } from "../../components/SecondaryCard/SourcingInfoCard";
import { SourcingRemarkCard } from "../../components/SecondaryCard/SourcingNoteCard";
import { SourcingProviCard } from "../../components/SecondaryCard/SourcingProviCard";
import { SourcingRepoCard } from "../../components/SecondaryCard/SourcingRepoCard";

function SourcingDetail(props) {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

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

  useEffect(() => {
    getSourcingOrderDetail(id)
    .then(res=>{
      console.log(res);
      setOrder(res.data)
    })
    
  }, []);

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
            <Card.Section>
              <FstlnTimeline />

            </Card.Section>

          </Card>

        </Layout.Section>
        <Layout.Section secondary>
          <SourcingInfoCard poInfo={ order || {} } />
          <SourcingProviCard provInfo={ order ? order.provider : {} } />
          <SourcingRepoCard wareInfo={ order ? order.warehouse : {} } />
          <SourcingRemarkCard />
        </Layout.Section>
      </Layout>



    </Page>
  );
}
export { SourcingDetail }
