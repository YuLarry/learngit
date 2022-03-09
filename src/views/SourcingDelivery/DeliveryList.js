/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-03-09 11:43:06
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Page, Pagination, Tabs, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeliveryListFilter } from "./piece/DeliveryListFilter";
import { AUDIT_AUDITING, AUDIT_FAILURE, AUDIT_PASS, AUDIT_REVOKED, AUDIT_UNAUDITED, INBOUND_TYPE, PAYMENT_STATUS_FAILURE, REPO_STATUS_ALL, REPO_STATUS_PENDING, REPO_STATUS_PORTION, REPO_STATUS_SUCCESS } from "../../utils/StaticData";
import { deleteShippingOrder, getShipingList } from "../../api/requests";
import { BadgeRepoStatus } from "../../components/StatusBadges/BadgeRepoStatus";
import { LoadingContext } from "../../context/LoadingContext";
import { ToastContext } from "../../context/ToastContext";
import { useContext } from "react";
import moment from "moment";



function DeliveryList(props) {


  const navigate = useNavigate();

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);


  const [refresh, setRefresh] = useState(0);

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);

  const [listLoading, setListLoading] = useState(false);

  const [filter, setFilter] = useState({
    provider_id: "",
    warehouse_code: "",
    shipping_date: {
      start: new Date(),
      end: new Date(),
    },
    dateOn: false,
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
    }, [tabs]
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


  const clearSelectedResources = useCallback(() => {
    selectedResources.map((selectedItem) => {
      handleSelectionChange("single", false, selectedItem)
    })
  },
    [handleSelectionChange, selectedResources])

  const refreshTrigger = useCallback(() => {
    clearSelectedResources();
    setRefresh(refresh + 1)
  },
    [clearSelectedResources, refresh])

  // audit enable control
  const inboundEnable = useMemo(() => {
    if (selectedResources.length !== 1) { return false };
    const enableArr = [REPO_STATUS_PENDING, REPO_STATUS_PORTION];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(deliveryListMap.get(item).status) === -1))
    return index === -1

  }, [selectedResources, deliveryListMap])


  // delete enable control
  const deleteEnable = useMemo(() => {
    if (selectedResources.length !== 1) { return false };
    const enableArr = [REPO_STATUS_PENDING];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(deliveryListMap.get(item).status) === -1))
    return index === -1

  }, [selectedResources, deliveryListMap])


  const deleteOrder = useCallback((id) => {
    loadingContext.loading(true);
    deleteShippingOrder(id)
      .then(res => {
        toastContext.toast({
          active: true,
          message: "删除成功",
          duration: 1000,
        })
        refreshTrigger()
      })
      .finally(() => {
        loadingContext.loading(false);
      })
  }, [refreshTrigger])




  const promotedBulkActions = useMemo(() => {
    const code = (deliveryListMap && selectedResources.length > 0) ? deliveryListMap.get(selectedResources[0]).shipping_no : "";
    const codeBase64 = btoa(code);

    return [
      {
        content: '按pcs入库',
        onAction: () => { navigate(`inbound?shipping_code=${codeBase64}&type=${INBOUND_TYPE.PCS}`) },
        disabled: !inboundEnable,
      },
      {
        content: '按箱入库',
        onAction: () => { navigate(`inbound?shipping_code=${codeBase64}&type=${INBOUND_TYPE.BOX}`) },
        disabled: !inboundEnable,
      },
      {
        content: "按卡板入库",
        onAction: () => { navigate(`inbound?shipping_code=${codeBase64}&type=${INBOUND_TYPE.PALLET}`) },
        disabled: !inboundEnable,
      },
      {
        content: "删除发货单",
        onAction: () => {
          deleteOrder(selectedResources[0])
        },
        disabled: !deleteEnable,
      },
    ];
  }, [deleteEnable, deleteOrder, deliveryListMap, inboundEnable, navigate, selectedResources])

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
            // removeUnderline
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
    clearSelectedResources();
    const { dateOn, shipping_date: { start, end } } = filter;
    getShipingList(
      {
        ...filter,
        shipping_date: (
          dateOn
            ?
            [
              moment(start).format("YYYY-MM-DD"),
              moment(end).format("YYYY-MM-DD")
            ]
            :
            []
        ),
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
  }, [filter, pageIndex, queryListStatus])


  return (
    <Page
      title="发货单列表"
      fullWidth
      primaryAction={{ content: '新建发货单', onAction: () => { navigate("add") } }}
    >
      <Card>
        <Tabs
          tabs={ tabs} selected={ selectedTab } onSelect={handleTabChange}
        ></Tabs>
        <div style={{ padding: '16px', display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <DeliveryListFilter
              filter={filter}
              onChange={(filter) => {
                setFilter(filter);
              }}

            />
          </div>
        </div>
        <IndexTable
          loading={listLoading}
          resourceName={resourceName}
          itemCount={deliveryList.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          // onSelectionChange={handleSelectionChange}
          onSelectionChange={(a,b,c)=>{ handleSelectionChange( a, b , c ) }}
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