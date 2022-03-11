/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-03-11 12:02:13
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, DatePicker, IndexTable, Link, Modal, Page, Pagination, RadioButton, Select, Stack, Tabs, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cancelSourcingOrder, commitApproval, deleteSourcingOrder, exportOrderExcel, exportOrderPdf, getBrandList, querySourcingList } from "../../api/requests";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { BadgeAuditStatus } from "../../components/StatusBadges/BadgeAuditStatus";
import { BadgeDeliveryStatus } from "../../components/StatusBadges/BadgeDeliveryStatus";
import { BadgePaymentStatus } from "../../components/StatusBadges/BadgePaymentStatus";
import { LoadingContext } from "../../context/LoadingContext";
import { ToastContext } from "../../context/ToastContext";
import { AUDIT_AUDITING, AUDIT_FAILURE, AUDIT_PASS, AUDIT_REVOKED, AUDIT_UNAUDITED, PAYMENT_STATUS_FAILURE, PAYMENT_STATUS_PENDING, PO_STATUS_ALL, PO_STATUS_CANCEL, PO_STATUS_FINISH, PO_STATUS_PENDING } from "../../utils/StaticData";
import { SourcingListFilter } from "./piece/SourcingListFilter";
import moment from "moment";
import { fstlnTool } from "../../utils/Tools";
import { BACKEND_GOODS_DETAIL } from "../../api/apiUrl";


function SourcingList(props) {

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParamObj = useMemo(() => {
    return (
      searchParams.get("querys") && JSON.parse(atob(searchParams.get("querys"))) || {}
    )
  }
    , [searchParams])
  let {
    provider_id,
    subject_code,
    warehouse_code,
    po,
    common_search,
    audit_status = new Set(),
    payment_status = new Set(),
    delivery_status = new Set(),

    po_status,
    per_page,
    page,
  } = queryParamObj;

  const navigate = useNavigate();
  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);

  const [pageIndex, setPageIndex] = useState(page || 1);
  const pageSize = 20;
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [listLoading, setListLoading] = useState(false);


  const [filter, setFilter] = useState({
    provider_id,
    subject_code,
    warehouse_code,
    po,
    common_search,
    audit_status: new Set([...audit_status]),
    payment_status: new Set([...payment_status]),
    delivery_status: new Set([...delivery_status]),
  });

  const tabs = useMemo(() => {
    return [
      {
        id: PO_STATUS_ALL,
        content: '全部',
        accessibilityLabel: '',
        panelID: 'all-content-1',
      },
      {
        id: PO_STATUS_PENDING,
        content: '已创建',
        panelID: 'created-content-1',
      },
      {
        id: PO_STATUS_FINISH,
        content: '已完结',
        panelID: 'done-content-1',
      },
      {
        id: PO_STATUS_CANCEL,
        content: '已取消',
        panelID: 'canceled-content-1',
      },
    ]
  }, []);

  const [queryListStatus, setQueryListStatus] = useState(po_status || PO_STATUS_ALL);

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      setSelectedTab(selectedTabIndex);
      setQueryListStatus(tabs[selectedTabIndex].id)
    },
    [tabs]
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

  const resourceName = {
    singular: '采购单',
    plural: '采购单',
  }
  const [sourcingListMap, setSourcingListMap] = useState(new Map());
  const [sourcingList, setSourcingList] = useState([]);


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

  // 编辑采购单
  const editEdable = useMemo(() => {
    if (selectedResources.length !== 1) { return false };
    const enableArr = [AUDIT_UNAUDITED, AUDIT_FAILURE, AUDIT_REVOKED];
    const selectedKey = selectedResources[0];
    // if (sourcingListMap.get(selectedKey).po_status === PO_STATUS_CANCEL) return false;

    return enableArr.indexOf(sourcingListMap.get(selectedKey).audit_status) !== -1
  },
    [selectedResources])

  // audit enable control
  const auditEnable = useMemo(() => {
    if (selectedResources.length !== 1) { return false };
    const selectedKey = selectedResources[0];
    if (sourcingListMap.get(selectedKey).po_status === PO_STATUS_CANCEL) return false;
    const enableArr = [AUDIT_UNAUDITED, AUDIT_FAILURE, AUDIT_REVOKED];
    return enableArr.indexOf(sourcingListMap.get(selectedKey).audit_status) !== -1

  }, [selectedResources, sourcingListMap])

  // apply payment control
  const applyPayEnable = useMemo(() => {
    if (selectedResources.length !== 1) { return false };
    const selectedKey = selectedResources[0];
    if (sourcingListMap.get(selectedKey).po_status === PO_STATUS_CANCEL) return false;
    if (sourcingListMap.get(selectedKey).audit_status === AUDIT_REVOKED) return false;
    const item = sourcingListMap.get(selectedKey);
    return ( item.audit_status === AUDIT_PASS && (item.payment_status === PAYMENT_STATUS_PENDING || item.payment_status === PAYMENT_STATUS_FAILURE ) )
  }, [selectedResources, sourcingListMap])

  // cancel enable control
  const cancelEnable = useMemo(() => {
    if (selectedResources.length !== 1) { return false };
    const selectedKey = selectedResources[0];
    if (sourcingListMap.get(selectedKey).po_status === PO_STATUS_CANCEL) return false;

    const enableArr = [AUDIT_UNAUDITED, AUDIT_FAILURE, AUDIT_REVOKED];
    const index = selectedResources.findIndex(
      (item) =>
        (enableArr.indexOf(sourcingListMap.get(item).audit_status) === -1)
    );
    return index === -1

  }, [selectedResources, sourcingListMap])

  // delete enable control
  const deleteEnable = useMemo(() => {
    if (selectedResources.length !== 1) { return false };
    const selectedKey = selectedResources[0];
    if (sourcingListMap.get(selectedKey).po_status === PO_STATUS_CANCEL) return false;

    const enableArr = [AUDIT_UNAUDITED];
    const index = selectedResources.findIndex(
      (item) =>
        (enableArr.indexOf(sourcingListMap.get(item).audit_status) === -1)
    );
    return index === -1

  }, [selectedResources, sourcingListMap])

  // export enable control
  const exportEnable = useMemo(() => {
    if (selectedResources.length !== 1) { return false };
    const selectedKey = selectedResources[0];
    if (sourcingListMap.get(selectedKey).po_status === PO_STATUS_CANCEL) return false;

    const enableArr = [AUDIT_AUDITING, AUDIT_PASS];
    const index = selectedResources.findIndex(
      (item) => (enableArr.indexOf(sourcingListMap.get(item).audit_status) === -1)
    )
    return index === -1

  }, [selectedResources, sourcingListMap])


  const actionEditAudit = useCallback(() => {
    const selectedKey = selectedResources[0];
    const item = sourcingListMap.get(selectedKey);
    // console.log(selectedKey);
    const { po_no } = item;
    const poBase64 = window.btoa(encodeURIComponent(po_no));
    navigate(`edit/${poBase64}`);
  }
    , [navigate, selectedResources, sourcingListMap])

  const actionCommitAudit = useCallback(
    () => {
      loadingContext.loading(true)
      commitApproval(selectedResources[0])
        .then((res) => {
          refreshTrigger();
          toastContext.toast({
            active: true,
            message: "提交审批成功",
          })
        })
        .finally(() => {
          loadingContext.loading(false)
        })
    },
    [selectedResources, refreshTrigger],
  );

  const actionCommitCancelOrder = useCallback(
    () => {
      loadingContext.loading(true)
      cancelSourcingOrder(selectedResources[0])
        .then((res) => {
          refreshTrigger();
          toastContext.toast({
            active: true,
            message: "取消采购单成功",
          })
        })
        .finally(() => {
          loadingContext.loading(false)
        })
    },
    [selectedResources, refreshTrigger],
  );

  const actionDeleteOrder = useCallback(
    () => {
      loadingContext.loading(true)
      deleteSourcingOrder(selectedResources[0])
        .then((res) => {
          refreshTrigger();
          toastContext.toast({
            active: true,
            message: "删除采购单成功",
          })
        })
        .finally(() => {
          loadingContext.loading(false)
        })
    },
    [refreshTrigger, selectedResources],
  );

  const exportPdf = useCallback(() => {
    loadingContext.loading(true)
    exportOrderPdf({ id: selectedResources[0] })
      .then(res => {
        const name = sourcingListMap.get(selectedResources[0]).po_no;
        const fileName = `${name}.pdf`;
        fstlnTool.downloadBlob(res, fileName);
      })
      .finally(() => {
        loadingContext.loading(false)
      })
  }, [selectedResources])


  const promotedBulkActions = useMemo(() => {
    return [
      {
        content: '编辑采购单',
        onAction: actionEditAudit,
        disabled: !editEdable,
      },
      {
        content: '提交审批',
        onAction: actionCommitAudit,
        disabled: !auditEnable,
      },

    ];
  }, [actionCommitAudit, actionEditAudit, auditEnable, editEdable])

  const bulkActions = useMemo(() => {
    return [
      {
        content: '申请付款',
        onAction: () => {
          const { po_no } = sourcingListMap.get(selectedResources[0]);

          navigate(`payRequest/${btoa(po_no)}`)
        },
        disabled: !applyPayEnable,

      },
      {
        content: "取消采购单",
        onAction: actionCommitCancelOrder,
        disabled: !cancelEnable,

      },
      {
        content: "导出采购单",
        onAction: () => { exportPdf() },
        disabled: !exportEnable,

      },
      {
        content: "删除采购单",
        onAction: actionDeleteOrder,
        disabled: !deleteEnable,

      },
    ];
  }, [actionCommitCancelOrder, actionDeleteOrder, applyPayEnable, cancelEnable, deleteEnable, exportEnable, exportPdf, navigate, selectedResources, sourcingListMap])



  const goodsItemNode = useCallback((item, idx) => {
    if (!item) return null;
    const { sku, purchase_num, goods } = item;
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
          <p>{purchase_num}</p>
        </div>
      </div>
    )
  }, [])

  const rowMarkup = useMemo(() => sourcingList.map(
    ({ id, po_no, provider = {}, warehouse = {}, subject = {}, audit_status, payment_status, delivery_status, item }, index) => {

      const prodNod = item.map((goodsItem, idx) => (goodsItemNode(goodsItem, idx)))
      const poBase64 = window.btoa(encodeURIComponent(po_no));
      // console.log(poBase64);
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
        <IndexTable.Cell>{subject && subject.title || ""}</IndexTable.Cell>
        <IndexTable.Cell>{provider && provider.business_name || ""}</IndexTable.Cell>
        <IndexTable.Cell>{warehouse && warehouse.name || ""}</IndexTable.Cell>
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
          <ProductInfoPopover
            popoverNode={item.length > 0 ? prodNod : null}
          >
            {`${item.length}商品`}
          </ProductInfoPopover>
        </IndexTable.Cell>
      </IndexTable.Row >)
    }
  )
    , [goodsItemNode, selectedResources, sourcingList]);


  useEffect(() => {
    setListLoading(true);
    const {
      provider_id = "",
      subject_code = "",
      warehouse_code = "",
      po = "",
      common_search = "",
      audit_status = new Set(),
      payment_status = new Set(),
      delivery_status = new Set(),
    } = filter;

    const queryData = {
      provider_id,
      subject_code,
      warehouse_code,
      po,
      common_search,
      audit_status: [...audit_status],
      payment_status: [...payment_status],
      delivery_status: [...delivery_status],
      po_status: queryListStatus,
      per_page: pageSize,
      page: pageIndex
    };
    setSearchParams({ querys: btoa(JSON.stringify(queryData)) })
    // console.log(searchParams.get("querys"));
    querySourcingList(queryData)
      .then(res => {
        const { data: { list, meta: { pagination: { total = 0 } } } } = res;
        setSourcingList(list);
        setTotal(total)
      })
      .finally(() => {
        setListLoading(false)
      })
  }, [filter, pageIndex, queryListStatus, refresh, searchParams, setSearchParams])


  // export modal
  const RADIO_KEY = useMemo(() => (
    {
      BRAND: "brand",
      ALL: "all",
      TIME: "time",
    }
  ), [])

  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);

  const [exportRadio, setExportRadio] = useState(RADIO_KEY.BRAND);
  const handleExportRadioChange = useCallback((checked, id) => setExportRadio(id), []);

  const [brandObject, setBrandObject] = useState({});
  const brandOptions = useMemo(() => {
    return Object.keys((brandObject)).map((brandKey) => ({ id: brandKey, label: brandObject[brandKey], value: brandObject[brandKey] }))
  },
    [brandObject])

  const [exportRadioBrand, setExportRadioBrand] = useState("");
  useEffect(() => {
    brandOptions.length > 0 && setExportRadioBrand(brandOptions[0].value)
  },
    [brandOptions])


  const [{ month, year }, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date(),
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    [],
  );

  useEffect(() => {
    getBrandList()
      .then((res) => {
        const { data } = res;
        setBrandObject(data);
      })
  }, [])

  const exportExcel = useCallback(() => {
    loadingContext.loading(true)
    let queryObject = {};
    if (exportRadio === RADIO_KEY.BRAND) {
      queryObject = {
        brand_name: exportRadioBrand
      }
    } else if (exportRadio === RADIO_KEY.TIME) {
      const { start, end } = selectedDates;
      queryObject = {
        create_time: [
          moment(start).format("YYYY-MM-DD"),
          moment(end).format("YYYY-MM-DD"),
        ]
      }
    }

    exportOrderExcel(queryObject)
      .then(res => {
        const blob = res;
        let fileName = "";
        switch (exportRadio) {

          case RADIO_KEY.BRAND:
            fileName = `采购单数据_${exportRadioBrand}_${new Date().getTime()}.xls`
            break;
          case RADIO_KEY.TIME:
            const { start, end } = selectedDates;
            fileName = `采购单数据_${moment(start).format("YYYYMMDD")}-${moment(end).format("YYYYMMDD")}.xls`
            break;
          default:
            fileName = `采购单数据_all_${new Date().getTime()}`
            break;
        }
        fstlnTool.downloadBlob(blob, fileName);
        setActive(false);
        toastContext.toast({
          active: true,
          message: "导出成功"
        })
      })
      .finally(() => {
        loadingContext.loading(false)
      })
  }, [exportRadio, exportRadioBrand, selectedDates])


  return (
    <Page
      title="采购单列表"
      fullWidth
      primaryAction={{ content: '新建采购单', onAction: () => { navigate("add") } }}
      secondaryActions={[
        { content: '导出', onAction: () => { setActive(true) } },
      ]}

    >
      <Card>
        <Tabs
          tabs={tabs} selected={selectedTab} onSelect={handleTabChange}
        >


        </Tabs>
        <div style={{ padding: '16px', display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <SourcingListFilter filter={filter} onChange={(filter) => { setFilter(filter) }} />
          </div>
        </div>
        <IndexTable
          loading={listLoading}
          resourceName={resourceName}
          itemCount={sourcingList.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={(a, b, c) => { handleSelectionChange(a, b, c) }}
          promotedBulkActions={promotedBulkActions}
          bulkActions={bulkActions}
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
      </Card>

      <Modal
        large={false}
        open={active}
        onClose={handleChange}
        title="导出采购单"
        primaryAction={{
          content: '导出',
          onAction: exportExcel,
        }}
        secondaryActions={[
          {
            content: '取消',
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <Stack vertical>
            <RadioButton
              label="按项目"
              checked={exportRadio === 'brand'}
              id="brand"
              name="exportRadio"
              onChange={handleExportRadioChange}
            />
            {
              exportRadio === 'brand' &&
              <div>
                <Select
                  options={brandOptions}
                  value={exportRadioBrand}
                  onChange={val => setExportRadioBrand(val)}
                />
              </div>
            }
            <RadioButton
              label="所有采购单"
              id="all"
              name="exportRadio"
              checked={exportRadio === 'all'}
              onChange={handleExportRadioChange}

            />
            <RadioButton
              label="按创建时间"
              id="time"
              name="exportRadio"
              checked={exportRadio === 'time'}
              onChange={handleExportRadioChange}

            />
            {
              exportRadio === 'time' &&
              <div>
                <DatePicker
                  month={month}
                  year={year}
                  onChange={setSelectedDates}
                  onMonthChange={handleMonthChange}
                  selected={selectedDates}
                  allowRange={true}
                />
              </div>
            }
          </Stack>

        </Modal.Section>

      </Modal>

    </Page>
  );
}
export { SourcingList }