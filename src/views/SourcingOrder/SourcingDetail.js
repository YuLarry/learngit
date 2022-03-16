/*
 * @Author: lijunwei
 * @Date: 2022-01-20 16:16:03
 * @LastEditTime: 2022-03-16 16:21:02
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Layout, Page, Thumbnail } from "@shopify/polaris";
import { useContext } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBusinessTypeList, getDepartmentList, getPlatformList, getSourcingOrderDetail } from "../../api/requests";
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
import { AUDIT_FAILURE, AUDIT_REVOKED, AUDIT_UNAUDITED, PO_STATUS_FINISH } from "../../utils/StaticData";
import { PopoverNoLink } from "./piece/PopoverNoLink";

function SourcingDetail(props) {
  const navigate = useNavigate();
  const { id } = useParams();

  const idDecode = id && atob(id);
  const idURIDecode = idDecode && decodeURIComponent(idDecode);

  const loadingContext = useContext(LoadingContext);

  const [order, setOrder] = useState(null);


  const productInfo = (goodsItem) => {
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

  const headTitle = useMemo(() => {
    const title1 = [
      { title: '系统SKU' },
      { title: '采购数量' },
      { title: '采购价格' },
    ]
    const title2 = (order && order.po_status === PO_STATUS_FINISH) ? 
    [
      {title: "关联发货单"},
      {title: "关联入库单"},
    ] : [];
    return title1.concat(title2);
  }
  ,[order])

  const rowMarkup = useMemo(() => {
    if (!order) return null;
    return order.item.map(
      ({ sku, purchase_num, goods, purchase_price, inbounds, shippings  }, idx) => (
        <IndexTable.Row
          id={idx}
          key={idx}
          position={idx}
        >
          <IndexTable.Cell>
            <ProductInfoPopover
              popoverNode={productInfo(goods)}
            >
              {sku}
            </ProductInfoPopover>

          </IndexTable.Cell>
          <IndexTable.Cell>
            {purchase_num}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {purchase_price}
          </IndexTable.Cell>
          { order && (order.po_status === PO_STATUS_FINISH) && <IndexTable.Cell>
            <PopoverNoLink linkListOptions={ shippings.map(item=>({content: item, url: `/delivery/detail/${btoa(encodeURIComponent(item))}`})) } />
          </IndexTable.Cell> }
          { order && (order.po_status === PO_STATUS_FINISH) && <IndexTable.Cell>
            <PopoverNoLink linkListOptions={ inbounds.map(item=>({content: item, url: `/repository/detail/${item}`})) } />
          </IndexTable.Cell> }
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

  const [platformList, setPlatformList] = useState({});
  const [departmentList, setDepartmentList] = useState({});
  const [businessTypeList, setBusinessTypeList] = useState({});

  useEffect(() => {
    if (!id) return;
    loadingContext.loading(true);
    Promise.all([
      getPlatformList(),
      getBusinessTypeList(),
      getDepartmentList(),
    ])
      .then(([resPlatform, resBusinessType, resDepartment]) => {
        setPlatformList(resPlatform.data);
        setBusinessTypeList(resBusinessType.data);
        setDepartmentList(resDepartment.data);
      })
    getSourcingOrderDetail(idDecode)
      .then(res => {
        // console.log(res);
        setOrder(res.data)
      })
      .finally(() => {
        loadingContext.loading(false);
      })

  }, []);

  const enableEdit = useMemo(() => {
    const enableArr = [AUDIT_UNAUDITED, AUDIT_FAILURE, AUDIT_REVOKED];
    if (order && enableArr.indexOf(order.audit_status) > -1) {
      return true;
    }
  }
    , [order]);

  return (
    <Page
      breadcrumbs={[
        {
          onAction: () => {
            navigate(-1);
          }
        }
      ]}
      secondaryActions={
        enableEdit
          ?
          [{
            content: "编辑采购单",
            onAction: () => {
              navigate(`/sourcing/edit/${id}`)
            }
          }]
          :
          []
      }
      title={`采购单详情-${idURIDecode}`}
      titleMetadata={badgesMarkup}
      subtitle={order && order.create_message || ""}
    >
      <Layout>
        <Layout.Section>
          <Card
            title="采购明细"
          >
            <div>
              <IndexTable
                itemCount={order && order.item.length || 0}
                headings={headTitle}
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
          <SourcingInfoCard poInfo={order ? {
            ...order,
            division: departmentList[order.division],
            business_type: businessTypeList[order.business_type],
            platform: platformList[order.platform],
          } : {}} />
          <SourcingProviCard provInfo={order ? { ...order.provider, provider_account: order.provider_account } : {}} />
          <SourcingRepoCard wareInfo={order ? order.warehouse : {}} />
          <SourcingRemarkCard readOnly={true} remark={order && order.remark} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
export { SourcingDetail }
