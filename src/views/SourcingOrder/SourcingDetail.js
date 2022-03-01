/*
 * @Author: lijunwei
 * @Date: 2022-01-20 16:16:03
 * @LastEditTime: 2022-03-01 14:06:48
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Card, IndexTable, Layout, Page, Thumbnail } from "@shopify/polaris";
import { useContext } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSourcingOrderDetail } from "../../api/requests";
import { FstlnTimeline } from "../../components/FstlnTimeline/FstlnTimeline";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingInfoCard } from "../../components/SecondaryCard/SourcingInfoCard";
import { SourcingRemarkCard } from "../../components/SecondaryCard/SourcingNoteCard";
import { SourcingProviCard } from "../../components/SecondaryCard/SourcingProviCard";
import { SourcingRepoCard } from "../../components/SecondaryCard/SourcingRepoCard";
import { BadgeAuditStatus } from "../../components/StatusBadges/BadgeAuditStatus";
import { BadgeDeliveryStatus } from "../../components/StatusBadges/BadgeDeliveryStatus";
import { BadgePaymentStatus } from "../../components/StatusBadges/BadgePaymentStatus";
import { LoadingContext } from "../../context/LoadingContext";

function SourcingDetail(props) {
  const navigate = useNavigate();
  const { id } = useParams();

  const idDecode = id && atob(id);
  const idURIDecode = idDecode && decodeURIComponent(idDecode);

  const loadingContext = useContext(LoadingContext);

  const [order, setOrder] = useState(null);


  const productInfo = ( goodsItem ) => {
      const { cn_name, en_name, id, image_url, price, sku } = goodsItem;
      return (
        <div className="product-container" style={{ maxWidth: "400px", display: "flex", alignItems: "flex-start" }}>

          <Thumbnail
            source={image_url || ""}
            alt={en_name}
            size="small"
          />
          <div style={{ flex: 1, marginLeft: "1em" }}>
            <h4>{en_name}</h4>
            <h4>{cn_name}</h4>
            <span>{price}</span>
          </div>
        </div>
      )
  }

  const rowMarkup = useMemo(() => {
    if (!order) return null;
    return order.item.map(
      ({ sku, purchase_num, goods, purchase_price }, idx) => (
        <IndexTable.Row
          id={idx}
          key={idx}
          position={idx}
        >
          <IndexTable.Cell>
            <ProductInfoPopover
              popoverNode={productInfo(goods)}
              tableCellText={sku}

            />

          </IndexTable.Cell>
          <IndexTable.Cell>
            {purchase_num}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {purchase_price}
          </IndexTable.Cell>
          {/* <IndexTable.Cell>

          </IndexTable.Cell> */}
        </IndexTable.Row>
      ),
    )
  },
    [order]
  );

  const badgesMarkup = useMemo(() => {
    if (!order) return null;
    const { audit_status, payment_status, delivery_status } = order;
    return (
      <div>
        <BadgeAuditStatus status={audit_status} />
        <BadgePaymentStatus status={payment_status} />
        <BadgeDeliveryStatus status={delivery_status} />
      </div>
    )
  }, [order])

  useEffect(() => {
    if (!id) return;
    loadingContext.loading(true);
    getSourcingOrderDetail(idDecode)
      .then(res => {
        // console.log(res);
        setOrder(res.data)
      })
      .finally(() => {
        loadingContext.loading(false);
      })

  }, []);



  return (
    <Page
      breadcrumbs={[
        {
          onAction: ()=>{
            navigate(-1);
          }
        }
      ]}
      secondaryActions={[
        {
          content: "编辑采购单",
          onAction: ()=>{
            navigate( `/sourcing/edit/${id}` )
          } 
        }
      ]}
      title={idURIDecode}
      titleMetadata={badgesMarkup}
      subtitle={ order && order.create_message || "" }
    >
      <Layout>
        <Layout.Section>
          <Card
            title="采购明细"
          >
            <div>
              <IndexTable
                itemCount={ order && order.item.length || 0}
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
              <FstlnTimeline
                dateKey="created_at"
                timeline={order ? order.operation_record.reverse() : []}
              />

            </Card.Section>

          </Card>

        </Layout.Section>
        <Layout.Section secondary>
          <SourcingInfoCard poInfo={order || {}} />
          <SourcingProviCard provInfo={order ? { ...order.provider,account_id: order.bank_card_number } : {}} />
          <SourcingRepoCard wareInfo={order ? order.warehouse : {}} />
          <SourcingRemarkCard readOnly={true} remark={ order && order.remark }  />
        </Layout.Section>
      </Layout>



    </Page>
  );
}
export { SourcingDetail }
