/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-02-10 14:35:17
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Page, Pagination, Tabs, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { querySourcingList } from "../../api/requests";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { BadgeAuditStatus } from "../../components/StatusBadges/BadgeAuditStatus";
import { BadgeDeliveryStatus } from "../../components/StatusBadges/BadgeDeliveryStatus";
import { BadgePaymentStatus } from "../../components/StatusBadges/BadgePaymentStatus";
import { AUDIT_AUDITING, AUDIT_FAILURE, AUDIT_PASS, AUDIT_REVOKED, AUDIT_UNAUDITED, PAYMENT_STATUS_FAILURE, PO_STATUS } from "../../utils/StaticData";
import { SourcingListFilter } from "./piece/SourcingListFilter";


function SourcingList(props) {

  const resourceName = {
    singular: '采购单',
    plural: '采购单',
  }

  const navigate = useNavigate();

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);

  const [listLoading, setListLoading] = useState(false);

  const [filter, setFilter] = useState({
    provider_id: "",
    subject_code: "",
    warehouse_code: "",
    po: "",
    good_search: "",
    audit_status: new Set(),
    payment_status: new Set(),
    delivery_status: new Set(),
  });

  const tabs = useMemo(() => {
    return [
      {
        id: PO_STATUS.ALL,
        content: '全部',
        accessibilityLabel: '',
        panelID: 'all-customers-content-1',
      },
      {
        id: PO_STATUS.PENDING,
        content: '已创建',
        panelID: 'accepts-marketing-content-1',
      },
      {
        id: PO_STATUS.FINISH,
        content: '已完结',
        panelID: 'repeat-customers-content-1',
      },
      {
        id: PO_STATUS.CANCEL,
        content: '已取消',
        panelID: 'prospects-content-1',
      },
    ]
  }, []);

  const [queryListStatus, setQueryListStatus] = useState(PO_STATUS.ALL);

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      setSelectedTab(selectedTabIndex);
      setQueryListStatus(tabs[selectedTabIndex].id)
    }, []
  );



  // const [exporting, setExporting] = useState(false);


  const pageStatus = useMemo(() => {
    const status = {
      hasNext: false,
      hasPrevious: false,
    }
    if (pageIndex > 1) {
      status.hasPrevious = true;
    }
    if (Math.ceil(total / pageSize) > pageIndex) {
      status.hasNext = true;
    }
    return status
  }, [pageIndex, total]);



  const [sourcingList, setSourcingList] = useState([]);
  const [sourcingListMap, setSourcingListMap] = useState(new Map());
  

  useEffect(() => {
    const tempMap = new Map();
    sourcingList.map((item) => {
      const { id } = item;
      tempMap.set(id, item);
    })
    setSourcingListMap(tempMap);
  }
    , [sourcingList])




  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(sourcingList);

  // audit enable control
  const auditEnable = useMemo(() => {
    const enableArr = [AUDIT_UNAUDITED, AUDIT_FAILURE, AUDIT_REVOKED];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(sourcingListMap.get(item).audit_status) === -1))
    return index === -1

  }, [selectedResources, sourcingListMap])

  // apply payment control
  const applyPayEnable = useMemo(() => {
    console.log(1);
    if (selectedResources.length > 1) { return false };

    const index = selectedResources.findIndex((item) => (sourcingListMap.get(item).audit_status === AUDIT_PASS && sourcingListMap.get(item).payment_status === PAYMENT_STATUS_FAILURE))
    // const index = selectedResources.findIndex((item)=>() )
    return index === -1
  }, [selectedResources, sourcingListMap])

  // cancel enable control
  const cancelEnable = useMemo(() => {
    const enableArr = [AUDIT_UNAUDITED, AUDIT_FAILURE, AUDIT_REVOKED];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(sourcingListMap.get(item).audit_status) === -1))
    return index === -1

  }, [selectedResources, sourcingListMap])

  // delete enable control
  const deleteEnable = useMemo(() => {
    const enableArr = [AUDIT_UNAUDITED];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(sourcingListMap.get(item).audit_status) === -1))
    return index === -1

  }, [selectedResources, sourcingListMap])

  // export enable control
  const exportEnable = useMemo(() => {
    const enableArr = [AUDIT_AUDITING, AUDIT_PASS];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(sourcingListMap.get(item).audit_status) === -1))

    return index === -1

  }, [selectedResources, sourcingListMap])


  const promotedBulkActions = useMemo(() => {
    return [
      {
        content: '提交审批',
        onAction: () => console.log('Todo: implement bulk edit'),
        disabled: !auditEnable,
      },
      {
        content: '申请付款',
        onAction: () => console.log(navigate("payRequest")),
        disabled: !applyPayEnable,

      },
      {
        content: "取消采购单",
        onAction: () => console.log('Todo: implement bulk remove tags'),
        disabled: !cancelEnable,

      },
      {
        content: "导出采购单",
        onAction: () => console.log('Todo: implement bulk delete'),
        disabled: !exportEnable,

      },
      {
        content: "删除采购单",
        onAction: () => console.log('Todo: implement bulk delete'),
        disabled: !deleteEnable,

      },
    ];
  }, [applyPayEnable, auditEnable, cancelEnable, deleteEnable, exportEnable])

  const goodsItemNode = useCallback((item, idx) => {
    if (!item) return null;
    const { sku, purchase_num, goods } = item;
    const { image_url = "", en_name = "" } = goods || {}
    return (
      <div className="product-container" key={idx} style={{ maxWidth: "400px", display: "flex", alignItems: "flex-start" }}>

        <Thumbnail
          source={image_url || ""}
          alt={en_name}
          size="small"
        />
        <div style={{ flex: 1, marginLeft: "1em" }}>
          <Button plain>{sku}</Button>
          <p>{purchase_num}</p>
        </div>
      </div>
    )
  }, [])

  const rowMarkup = useMemo(() => sourcingList.map(
    ({ id, po_no, subject_title, provider_name, warehouse_name, audit_status, payment_status, delivery_status, item }, index) => {

      const prodNod = item.map((goodsItem, idx) => (goodsItemNode(goodsItem, idx)))
      const poBase64 = window.btoa( encodeURIComponent( po_no ));
      console.log(poBase64);
      return (<IndexTable.Row
        id={id}
        key={index}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Button
            plain
            monochrome
            url={`detail/${poBase64}`}
          >
            <TextStyle variation="strong">{po_no}</TextStyle>
          </Button>
        </IndexTable.Cell>
        <IndexTable.Cell>{subject_title}</IndexTable.Cell>
        <IndexTable.Cell>{provider_name}</IndexTable.Cell>
        <IndexTable.Cell>{warehouse_name}</IndexTable.Cell>
        <IndexTable.Cell>
          {<BadgeAuditStatus status={audit_status} />}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {<BadgePaymentStatus status={payment_status} />}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {<BadgeDeliveryStatus status={delivery_status} />}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <ProductInfoPopover popoverNode={item.length > 0 ? prodNod : null} tableCellText={`${item.length}商品`} />
        </IndexTable.Cell>
      </IndexTable.Row>)
    }
  )
    , [goodsItemNode, selectedResources, sourcingList]);


  const exportHandler = useCallback(
    () => {
      console.log("export");
    },
    [],
  );



  useEffect(() => {
    setListLoading(true);
    const {
      provider_id = "",
      subject_code = "",
      warehouse_code = "",
      po = "",
      good_search = "",
      audit_status = new Set(),
      payment_status = new Set(),
      delivery_status = new Set(),
    } = filter;
    querySourcingList(
      {
      // provider_id,
      // subject_code,
      // warehouse_code,
      // po,
      // good_search,
      // audit: [...audit_status],
      // payment_status: [...payment_status],
      // delivery_status: [...delivery_status],
      // po_status: queryListStatus,
    }
    )
    .then(res=>{
      const { data: {data, meta} } =res;
      setSourcingList(data);
    })
    .finally(()=>{
      setListLoading(false)
    })
  }, [filter, queryListStatus])


  return (
    <Page
      title="采购单列表"
      fullWidth
      primaryAction={{ content: '新建采购单', onAction: () => { navigate("add") } }}
      secondaryActions={[
        { content: '导出', onAction: () => { exportHandler() } },
      ]}

    >
      <Card>
        <Tabs
          tabs={tabs} selected={selectedTab} onSelect={handleTabChange}
        >
          <div style={{ padding: '16px', display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <SourcingListFilter filter={ filter } onChange={ (filter)=>{setFilter(filter)} } />
            </div>

          </div>
          <IndexTable
            loading={ listLoading }
            resourceName={resourceName}
            itemCount={sourcingList.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            promotedBulkActions={promotedBulkActions}
            headings={[
              { title: "采购单号" },
              { title: "采购方" },
              { title: "供应商" },
              { title: '收获仓库' },
              { title: '审批状态' },
              { title: '付款状态' },
              { title: '发货状态' },
              { title: '商品' },
            ]}
          >
            {rowMarkup}
          </IndexTable>

          {/* <div>
              <BadgeAuditStatus status="audit_unaudited" />
              <BadgeAuditStatus status="audit_auditing" />
              <BadgeAuditStatus status="audit_pass" />
              <BadgeAuditStatus status="audit_failure" />
              <BadgeAuditStatus status="audit_revoked" />
            </div>
            <div>
              <BadgePaymentStatus status="payment_pending" />
              <BadgePaymentStatus status="payment_applying" />
              <BadgePaymentStatus status="payment_pass" />
              <BadgePaymentStatus status="payment_paid" />
              <BadgePaymentStatus status="payment_failure" />
            </div>
            <div>
              <BadgeDeliveryStatus status="delivery_pending" />
              <BadgeDeliveryStatus status="delivery_transport" />
              <BadgeDeliveryStatus status="delivery_partial_transport" />
              <BadgeDeliveryStatus status="delivery_already_transport" />
              <BadgeDeliveryStatus status="delivery_partial_finish" />
              <BadgeDeliveryStatus status="delivery_finish" />
            </div> */}
          <div className="f-list-footer">
            <Pagination
              // label="This is Results"
              hasPrevious={pageStatus.hasPrevious}
              onPrevious={() => {
                setPageIndex(pageIndex - 1)
              }}
              hasNext={pageStatus.hasNext}
              onNext={() => {
                setPageIndex(pageIndex + 1)
              }}
            />
          </div>

        </Tabs>
      </Card>

    </Page>
  );
}
export { SourcingList }