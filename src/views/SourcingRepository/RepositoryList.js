/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-03-17 11:46:29
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Link, Page, Pagination, Tabs, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmInbound, getRepoTableList } from "../../api/requests";
import { BadgeInboundStatus } from "../../components/StatusBadges/BadgeInboundStatus";
import { LoadingContext } from "../../context/LoadingContext";
import { ModalContext } from "../../context/ModalContext";
import { ToastContext } from "../../context/ToastContext";
import { INBOUND_STATUS_ALL, INBOUND_STATUS_FINISH, INBOUND_STATUS_PENDING, INBOUND_STATUS_PORTION } from "../../utils/StaticData";
import { InRepositoryManualModal } from "./piece/InRepositoryManualModal";
import { RepositoryListFilter } from "./piece/RepositoryListFilter";
import moment from "moment"
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { BACKEND_GOODS_DETAIL } from "../../api/apiUrl";


function RepositoryList(props) {

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
    created_date,
    common_search = "",
    client_account_code = "",
    warehouse_area = "",
    dateOn = false,
    status,
    per_page,
    page = 1,
  } = queryParamObj || {};

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);
  const [listLoading, setListLoading] = useState(false);

  const [filter, setFilter] = useState({
    provider_id,
    warehouse_code,
    
    created_date:
      created_date && created_date ?
        { start: new Date(created_date.start), end: new Date(created_date.end) } :
        { start: new Date(), end: new Date() },
    common_search,
    client_account_code,
    warehouse_area,
    dateOn,
  });

  const [pageIndex, setPageIndex] = useState(page);
  const pageSize = 20;
  const [total, setTotal] = useState(0);

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

  const [tableListMap, setTableListMap] = useState(new Map());

  const tableList = useMemo(() => {
    const arr = [];
    tableListMap.forEach((item, key) => {
      arr.push(item);
    })
    return arr;
  }, [tableListMap]);

  const resourceName = {
    singular: '入库单',
    plural: '入库单',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(tableList);
  const clearSelectedResources = useCallback(() => {
    selectedResources.map((selectedItem) => {
      handleSelectionChange("single", false, selectedItem)
    })
  },
    [handleSelectionChange, selectedResources])
  const goodsItemNode = useCallback((item, idx) => {
    if (!item) return null;
    const { sku, plan_qty, goods } = item;
    const { image_url = "", en_name = "", id } = goods || {}
    return (
      <div className="product-container" key={idx} style={{ maxWidth: "400px", display: "flex", alignItems: "flex-start" }}>

        <Thumbnail
          source={image_url || ""}
          alt={en_name}
          size="small"
        />
        <div style={{ flex: 1, marginLeft: "1em" }}>
          <Link
            onClick={
              (e) => {
                e.stopPropagation();
                window.open(`${BACKEND_GOODS_DETAIL}/${id}`);
              }
            }

          >{sku}</Link>
          <p>{plan_qty}</p>
        </div>
      </div>
    )
  }, [])

  const rowMarkup = tableList.map(
    ({ id, inbound_no, plan_total_qty, actual_total_qty, client_account_code, item, provider_name, warehouse_area, warehouse_name, status }, index) => {

      const prodNod = item.map((goodsItem, idx) => (goodsItemNode(goodsItem, idx)))
      return (
        <IndexTable.Row
          id={id}
          key={inbound_no}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <Button
              plain
              monochrome
              url={`detail/${inbound_no}`}
            >
              <TextStyle variation="strong">{inbound_no}</TextStyle>
            </Button>
          </IndexTable.Cell>
          <IndexTable.Cell>{client_account_code}</IndexTable.Cell>
          <IndexTable.Cell>{provider_name}</IndexTable.Cell>
          <IndexTable.Cell>{warehouse_name}</IndexTable.Cell>
          <IndexTable.Cell>{warehouse_area}</IndexTable.Cell>
          <IndexTable.Cell>
            <BadgeInboundStatus status={status} />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <ProductInfoPopover
              popoverNode={item.length > 0 ? prodNod : null}
            >
              {`${item.length} 商品`}
            </ProductInfoPopover>
          </IndexTable.Cell>
          <IndexTable.Cell>{plan_total_qty}</IndexTable.Cell>
          <IndexTable.Cell>{actual_total_qty}</IndexTable.Cell>
        </IndexTable.Row>
      )
    }
    , []);

  const tabs = useMemo(() => ([
    {
      id: INBOUND_STATUS_ALL,
      content: '全部',
      accessibilityLabel: '',
      panelID: 'all-content-1',
    },
    {
      id: INBOUND_STATUS_PENDING,
      content: '待入库',
      panelID: 'pending-content-1',
    },
    {
      id: INBOUND_STATUS_PORTION,
      content: '部分入库',
      panelID: 'partial-content-1',
    },
    {
      id: INBOUND_STATUS_FINISH,
      content: '已入库',
      panelID: 'finished-content-1',
    },
  ]),
    []);

  const [queryListStatus, setQueryListStatus] = useState(status || INBOUND_STATUS_ALL);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      setSelectedTab(selectedTabIndex);
      setQueryListStatus(tabs[selectedTabIndex].id)
    }
    , [tabs]
  );

  useEffect(() => {
    if (status) {
      const index = tabs.findIndex(item => (item.id === status))
      handleTabChange(index);
    }
  }
    , [])

  const [refresh, setRefresh] = useState(0);

  const mainTableList = useCallback(() => {
    // if(listLoading)return;
    setListLoading(true)
    const { dateOn, created_date: { start, end } } = filter;
    const data = {
      ...filter,
      created_date: dateOn ? [
        moment(start).format("YYYY-MM-DD"),
        moment(end).format("YYYY-MM-DD")
      ] : [],
      status: queryListStatus,
      per_page: pageSize,
      page: pageIndex,
    }
    setSearchParams({
      querys: btoa(encodeURIComponent(JSON.stringify(
        { ...data, created_date: dateOn ? { start: start.getTime(), end: end.getTime() } : "" }
      )))
    });
    clearSelectedResources();
    getRepoTableList(data)
      .then(res => {
        const { data: { list, meta: { pagination: { total = 0 } } } } = res;
        const _map = new Map();
        list.map((item) => {
          _map.set(item.id, item);
        })
        setTableListMap(_map);
        setTotal( total )
      })
      .finally(() => {
        setListLoading(false)
      })
  }, [clearSelectedResources, filter, listLoading, pageIndex, queryListStatus, setSearchParams]);

  useEffect(()=>{
    if( pageIndex === 1 ){
      setRefresh( refresh + 1 )
    }else{
      setPageIndex(1);
    }
  }
  ,[filter, queryListStatus])

  useEffect(()=>{
    mainTableList()
  }
  ,[pageIndex, refresh])

  const [modalSkuList, setModalSkuList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // repo action enable control
  const repoEnabled = useMemo(() => {
    if (selectedResources.length !== 1) { return false };
    const enableArr = [INBOUND_STATUS_PENDING, INBOUND_STATUS_PORTION];
    const index = selectedResources.findIndex((item) => (enableArr.indexOf(tableListMap.get(item).status) === -1))
    return index === -1

  }, [selectedResources, tableListMap])


  const promotedBulkActions = useMemo(() => {
    return (
      [
        {
          content: '手动确定入库',
          onAction: () => {
            const inboundItem = tableList.find(item => item.id === selectedResources[0])
            if (inboundItem) {
              setModalSkuList(inboundItem.item);
            }
            setModalOpen(true);
          },
          disabled: !repoEnabled,
        },

      ]
    )
  }, [selectedResources, tableList])

  const commitModal = useCallback(
    () => {
      const { inbound_no } = tableList.find(item => item.id === selectedResources[0])
      const inbound_item = modalSkuList.map(({ po_item_id, inbound_qty, actual_qty }) => ({ po_item_id, inbound_qty: inbound_qty ? parseInt(inbound_qty) : actual_qty }))
console.log(modalSkuList);
      let invalid = false;
      inbound_item.forEach((item)=>{
        if( !item.inbound_qty ){ invalid = true }
      })

      if( invalid ){
        toastContext.toast({
          active: true,
          message: "入库数量应为大于 0 的整数",
          duration: "1000"
        })
        return;
      }

      const data = {
        inbound_no,
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
          setRefresh(refresh + 1);
        })
        .finally(() => {
          loadingContext.loading(false);

        })
    },
    [tableList, modalSkuList, selectedResources, refresh],
  );

  return (
    <Page
      title="入库单列表"
      fullWidth
    >
      <Card>
        <Tabs
          tabs={tabs} selected={selectedTab} onSelect={handleTabChange}
        >
        </Tabs>
        <div style={{ padding: '16px', display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <RepositoryListFilter
              filter={filter}
              onChange={(filter) => { setFilter(filter) }}
            />
          </div>

        </div>
        <IndexTable
          loading={listLoading}
          resourceName={resourceName}
          itemCount={tableList.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          promotedBulkActions={promotedBulkActions}
          headings={[
            { title: "入库单号" },
            { title: "货主" },
            { title: "供应商" },
            { title: '收货仓库' },
            { title: '货区' },
            { title: '状态' },
            { title: '商品' },
            { title: '预入库总数' },
            { title: '已入库总数' },
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


      <InRepositoryManualModal
        modalOpen={modalOpen}
        modalOpenChange={(openStatus) => { setModalOpen(openStatus) }}
        tableList={modalSkuList}
        tableListChange={(list) => { setModalSkuList(list) }}
        onCommit={(list) => { commitModal() }}
      />

    </Page>
  );
}
export { RepositoryList }