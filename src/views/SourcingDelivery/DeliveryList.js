/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-02-16 14:37:42
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
import { getShipingList } from "../../api/requests";
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
        onAction: () => console.log('Todo: implement bulk delete'),
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
      warehouse_code = "",
      shipping_date = null,
      common_search = "",
      repo_status = new Set(),
    } = filter;
    getShipingList(
      {
        ...filter,
        status: queryListStatus,
      }
    )
      .then(res => {
        // const { data: { data, meta } } = res;
        const data = [
          {
            "id": 49,
            "shipping_no": "NBY209019200392",
            "binning_no": "SRT2021081102",
            "expected_days": 6,
            "tracking_no": "SF100293801",
            "tracking_service": "顺丰快递",
            "shipping_price": "8.8000",
            "remark": "补发",
            "provider_name": "ZTE CORPORATION",
            "warehouse_name": "荣晟波兰3仓",
            "status": "pending",
            "shipping_date": "2022-01-01",
            "expected_date": "2022-01-07",
            "item": [
              {
                "sku": "6902176063282",
                "po_no": "PO#ZTE2201261",
                "shipping_num": 1,
                "goods": {
                  "sku": "6902176063282",
                  "cn_name": "Axon 30 5G  8GB Aqua -北美整机",
                  "en_name": "Axon 30 5G 8GB aqua -US",
                  "price": "500.00",
                  "image_url": "https://cdn.shopify.com/s/files/1/0510/4556/4565/products/4_d9d43bfd-ce21-4239-8a70-5a80fd6803c3.png?v=1628847793"
                }
              },
              {
                "sku": "6974786420014",
                "po_no": "PO#ZTE2201261",
                "shipping_num": 1,
                "goods": {
                  "sku": "6974786420014",
                  "cn_name": "Heyup迷你三脚架",
                  "en_name": "Heyup Mini Tripod",
                  "price": "30.00",
                  "image_url": null
                }
              }
            ],
            "provider": {
              "id": 5,
              "business_name": "ZTE CORPORATION",
              "business_address": "6/F., A Wing,  ZTE Plaza, Keji Road South, Hi-Tech Industrial Park, Nanshan District, Shenzhen, P.R.China",
              "contacts": "易艳",
              "phone": "13818027409"
            },
            "warehouse": {
              "id": 1,
              "name": "荣晟波兰3仓",
              "cn_address": "Ul. Logistyczna 1, Swiecko  69100, Poland\r\nSR WHPL",
              "phone": "+48 953 030 195",
              "contacts_cn_name": "SR WHPL"
            }
          },
          {
            "id": 47,
            "shipping_no": "NBY209019200391",
            "binning_no": null,
            "expected_days": 5,
            "tracking_no": "SF100293801",
            "tracking_service": null,
            "shipping_price": "9.9000",
            "remark": "补发",
            "provider_name": "Nubia Technology Co., Ltd.",
            "warehouse_name": "荣晟香港2仓",
            "status": "portion",
            "shipping_date": "2022-01-01",
            "expected_date": "2022-01-06",
            "item": [
              {
                "sku": "6902176906473",
                "po_no": "PO#NUBIA2103021",
                "shipping_num": 20,
                "goods": {
                  "sku": "6902176906473",
                  "cn_name": "魔盒散热背夹（黑色 带3A线）红魔",
                  "en_name": "Ice Dock",
                  "price": "14.90",
                  "image_url": ""
                }
              },
              {
                "sku": "6902176906596",
                "po_no": "PO#NUBIA2103041",
                "shipping_num": 20,
                "goods": {
                  "sku": "6902176906596",
                  "cn_name": "NX659J 红魔5S 银色 美洲 8G+128G",
                  "en_name": "RedMagic 5S 8+128 NA Silver",
                  "price": "579.00",
                  "image_url": ""
                }
              },
              {
                "sku": "6902176906664",
                "po_no": "PO#NUBIA2103041",
                "shipping_num": 30,
                "goods": {
                  "sku": "6902176906664",
                  "cn_name": "红魔5S 12+256 UK 红蓝渐变",
                  "en_name": "RedMagic 5S 12+256 UK Red & Blue",
                  "price": "549.00",
                  "image_url": ""
                }
              }
            ],
            "provider": {
              "id": 6,
              "business_name": "Nubia Technology Co., Ltd.",
              "business_address": "16/F, Building 2, Chongwen Park, Nanshan Zhiyuan, 3370 Liuxian Road, Nanshan District, Shenzhen 518055, China.",
              "contacts": "陈锐锋",
              "phone": "15710800732"
            },
            "warehouse": {
              "id": 2,
              "name": "荣晟香港2仓",
              "cn_address": "Shing Fat Transportation Ltd <br /> 23/F GOODMAN DYNAMIC CTR <br /> 188 YEUNG UK ROAD，TSUEN WAN，HONG KONG <br /> Esther Leung Tel:(852)24001637 <br /> 盛發運輸有限公司 <br /> 新界荃灣楊屋道188號嘉民達力中心23樓A室。<br /> *請到3 / 4 / 5樓，乘搭貨用升降機才可以到達23樓貨倉*",
              "phone": "(852) 2400 1637",
              "contacts_cn_name": "Esther Leung"
            }
          },
          {
            "id": 47,
            "shipping_no": "NBY209019200391",
            "binning_no": null,
            "expected_days": 5,
            "tracking_no": "SF100293801",
            "tracking_service": null,
            "shipping_price": "9.9000",
            "remark": "补发",
            "provider_name": "Nubia Technology Co., Ltd.",
            "warehouse_name": "荣晟香港2仓",
            "status": "success",
            "shipping_date": "2022-01-01",
            "expected_date": "2022-01-06",
            "item": [
              {
                "sku": "6902176906473",
                "po_no": "PO#NUBIA2103021",
                "shipping_num": 20,
                "goods": {
                  "sku": "6902176906473",
                  "cn_name": "魔盒散热背夹（黑色 带3A线）红魔",
                  "en_name": "Ice Dock",
                  "price": "14.90",
                  "image_url": ""
                }
              },
              {
                "sku": "6902176906596",
                "po_no": "PO#NUBIA2103041",
                "shipping_num": 20,
                "goods": {
                  "sku": "6902176906596",
                  "cn_name": "NX659J 红魔5S 银色 美洲 8G+128G",
                  "en_name": "RedMagic 5S 8+128 NA Silver",
                  "price": "579.00",
                  "image_url": ""
                }
              },
              {
                "sku": "6902176906664",
                "po_no": "PO#NUBIA2103041",
                "shipping_num": 30,
                "goods": {
                  "sku": "6902176906664",
                  "cn_name": "红魔5S 12+256 UK 红蓝渐变",
                  "en_name": "RedMagic 5S 12+256 UK Red & Blue",
                  "price": "549.00",
                  "image_url": ""
                }
              }
            ],
            "provider": {
              "id": 6,
              "business_name": "Nubia Technology Co., Ltd.",
              "business_address": "16/F, Building 2, Chongwen Park, Nanshan Zhiyuan, 3370 Liuxian Road, Nanshan District, Shenzhen 518055, China.",
              "contacts": "陈锐锋",
              "phone": "15710800732"
            },
            "warehouse": {
              "id": 2,
              "name": "荣晟香港2仓",
              "cn_address": "Shing Fat Transportation Ltd <br /> 23/F GOODMAN DYNAMIC CTR <br /> 188 YEUNG UK ROAD，TSUEN WAN，HONG KONG <br /> Esther Leung Tel:(852)24001637 <br /> 盛發運輸有限公司 <br /> 新界荃灣楊屋道188號嘉民達力中心23樓A室。<br /> *請到3 / 4 / 5樓，乘搭貨用升降機才可以到達23樓貨倉*",
              "phone": "(852) 2400 1637",
              "contacts_cn_name": "Esther Leung"
            }
          }
        ]
        setDeliveryList(data);
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