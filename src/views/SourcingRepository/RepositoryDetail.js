/*
 * @Author: lijunwei
 * @Date: 2022-01-24 15:50:14
 * @LastEditTime: 2022-03-21 17:48:16
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Layout, Page, Thumbnail } from "@shopify/polaris";
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
import { CURRENCY_TYPE, INBOUND_STATUS_FINISH } from "../../utils/StaticData";
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
    const warehouseSkuKeys = Object.keys(detail.item);
    return warehouseSkuKeys.map(
      (wSku, index) => {
        const { id,
          plan_qty,
          po_item_id,
          po_no,
          shipping_no,
          warehouse_goods: goods,
          actual_qty = "",
          inbound_qty,
          warehouse_sku: sku 
        } = detail.item[wSku][0];
        return (<IndexTable.Row
          id={id}
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
              <div>{goods && goods.cn_name}</div>
              <div>{goods && goods.en_name}</div>
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
      })
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


  const [modalSkuListObject, setModalSkuListObject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const commitModal = useCallback(
    () => {
      const inbound_item = [];
      for (const k in modalSkuListObject) {
        if (Object.hasOwnProperty.call(modalSkuListObject, k)) {
          const goods = modalSkuListObject[k];

          for (let i = 0; i < goods.length; i++) {
            const {
              po_item_id,
            } = goods[i];
            const firstInboundQty = goods[0].inbound_qty;
            const firstActulBackup = goods[0].actual_qty_backup;
            inbound_item.push({
              po_item_id,
              inbound_qty: firstInboundQty ? parseInt(firstInboundQty) - firstActulBackup : 0,
              warehouse_sku: k,
            })
          }

        }
      }

      let invalid = true;
      const obj = {};
      inbound_item.forEach((item) => {
        const {
          po_item_id,
          inbound_qty,
          warehouse_sku,
        } = item;
        if (item.inbound_qty > 0) {
          invalid = false;
          // obj[ warehouse_sku ] = { po_item_id, inbound_qty }
          obj[ warehouse_sku ] = inbound_qty;
        }
      })

      if (invalid) {
        toastContext.toast({
          active: true,
          message: "?????????????????????",
          duration: "1000"
        })
        return;
      }

      const data = {
        inbound_no: detail.inbound_no,
        inbound_item: obj,
      }
      loadingContext.loading(true);
      confirmInbound(data)
        .then(res => {
          setModalOpen(false);
          toastContext.toast({
            active: true,
            message: "??????????????????",
            duration: 1000,
          })
          setRefresh(refresh + 1);
        })
        .finally(() => {
          loadingContext.loading(false);

        })
    },
    [detail, modalSkuListObject, refresh],
  );

  const resourceName = {
    singular: '??????',
    plural: '??????',
  };

  return (
    <Page
      breadcrumbs={[{
        content: '???????????????',
        onAction: () => {
          navigate(-1)
        }
      }]}
      title={`???????????????-${id}`}
      titleMetadata={<BadgeInboundStatus status={detail && detail.status} />}
      subtitle={detail && detail.create_message || ""}
      secondaryActions={
        !(detail && detail.status === INBOUND_STATUS_FINISH)
          ?
          [{
            content: '??????????????????',
            onAction: () => {
              const inboundItem = detail;
              if (inboundItem) {
                // console.log(inboundItem);
                Object.keys(inboundItem.item).forEach((k) => {
                  const it = inboundItem.item[k];
                  it[0]["actual_qty_backup"] = it[0].actual_qty;
                  it[0]["wSku"] = k;
                })

                setModalSkuListObject(inboundItem.item);
              }
              setModalOpen(true);
            },
          }]
          : []
      }
    >
      <Layout>
        <Layout.Section>

          <Card
            title="????????????"
          >
            <div>
              <IndexTable
                itemCount={ detail ? Object.keys(detail.item).length : 0}
                headings={[
                  { title: '??????SKU' },
                  { title: '????????????' },
                  { title: '???????????????' },
                  { title: '???????????????' },
                  { title: '???????????????' },
                  { title: '???????????????' },

                ]}
                selectable={false}
                resourceName={ resourceName }

              >
                {rowMarkup}
              </IndexTable>
            </div>


            <br />
          </Card>

          <Card
            title="????????????"
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
          <Card title="????????????">
            <SourcingCardSection title="????????????" text={detail && detail.inbound_no} />
            <SourcingCardSection title="????????????" text={detail && detail.type} />
            <SourcingCardSection title="??????" text={detail && detail.client_account && detail.client_account.name} />
            <SourcingCardSection title="??????" text={detail && detail.warehouse_area} />
            <SourcingCardSection title="?????????" text={detail && detail.provider_name} />
            <SourcingCardSection title="????????????" text={detail && detail.warehouse_name} />
            <SourcingCardSection title="???????????????" text={detail && detail.third_warehouse || ""} />
          </Card>
          <Card title="????????????">
            <SourcingCardSection title="??????" text={detail && `${detail.shipping_currency && CURRENCY_TYPE[detail.shipping_currency] || ""}${detail.shipping_price}`} />
          </Card>
        </Layout.Section>
      </Layout>


      <InRepositoryManualModal
        modalOpen={modalOpen}
        modalOpenChange={(openStatus) => { setModalOpen(openStatus) }}
        tableListObject={modalSkuListObject}
        tableListObjectChange={(list) => { setModalSkuListObject(list) }}
        onCommit={(list) => { commitModal() }}
      />
    </Page>
  );
}
export { RepositoryDetail }