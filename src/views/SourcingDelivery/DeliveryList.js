/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-03-17 14:04:34
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Page, Pagination, Tabs, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DeliveryListFilter } from "./piece/DeliveryListFilter";
import { INBOUND_TYPE, REPO_STATUS_ALL, REPO_STATUS_PENDING, REPO_STATUS_PORTION, REPO_STATUS_SUCCESS } from "../../utils/StaticData";
import { deleteShippingOrder, getShipingList } from "../../api/requests";
import { BadgeRepoStatus } from "../../components/StatusBadges/BadgeRepoStatus";
import { LoadingContext } from "../../context/LoadingContext";
import { ToastContext } from "../../context/ToastContext";
import { useContext } from "react";
import moment from "moment";



function DeliveryList(props) {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParamObj = useMemo(() => {
    return (
      searchParams.get("querys") && JSON.parse(decodeURIComponent(atob(searchParams.get("querys")))) || {}
    )
  }
    , [searchParams])
  let {
    provider_id = "",
    warehouse_code = "",
    shipping_date,
    dateOn = false,
    common_search = "",
    per_page,
    page = 1,
    status = REPO_STATUS_ALL
  } = queryParamObj || {};


  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);

  const [isFirstTime, setisFirstTime] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const pageSize = 20;
  const [pageIndex, setPageIndex] = useState(page || 1);
  const [total_pages, setTotal_pages] = useState(0);

  const [listLoading, setListLoading] = useState(false);

  const [filter, setFilter] = useState({
    provider_id,
    warehouse_code,
    shipping_date:
      shipping_date && shipping_date ?
        { start: new Date(shipping_date.start), end: new Date(shipping_date.end) } :
        { start: new Date(), end: new Date() },
    dateOn,
    common_search,
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

  const [queryListStatus, setQueryListStatus] = useState(status);

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      setSelectedTab(selectedTabIndex);
      setQueryListStatus(tabs[selectedTabIndex].id)
    }, [tabs]
  );

  useEffect(() => {
    if (status) {
      const index = tabs.findIndex(item => (item.id === status))
      handleTabChange(index);
    }
  }
    , [])

  const pageStatus = useMemo(() => {
    const status = {
      hasNext: false,
      hasPrevious: false,
    }
    if (pageIndex > 1) {
      status.hasPrevious = true;
    }
    if ( pageIndex < total_pages ) {
      status.hasNext = true;
    }
    return status
  }, [pageIndex, total_pages]);



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
        content: "删除发货单",
        onAction: () => {
          deleteOrder(selectedResources[0])
        },
        disabled: !deleteEnable,
      },
    ];
  }, [deleteEnable, deleteOrder, deliveryListMap, selectedResources])


  const bulkActions = useMemo(() => {
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

    ];
  }, [deliveryListMap, inboundEnable, navigate, selectedResources])

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
    ({ id, shipping_no, provider: { business_name }, warehouse: { name }, status, item, shipping_date, expected_date, }, index) => {

      const prodNod = item.map((goodsItem, idx) => (goodsItemNode(goodsItem, idx)))
      const soBase64 = window.btoa(encodeURIComponent(shipping_no));
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
            url={`detail/${soBase64}`}
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


  const mainTableList = useCallback(() => {
    if( listLoading ) return;
    setListLoading(true);
    clearSelectedResources();
    const { dateOn, shipping_date: { start, end } } = filter;
    const queryData = {
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
    setSearchParams({
      querys: btoa(encodeURIComponent(JSON.stringify(
        { ...queryData, shipping_date: dateOn ? { start: start.getTime(), end: end.getTime() } : "" }
      )))
    });
    getShipingList(queryData)
      .then(res => {
        const { data: { list, meta: { pagination: { total = 0, total_pages, current_page } } } } = res;
        setisFirstTime( false );
        setTotal_pages( total_pages );
        setDeliveryList(list);
      })
      .finally(() => {
        setListLoading(false)
      })
  }, [clearSelectedResources, filter, listLoading, pageIndex, queryListStatus, setSearchParams])

  useEffect(()=>{
    if( isFirstTime ){
      return;
    }else if( pageIndex === 1 ){
      setRefresh( refresh + 1 )
    }else{
      setPageIndex( 1 );
    }
  }
  ,[filter, queryListStatus])

  useEffect(()=>{
    mainTableList()
  }
  ,[pageIndex, refresh])

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
          onSelectionChange={(a, b, c) => { handleSelectionChange(a, b, c) }}
          promotedBulkActions={promotedBulkActions}
          bulkActions={bulkActions}
          headings={[
            { title: "发货单号" },
            { title: "供应商" },
            { title: '收货仓库' },
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