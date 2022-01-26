/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-01-25 19:12:16
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Page, Pagination, Tabs, TextStyle, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SourcingListFilter } from "./piece/SourcingListFilter";


function SourcingList(props) {
  
  const resourceName = {
    singular: '采购单',
    plural: '采购单',
  }

  const navigate = useNavigate();

  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const [tabs] = useState([
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
  ]);

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



  const [sourcingList, setSourcingList] = useState([
    {
      "id": 1,
      "po_no": " PO#NUBIA2112172",
      "provider_id": "6",
      "warehouse_code": "WSHK02",
      "subject": "gamegeek_limited",
      "audit_status": "audit_pass",
      "payment_status": "payment_applying",
      "delivery_status": "delivery_pending",
      "goods_total": 2,
      "goods_item": [
        {
          "shipping_id": 43,
          "po_no": "PO#NUBIA2112172",
          "sku": "6902176906473",
          "purchase_actual_num": "40",
          "good": {
            "sku": "6902176906473",
            "cn_name": "魔盒散热背夹（黑色 带3A线）红魔",
            "en_name": "Ice Dock"
          }
        },
        {
          "shipping_id": 43,
          "po_no": "PO#NUBIA2112172",
          "sku": "6902176906596",
          "purchase_actual_num": "20",
          "good": {
            "sku": "6902176906596",
            "cn_name": "NX659J 红魔5S 银色 美洲 8G+128G",
            "en_name": "RedMagic 5S 8+128 NA Silver"
          }
        }
      ]
    },
    {
      "id": 2,
      "po_no": " PO#NUBIA2112172",
      "provider_id": "6",
      "warehouse_code": "WSHK02",
      "subject": "gamegeek_limited",
      "audit_status": "audit_pass",
      "payment_status": "payment_applying",
      "delivery_status": "delivery_pending",
      "goods_total": 2,
      "goods_item": [
        {
          "shipping_id": 43,
          "po_no": "PO#NUBIA2112172",
          "sku": "6902176906473",
          "purchase_actual_num": "40",
          "good": {
            "sku": "6902176906473",
            "cn_name": "魔盒散热背夹（黑色 带3A线）红魔",
            "en_name": "Ice Dock"
          }
        },
        {
          "shipping_id": 43,
          "po_no": "PO#NUBIA2112172",
          "sku": "6902176906596",
          "purchase_actual_num": "20",
          "good": {
            "sku": "6902176906596",
            "cn_name": "NX659J 红魔5S 银色 美洲 8G+128G",
            "en_name": "RedMagic 5S 8+128 NA Silver"
          }
        }
      ]
    },
    {
      "id": 2,
      "po_no": " PO#NUBIA2112172",
      "provider_id": "6",
      "warehouse_code": "WSHK02",
      "subject": "gamegeek_limited",
      "audit_status": "audit_pass",
      "payment_status": "payment_applying",
      "delivery_status": "delivery_pending",
      "goods_total": 2,
      "goods_item": [
        {
          "shipping_id": 43,
          "po_no": "PO#NUBIA2112172",
          "sku": "6902176906473",
          "purchase_actual_num": "40",
          "good": {
            "sku": "6902176906473",
            "cn_name": "魔盒散热背夹（黑色 带3A线）红魔",
            "en_name": "Ice Dock"
          }
        },
        {
          "shipping_id": 43,
          "po_no": "PO#NUBIA2112172",
          "sku": "6902176906596",
          "purchase_actual_num": "20",
          "good": {
            "sku": "6902176906596",
            "cn_name": "NX659J 红魔5S 银色 美洲 8G+128G",
            "en_name": "RedMagic 5S 8+128 NA Silver"
          }
        }
      ]
    }
  ]);
  

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(sourcingList);


  const promotedBulkActions = [
    {
      content: '提交审批',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
    {
      content: '申请付款',
      onAction: () => console.log(navigate("payRequest")),
    },
    {
      content: "取消采购单",
      onAction: () => console.log('Todo: implement bulk remove tags'),
    },
    {
      content: "导出采购单",
      onAction: () => console.log('Todo: implement bulk delete'),
    },
    {
      content: "删除采购单",
      onAction: () => console.log('Todo: implement bulk delete'),
    },
  ];


  const rowMarkup = useMemo(()=>sourcingList.map(
    ({ id, po_no, subject_code, provider_id, warehouse_code, audit, payment_status, delivery_status, good_search }, index) => (
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
        <IndexTable.Cell>{subject_code}</IndexTable.Cell>
        <IndexTable.Cell>{provider_id}</IndexTable.Cell>
        <IndexTable.Cell>{warehouse_code}</IndexTable.Cell>
        <IndexTable.Cell>{audit}</IndexTable.Cell>
        <IndexTable.Cell>{payment_status}</IndexTable.Cell>
        <IndexTable.Cell>{delivery_status}</IndexTable.Cell>
        <IndexTable.Cell>{good_search}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  )
  ,[selectedResources, sourcingList]);


  const exportHandler = useCallback(
    () => {
      console.log("export");
    },
    [],
  );


  
  

  useEffect(()=>{
    
  },[])


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
          tabs={tabs} selected={selected} onSelect={handleTabChange}
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
            onSelectionChange={ handleSelectionChange }
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