/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-02-16 19:32:26
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Page, Pagination, Tabs, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeliveryListFilter } from "./piece/DeliveryListFilter";
import { AUDIT_AUDITING, AUDIT_FAILURE, AUDIT_PASS, AUDIT_REVOKED, AUDIT_UNAUDITED, PAYMENT_STATUS_FAILURE, REPO_STATUS_ALL, REPO_STATUS_PENDING, REPO_STATUS_PORTION, REPO_STATUS_SUCCESS } from "../../utils/StaticData";
import { BadgeAuditStatus } from "../../components/StatusBadges/BadgeAuditStatus";
import { BadgePaymentStatus } from "../../components/StatusBadges/BadgePaymentStatus";
import { BadgeDeliveryStatus } from "../../components/StatusBadges/BadgeDeliveryStatus";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { deleteShippingOrder, getShipingList } from "../../api/requests";
import { BadgeRepoStatus } from "../../components/StatusBadges/BadgeRepoStatus";
import { LoadingContext } from "../../context/LoadingContext";
import { ToastContext } from "../../context/ToastContext";
import { useContext } from "react";



function DeliveryList(props) {


  const navigate = useNavigate();

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);


  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);

  const [listLoading, setListLoading] = useState(false);

  const [filter, setFilter] = useState({
    provider_id: "",
    warehouse_code: "",
    shipping_date: null,
    common_search: "",
    repo_status: new Set(),
  });

  const resourceName = {
    singular: '发货单',
    plural: '发货单',
  }

  const tabs = useMemo(() => {
    return [
      {
        id: REPO_STATUS_ALL,
        content: '全部',
        accessibilityLabel: '',
        panelID: 'all-delivery-list',
      },
      {
        id: REPO_STATUS_PENDING,
        content: '未预报',
        panelID: 'wait-delivery-list',
      },
      {
        id: REPO_STATUS_PORTION,
        content: '部分预报',
        panelID: 'partial-delivery-list',
      },
      {
        id: REPO_STATUS_SUCCESS,
        content: '已预报',
        panelID: 'delivery-done-list',
      },
    ]
  }, []);

  const [queryListStatus, setQueryListStatus] = useState(REPO_STATUS_ALL);

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



  const [deliveryList, setDeliveryList] = useState([]);
  const [deliveryListMap, setDeliveryListMap] = useState(new Map());


  useEffect(() => {
    const tempMap = new Map();
    deliveryList.map((item) => {
      const { id } = item;
      tempMap.set(id, item);
    })
    setDeliveryListMap(tempMap);
  }
    , [deliveryList])




  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(deliveryList);

  // audit enable control
  const auditEnable = useMemo(() => {
    const enableArr = [AUDIT_UNAUDITED, AUDIT_FAILURE, AUDIT_REVOKED];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(deliveryListMap.get(item).audit_status) === -1))
    return index === -1

  }, [selectedResources, deliveryListMap])

  // apply payment control
  const applyPayEnable = useMemo(() => {
    // console.log(1);
    if (selectedResources.length > 1) { return false };

    const index = selectedResources.findIndex((item) => (deliveryListMap.get(item).audit_status === AUDIT_PASS && deliveryListMap.get(item).payment_status === PAYMENT_STATUS_FAILURE))
    // const index = selectedResources.findIndex((item)=>() )
    return index === -1
  }, [selectedResources, deliveryListMap])

  // cancel enable control
  const cancelEnable = useMemo(() => {
    const enableArr = [AUDIT_UNAUDITED, AUDIT_FAILURE, AUDIT_REVOKED];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(deliveryListMap.get(item).audit_status) === -1))
    return index === -1

  }, [selectedResources, deliveryListMap])

  // delete enable control
  const deleteEnable = useMemo(() => {
    const enableArr = [AUDIT_UNAUDITED];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(deliveryListMap.get(item).audit_status) === -1))
    return index === -1

  }, [selectedResources, deliveryListMap])

  // export enable control
  const exportEnable = useMemo(() => {
    const enableArr = [AUDIT_AUDITING, AUDIT_PASS];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(deliveryListMap.get(item).audit_status) === -1))

    return index === -1

  }, [selectedResources, deliveryListMap])

  const deleteOrder = useCallback((id)=>{
    loadingContext.loading(true);
    deleteShippingOrder( id )
    .then(res=>{
      toastContext.toast({
        active: true,
        message: "删除成功",
        duriation: 1000,
      })
    })
    .finally(()=>{
      loadingContext.loading(false);
    })
  },[])


  const promotedBulkActions = useMemo(() => {
    return [
      {
        content: '按pcs入库',
        onAction: () => { navigate("inbound/pcs") }
        // disabled: !auditEnable,
      },
      {
        content: '按箱入库',
        onAction: () => console.log(navigate("payRequest")),
        // disabled: !applyPayEnable,

      },
      {
        content: "按卡板入库",
        onAction: () => console.log('Todo: implement bulk remove tags'),
        // disabled: !cancelEnable,

      },
      {
        content: "删除发货单",
        onAction: () => {
          deleteOrder(selectedResources[0])
        },
        // disabled: !deleteEnable,

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

  const rowMarkup = useMemo(() => deliveryList.map(
    ({ id, shipping_no, provider: { business_name }, warehouse: { name }, status, item, shipping_date, expected_date }, index) => {

      const prodNod = item.map((goodsItem, idx) => (goodsItemNode(goodsItem, idx)))

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
            url={`detail/${id}`}
          >
            <TextStyle variation="strong">{shipping_no}</TextStyle>
          </Button>
        </IndexTable.Cell>
        <IndexTable.Cell>{business_name}</IndexTable.Cell>
        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>
          {<BadgeRepoStatus status={status} />}
        </IndexTable.Cell>
        <IndexTable.Cell>{shipping_date}</IndexTable.Cell>
        <IndexTable.Cell>{expected_date}</IndexTable.Cell>

      </IndexTable.Row>)
    }
  )
    , [goodsItemNode, selectedResources, deliveryList]);


  useEffect(() => {
    setListLoading(true);
    const {
      provider_id = "",
      warehouse_code = "",
      shipping_date = null,
      common_search = "",
      repo_status = new Set(),
    } = filter;
    getShipingList(
      {
        ...filter,
        per_page: pageSize,
        page: pageIndex,
        status: queryListStatus,
      }
    )
      .then(res => {
        const { data: { list, meta: { pagination: { total = 0 } } } } = res;
        setTotal(total)
        setDeliveryList(list);
      })
      .finally(() => {
        setListLoading(false)
      })
  }, [filter, queryListStatus])


  return (
    <Page
      title="发货单列表"
      fullWidth
      primaryAction={{ content: '新建发货单', onAction: () => { navigate("add") } }}


    >
      <Card>
        <Tabs
          tabs={tabs} selected={selectedTab} onSelect={handleTabChange}
        ></Tabs>
        <div style={{ padding: '16px', display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <DeliveryListFilter filter={filter} onChange={(filter) => { setFilter(filter) }} />
          </div>
        </div>
        <IndexTable
          loading={listLoading}
          resourceName={resourceName}
          itemCount={deliveryList.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          promotedBulkActions={promotedBulkActions}
          headings={[
            { title: "发货单号" },
            { title: "供应商" },
            { title: '收获仓库' },
            { title: '预报状态' },
            { title: '发货日期' },
            { title: '预计入库日期' },
          ]}
        >
          {rowMarkup}
        </IndexTable>

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
      </Card>

    </Page>
  );

}
export { DeliveryList }