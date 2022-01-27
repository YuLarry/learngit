/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-01-27 15:31:22
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Page, Pagination, Tabs, TextStyle, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeAuditStatus } from "../../components/StatusBadges/BadgeAuditStatus";
import { BadgeDeliveryStatus } from "../../components/StatusBadges/BadgeDeliveryStatus";
import { BadgePaymentStatus } from "../../components/StatusBadges/BadgePaymentStatus";
import { AUDIT_FAILURE, AUDIT_PASS, AUDIT_REVOKED, AUDIT_UNAUDITED, PAYMENT_STATUS_FAILURE } from "../../utils/StaticData";
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

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTab(selectedTabIndex),
    [],
  );

  const tabs = useMemo(() => {
    return [
      {
        id: 'all-list',
        content: '全部',
        accessibilityLabel: '',
        panelID: 'all-customers-content-1',
      },
      {
        id: 'created-list',
        content: '已创建',
        panelID: 'accepts-marketing-content-1',
      },
      {
        id: 'done-list',
        content: '已完结',
        panelID: 'repeat-customers-content-1',
      },
      {
        id: 'canceled-list',
        content: '已取消',
        panelID: 'prospects-content-1',
      },
    ]
  }, []);



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



  const [sourcingList, setSourcingList] = useState([
    {
      "id": 222,
      "po_no": "PO#ZTE2201261",
      "subject_title": "深圳腾飞科技管理有限公司",
      "provider_name": "ZTE CORPORATION",
      "warehouse_name": "荣晟波兰3仓",
      "item": [
        {
          "sku": "6974786420014",
          "purchase_num": 1,
          "goods": {
            "sku": "6974786420014",
            "cn_name": "Heyup迷你三脚架",
            "en_name": "Heyup Mini Tripod",
            "price": "30.00",
            "image_url": null
          }
        },
        {
          "sku": "6902176063282",
          "purchase_num": 78,
          "goods": {
            "sku": "6902176063282",
            "cn_name": "Axon 30 5G  8GB Aqua -北美整机",
            "en_name": "Axon 30 5G 8GB aqua -US",
            "price": "500.00",
            "image_url": "https://cdn.shopify.com/s/files/1/0510/4556/4565/products/4_d9d43bfd-ce21-4239-8a70-5a80fd6803c3.png?v=1628847793"
          }
        }
      ],
      "audit_status": "audit_pass",
      "payment_status": "payment_pass",
      "delivery_status": "delivery_partial_transport",
      "po_status": "po_pending",
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
      "id": 221,
      "po_no": "PO#ZTE2201214",
      "subject_title": "深圳腾飞科技管理有限公司",
      "provider_name": "ZTE CORPORATION",
      "warehouse_name": "",
      "item": [],
      "audit_status": "audit_unaudited",
      "payment_status": "payment_pass",
      "delivery_status": "delivery_pending",
      "po_status": "po_pending",
      "provider": {
        "id": 5,
        "business_name": "ZTE CORPORATION",
        "business_address": "6/F., A Wing,  ZTE Plaza, Keji Road South, Hi-Tech Industrial Park, Nanshan District, Shenzhen, P.R.China",
        "contacts": "易艳",
        "phone": "13818027409"
      },
      "warehouse": null
    },
    {
      "id": 220,
      "po_no": "PO#ZTE2201213",
      "subject_title": "深圳腾飞科技管理有限公司",
      "provider_name": "ZTE CORPORATION",
      "warehouse_name": "荣晟波兰3仓",
      "item": [],
      "audit_status": "audit_unaudited",
      "payment_status": "payment_pending",
      "delivery_status": "delivery_pending",
      "po_status": "po_pending",
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
      "id": 219,
      "po_no": "PO#ZTE2201212",
      "subject_title": "深圳腾飞科技管理有限公司",
      "provider_name": "ZTE CORPORATION",
      "warehouse_name": "荣晟波兰3仓",
      "item": [],
      "audit_status": "audit_unaudited",
      "payment_status": "payment_pending",
      "delivery_status": "delivery_pending",
      "po_status": "po_pending",
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
      "id": 218,
      "po_no": "PO#ZTE2201211",
      "subject_title": "深圳腾飞科技管理有限公司",
      "provider_name": "ZTE CORPORATION",
      "warehouse_name": "荣晟波兰3仓",
      "item": [],
      "audit_status": "audit_unaudited",
      "payment_status": "payment_pending",
      "delivery_status": "delivery_pending",
      "po_status": "po_pending",
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
      "id": 211,
      "po_no": "PO#ZTE2201171",
      "subject_title": "深圳腾飞科技管理有限公司",
      "provider_name": "ZTE CORPORATION",
      "warehouse_name": "荣晟波兰3仓",
      "item": [],
      "audit_status": "audit_unaudited",
      "payment_status": "payment_pending",
      "delivery_status": "delivery_pending",
      "po_status": "po_pending",
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
      "id": 208,
      "po_no": "PO#XIAOMI H.K. LIMITED2112301",
      "subject_title": "FASTLANE JSK COMPANY LIMITED",
      "provider_name": "小米科技责任有限公司",
      "warehouse_name": "",
      "item": [],
      "audit_status": "audit_unaudited",
      "payment_status": "payment_pending",
      "delivery_status": "delivery_pending",
      "po_status": "po_pending",
      "provider": {
        "id": 18,
        "business_name": "小米科技责任有限公司",
        "business_address": "Suite 3209, 32/F, Tower 5, The Gateway, Harbour City, 15 Canton Road, Tsim Sha Tsui, Kowloon, Hong Kong",
        "contacts": "老王",
        "phone": "15873187593"
      },
      "warehouse": null
    },
    {
      "id": 207,
      "po_no": "PO#ZTE2112301",
      "subject_title": "FASTLANE LIMITED",
      "provider_name": "ZTE CORPORATION",
      "warehouse_name": "",
      "item": [],
      "audit_status": "audit_unaudited",
      "payment_status": "payment_pending",
      "delivery_status": "delivery_pending",
      "po_status": "po_pending",
      "provider": {
        "id": 5,
        "business_name": "ZTE CORPORATION",
        "business_address": "6/F., A Wing,  ZTE Plaza, Keji Road South, Hi-Tech Industrial Park, Nanshan District, Shenzhen, P.R.China",
        "contacts": "易艳",
        "phone": "13818027409"
      },
      "warehouse": null
    },
    {
      "id": 206,
      "po_no": "PO#NUBIA2112091",
      "subject_title": "GAMEGEEK LIMITED",
      "provider_name": "Nubia Technology Co., Ltd.",
      "warehouse_name": "荣晟波兰3仓",
      "item": [
        {
          "sku": "6921815618126",
          "purchase_num": 20,
          "goods": {
            "sku": "6921815618126",
            "cn_name": "红魔7 plus",
            "en_name": "RedMagic 7 Plus",
            "price": "350.00",
            "image_url": "https://cdn.shopify.com/s/files/1/0570/8726/2882/products/3_8a96067b-3646-4c5c-a2a8-bfafd1687ca3.png?v=1624248600"
          }
        }
      ],
      "audit_status": "audit_pass",
      "payment_status": "payment_pass",
      "delivery_status": "delivery_pending",
      "po_status": "po_pending",
      "provider": {
        "id": 6,
        "business_name": "Nubia Technology Co., Ltd.",
        "business_address": "16/F, Building 2, Chongwen Park, Nanshan Zhiyuan, 3370 Liuxian Road, Nanshan District, Shenzhen 518055, China.",
        "contacts": "陈锐锋",
        "phone": "15710800732"
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
      "id": 205,
      "po_no": "PO#ZTE21120810",
      "subject_title": "FASTLANE LIMITED",
      "provider_name": "ZTE CORPORATION",
      "warehouse_name": "荣晟香港2仓",
      "item": [],
      "audit_status": "audit_unaudited",
      "payment_status": "payment_pending",
      "delivery_status": "delivery_pending",
      "po_status": "po_pending",
      "provider": {
        "id": 5,
        "business_name": "ZTE CORPORATION",
        "business_address": "6/F., A Wing,  ZTE Plaza, Keji Road South, Hi-Tech Industrial Park, Nanshan District, Shenzhen, P.R.China",
        "contacts": "易艳",
        "phone": "13818027409"
      },
      "warehouse": {
        "id": 2,
        "name": "荣晟香港2仓",
        "cn_address": "Shing Fat Transportation Ltd <br /> 23/F GOODMAN DYNAMIC CTR <br /> 188 YEUNG UK ROAD，TSUEN WAN，HONG KONG <br /> Esther Leung Tel:(852)24001637 <br /> 盛發運輸有限公司 <br /> 新界荃灣楊屋道188號嘉民達力中心23樓A室。<br /> *請到3 / 4 / 5樓，乘搭貨用升降機才可以到達23樓貨倉*",
        "phone": "(852) 2400 1637",
        "contacts_cn_name": "Esther Leung"
      }
    }
  ]);

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
        disabled: true,

      },
      {
        content: "删除采购单",
        onAction: () => console.log('Todo: implement bulk delete'),
        disabled: !deleteEnable,

      },
    ];
  }, [applyPayEnable, auditEnable])


  const rowMarkup = useMemo(() => sourcingList.map(
    ({ id, po_no, subject_title, provider_name, warehouse_name, audit_status, payment_status, delivery_status, good_search }, index) => (
      <IndexTable.Row
        id={id}
        key={index}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Button
            plain
            monochrome
            url={`detail`}
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
        <IndexTable.Cell>{good_search}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  )
    , [selectedResources, sourcingList]);


  const exportHandler = useCallback(
    () => {
      console.log("export");
    },
    [],
  );





  useEffect(() => {

  }, [])


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
              <SourcingListFilter />
            </div>

          </div>
          <IndexTable
            // loading
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