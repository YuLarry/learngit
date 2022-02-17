/*
 * @Author: lijunwei
 * @Date: 2022-01-24 15:50:14
 * @LastEditTime: 2022-02-17 18:50:08
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Card, IndexTable, Layout, Page, Thumbnail } from "@shopify/polaris";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getInboundDetail } from "../../api/requests";
import { FstlnTimeline } from "../../components/FstlnTimeline/FstlnTimeline";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingCardSection } from "../../components/SecondaryCard/SourcingCardSection";
import { BadgeInboundStatus } from "../../components/StatusBadges/BadgeInboundStatus";
import { LoadingContext } from "../../context/LoadingContext";
import { InRepositoryManualModal } from "./piece/InRepositoryManualModal";

function RepositoryDetail(props) {

  const loadingContext = useContext(LoadingContext);

  const { id } = useParams();
  const [detail, setDetail] = useState(null);

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



  const rowMarkup = useMemo(() => {
    if (!detail) return;
    return detail.item.map(
      ({ sku, po_no, goods, plan_qty, actual_qty, shipping_no }, index) => (
        <IndexTable.Row
          id={index}
          key={index}
          position={index}
        >
          <IndexTable.Cell>
            {sku}

          </IndexTable.Cell>
          <IndexTable.Cell>
            {sku}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {plan_qty}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {actual_qty}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {po_no}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {shipping_no}
          </IndexTable.Cell>
        </IndexTable.Row>
      ),
    )
  },
    [detail]
  );

  useEffect(() => {
    if (!id) return;
    loadingContext.loading(true);
    getInboundDetail(id)
      .then((res) => {
        const { data } = res;
        setDetail(data);
      })
      .finally(() => {
        loadingContext.loading(false);

      })
  }, [id]);

  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/repository' }]}
      title={ id }
      titleMetadata={<BadgeInboundStatus status={ detail && detail.status } />}
      subtitle="2021-12-25 10:05:00 由xxxxxxxxx创建"
    >
      <Layout>
        <Layout.Section>

          <Card
            title="产品明细"
          >
            <div>
              <IndexTable
                itemCount={detail && detail.item.length}
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
            <Card.Section>

              <FstlnTimeline
                timeline={detail && detail.operation_record || []}
                dateKey="created_at"

              />
            </Card.Section>

          </Card>

        </Layout.Section>
        <Layout.Section secondary>
          <Card title="基本信息">
            <SourcingCardSection title="入库单号" text={ detail && detail.inbound_no } />
            <SourcingCardSection title="单据类型" text={ detail && detail.type }/>
            <SourcingCardSection title="货主" text={ detail && detail.provider_name }/>
            <SourcingCardSection title="货区" text={ detail && detail.warehouse_area }/>
            <SourcingCardSection title="供应商" text={ detail && detail.provider_name }/>
            <SourcingCardSection title="收货仓库" text={ detail && detail.warehouse_name }/>
            <SourcingCardSection title="第三方仓库" text={ detail && detail.third_warehouse || "" }/>
          </Card>
          <Card title="费用信息">
            <SourcingCardSection title="运费" text={ detail && detail.shipping_price }/>
          </Card>
        </Layout.Section>
      </Layout>


      <InRepositoryManualModal />
    </Page>
  );
}
export { RepositoryDetail }