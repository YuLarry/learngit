/*
 * @Author: lijunwei
 * @Date: 2022-01-24 15:50:14
 * @LastEditTime: 2022-03-15 10:36:56
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Button, Card, IndexTable, Layout, Page, Thumbnail } from "@shopify/polaris";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { confirmInbound, getInboundDetail } from "../../api/requests";
import { FstlnTimeline } from "../../components/FstlnTimeline/FstlnTimeline";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingCardSection } from "../../components/SecondaryCard/SourcingCardSection";
import { BadgeInboundStatus } from "../../components/StatusBadges/BadgeInboundStatus";
import { LoadingContext } from "../../context/LoadingContext";
import { ModalContext } from "../../context/ModalContext";
import { ToastContext } from "../../context/ToastContext";
import { InRepositoryManualModal } from "./piece/InRepositoryManualModal";

function RepositoryDetail(props) {
  const navigate = useNavigate();
  const loadingContext = useContext(LoadingContext);
  const modalContext = useContext(ModalContext);
  const toastContext = useContext(ToastContext);

  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const productInfo = (product) => {
    if (!product) return null;
    const { cn_name, en_name, image_url, id, price, sku } = product;
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
    if (!detail) return;
    return detail.item.map(
      ({ sku, po_no, goods, plan_qty, actual_qty, shipping_no }, index) => {
        const { cn_name, en_name } = goods || {};
        return (
          <IndexTable.Row
            id={index}
            key={index}
            position={index}
          >
            <IndexTable.Cell>
              {sku}
            </IndexTable.Cell>
            <IndexTable.Cell>
              <ProductInfoPopover
                popoverNode={productInfo(goods)}
              >
                <div>{cn_name}</div>
              </ProductInfoPopover>
            </IndexTable.Cell>
            <IndexTable.Cell>
              {plan_qty}
            </IndexTable.Cell>
            <IndexTable.Cell>
              {actual_qty}
            </IndexTable.Cell>
            <IndexTable.Cell>
            <Button
              plain
              url={`/sourcing/detail/${btoa(encodeURIComponent(po_no))}`}
            >
              {po_no}
            </Button>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Button
              plain
              url={`/delivery/detail/${btoa(encodeURIComponent(shipping_no))}`}
            >
              {shipping_no}
            </Button>

          </IndexTable.Cell>
          </IndexTable.Row>
        )
      }
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
  }, [id, refresh]);


  const [modalSkuList, setModalSkuList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const commitModal = useCallback(
    () => {
      const inbound_item = modalSkuList.map(({ po_item_id, inbound_qty }) => ({ po_item_id, inbound_qty: parseInt(inbound_qty) }))
      const data = {
        inbound_no: detail.inbound_no,
        inbound_item,
      }
      loadingContext.loading(true);
      confirmInbound(data)
        .then(res => {
          setModalOpen(false);
          toastContext.toast({
            active: true,
            message: "手动入库成功",
            duration: 1000,
          })
          setRefresh(refresh + 1)
        })
        .finally(() => {
          loadingContext.loading(false);

        })
    },
    [detail, modalSkuList],
  );

  return (
    <Page
      breadcrumbs={[{ 
        content: '入库单列表',
        onAction: ()=>{
          navigate( -1 )
        }
      }]}
      title={id}
      titleMetadata={<BadgeInboundStatus status={detail && detail.status} />}
      subtitle={detail && detail.create_message || ""}
      secondaryActions={[
        {
          content: '手动确定入库',
          onAction: () => {
            setModalSkuList(detail.item)
            setModalOpen(true)
          },
        },
      ]}
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
                timeline={detail && detail.operation_record.reverse() || []}
                dateKey="created_at"

              />
            </Card.Section>

          </Card>

        </Layout.Section>
        <Layout.Section secondary>
          <Card title="基本信息">
            <SourcingCardSection title="入库单号" text={detail && detail.inbound_no} />
            <SourcingCardSection title="单据类型" text={detail && detail.type} />
            <SourcingCardSection title="货主" text={detail && detail.provider_name} />
            <SourcingCardSection title="货区" text={detail && detail.warehouse_area} />
            <SourcingCardSection title="供应商" text={detail && detail.provider_name} />
            <SourcingCardSection title="收货仓库" text={detail && detail.warehouse_name} />
            <SourcingCardSection title="第三方仓库" text={detail && detail.third_warehouse || ""} />
          </Card>
          <Card title="费用信息">
            <SourcingCardSection title="运费" text={detail && detail.shipping_price} />
          </Card>
        </Layout.Section>
      </Layout>


      <InRepositoryManualModal
        modalOpen={modalOpen}
        modalOpenChange={(openStatus) => { setModalOpen(openStatus) }}
        tableList={modalSkuList}
        tableListChange={(list) => { setModalSkuList(list) }}
        onCommit={(list) => { console.log(list); commitModal() }}
      />
    </Page>
  );
}
export { RepositoryDetail }