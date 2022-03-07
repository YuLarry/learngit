/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-03-07 15:28:41
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Page, Pagination, Tabs, TextStyle, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmInbound, getRepoTableList } from "../../api/requests";
import { BadgeInboundStatus } from "../../components/StatusBadges/BadgeInboundStatus";
import { LoadingContext } from "../../context/LoadingContext";
import { ModalContext } from "../../context/ModalContext";
import { ToastContext } from "../../context/ToastContext";
import { INBOUND_STATUS_ALL, INBOUND_STATUS_FINISH, INBOUND_STATUS_PENDING, INBOUND_STATUS_PORTION } from "../../utils/StaticData";
import { InRepositoryManualModal } from "./piece/InRepositoryManualModal";
import { RepositoryListFilter } from "./piece/RepositoryListFilter";
import moment from "moment"


function RepositoryList(props) {

  const navigation = useNavigate();

  const loadingContext = useContext(LoadingContext);
  const modalContext = useContext(ModalContext);
  const toastContext = useContext(ToastContext);
  const [listLoading, setListLoading] = useState(false);




  const [filter, setFilter] = useState({
    provider_id: "",
    warehouse_code: "",
    create_date: {
      start: new Date(),
      end: new Date(),
    },
    common_search: "",
    client_account_code: "",
    warehouse_area: "",
    dateOn: false,
  });

  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);

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


  const [tableList, setTableList] = useState([]);
  const resourceName = {
    singular: '入库单',
    plural: '入库单',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(tableList);


  const rowMarkup = tableList.map(
    ({ id, inbound_no, plan_total_qty, actual_total_qty, client_account_code, item, provider_name, warehouse_area, warehouse_name, status }, index) => (
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
        <IndexTable.Cell>商品</IndexTable.Cell>
        <IndexTable.Cell>{plan_total_qty}</IndexTable.Cell>
        <IndexTable.Cell>{actual_total_qty}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );


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

  const [selectedTab, setSelectedTab] = useState(0);
  const status = useMemo(() => (tabs[selectedTab].id), [selectedTab, tabs]);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTab(selectedTabIndex),
    [],
  );

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    // loadingContext.loading(true)
    setListLoading(true)
    const { dateOn, create_date: { start, end } } = filter;
    const data = {
      ...filter,
      create_date: dateOn ? [
        moment(start).format("YYYY-MM-DD"),
        moment(end).format("YYYY-MM-DD")
      ] : [],
      status,
      per_page: pageSize,
      page: pageIndex,
    }
    getRepoTableList(
      data
    )
      .then(res => {
        const { data: { list } } = res;
        setTableList(list);
      })
      .finally(() => {
        // loadingContext.loading(false)
        setListLoading(false)

      })
  }, [filter, pageIndex, selectedTab, status, refresh]);

  const [modalSkuList, setModalSkuList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const promotedBulkActions = useMemo(() => {
    return (
      [
        {
          content: '手动确定入库',
          onAction: () => {
            // setModalSkuList()
            const inboundItem = tableList.find( item => item.id === selectedResources[0])
            // console.log(inboundItem);
            if( inboundItem ){
              setModalSkuList(inboundItem.item);
            }
            setModalOpen(true);
          },
        },

      ]
    )
  }, [selectedResources, tableList])

  const commitModal = useCallback(
    () => {
      const { inbound_no } = tableList.find( item => item.id === selectedResources[0])
      const inbound_item = modalSkuList.map(({po_item_id, inbound_qty})=>({po_item_id, inbound_qty: parseInt(inbound_qty)}))
      const data = {
        inbound_no,
        inbound_item,
      }
      loadingContext.loading(true);
      confirmInbound( data )
      .then(res=>{
        setModalOpen(false);
        toastContext.toast({
          active: true,
          message: "手动入库成功",
          duration: 1000,
        })

        setRefresh(refresh + 1);
      })
      .finally(()=>{
      loadingContext.loading(false);
        
      })
    },
    [tableList, modalSkuList, selectedResources],
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
            { title: '收获仓库' },
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
        onCommit={ ( list )=>{ console.log(list);commitModal() } }
      />

    </Page>
  );
}
export { RepositoryList }