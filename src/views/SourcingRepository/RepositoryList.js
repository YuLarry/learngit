/*
 * @Author: lijunwei
 * @Date: 2022-01-10 17:15:23
 * @LastEditTime: 2022-02-10 18:53:32
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, IndexTable, Page, Pagination, Tabs, TextStyle, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRepoTableList } from "../../api/requests";
import { InRepositoryManualModal } from "./piece/InRepositoryManualModal";
import { RepositoryListFilter } from "./piece/RepositoryListFilter";


function RepositoryList(props) {

  const navigation = useNavigate();


  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );


  const tabs = [
    {
      id: 'all-list',
      content: '全部',
      accessibilityLabel: '',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'unbound-list',
      content: '待入库',
      panelID: 'accepts-marketing-content-1',
    },
    {
      id: 'part-bound-list',
      content: '部分入库',
      panelID: 'repeat-customers-content-1',
    },
    {
      id: 'bound-list',
      content: '已入库',
      panelID: 'prospects-content-1',
    },
  ];

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



  // =========================

  const [tableList, setTableList] = useState([]);
  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(tableList);


  const promotedBulkActions = [
    {
      content: '手动确定入库',
      onAction: () => console.log('Todo: implement bulk edit'),
    },

  ];
  const bulkActions = [
    // {
    //   content: 'Add tags',
    //   onAction: () => console.log('Todo: implement bulk add tags'),
    // },
    // {
    //   content: 'Remove tags',
    //   onAction: () => console.log('Todo: implement bulk remove tags'),
    // },
    // {
    //   content: 'Delete customers',
    //   onAction: () => console.log('Todo: implement bulk delete'),
    // },
  ];

  const rowMarkup = tableList.map(
    ({ id, inbound_no, plan_total_qty, actual_total_qty, client_account_code,item, provider_name, warehouse_area, warehouse_name,  }, index) => (
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
            url={`detail`}
          >
            <TextStyle variation="strong">{inbound_no}</TextStyle>
          </Button>
          {/* <Link to={`detail/${id}`}>{po_no}</Link> */}
        </IndexTable.Cell>
        <IndexTable.Cell>{client_account_code}</IndexTable.Cell>
        <IndexTable.Cell>{provider_name}</IndexTable.Cell>
        <IndexTable.Cell>{warehouse_name}</IndexTable.Cell>
        <IndexTable.Cell>{warehouse_area}</IndexTable.Cell>
        <IndexTable.Cell>状态</IndexTable.Cell>
        <IndexTable.Cell>商品</IndexTable.Cell>
        <IndexTable.Cell>{plan_total_qty}</IndexTable.Cell>
        <IndexTable.Cell>{actual_total_qty}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );


  useEffect(() => {
    getRepoTableList()
      .then()
      .finally(() => {
        const data = [
          {
            "id": 40,
            "inbound_no": "RK2022020700002",
            "provider_name": "Nubia Technology Co., Ltd.",
            "warehouse_name": "荣晟香港2仓",
            "plan_total_qty": 20,
            "actual_total_qty": 0,
            "status": "待入库",
            "warehouse_area": "B2C销售区",
            "client_account_code": "WSRM",
            "item": [
              {
                "sku": "6902176906596",
                "plan_qty": 20,
                "goods": {
                  "sku": "6902176906596",
                  "cn_name": "NX659J 红魔5S 银色 美洲 8G+128G",
                  "en_name": "RedMagic 5S 8+128 NA Silver",
                  "price": "579.00",
                  "image_url": ""
                }
              }
            ]
          },
          {
            "id": 39,
            "inbound_no": "RK2022020700001",
            "provider_name": "Nubia Technology Co., Ltd.",
            "warehouse_name": "荣晟香港2仓",
            "plan_total_qty": 50,
            "actual_total_qty": 0,
            "status": "待入库",
            "warehouse_area": "B2C销售区",
            "client_account_code": "WSRM",
            "item": [
              {
                "sku": "6902176906664",
                "plan_qty": 30,
                "goods": {
                  "sku": "6902176906664",
                  "cn_name": "红魔5S 12+256 UK 红蓝渐变",
                  "en_name": "RedMagic 5S 12+256 UK Red & Blue",
                  "price": "549.00",
                  "image_url": ""
                }
              },
              {
                "sku": "6902176906473",
                "plan_qty": 20,
                "goods": {
                  "sku": "6902176906473",
                  "cn_name": "魔盒散热背夹（黑色 带3A线）红魔",
                  "en_name": "Ice Dock",
                  "price": "14.90",
                  "image_url": ""
                }
              }
            ]
          }
        ];


        setTableList(data);

      })
  }, []);


  return (
    <Page
      title="入库单列表"
      fullWidth
    >
      <Card>
        <Tabs
          tabs={tabs} selected={selected} onSelect={handleTabChange}
        >
          <div style={{ padding: '16px', display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <RepositoryListFilter />
            </div>

          </div>
          <IndexTable
            resourceName={resourceName}
            itemCount={tableList.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            bulkActions={bulkActions}
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

        </Tabs>
      </Card>


      <InRepositoryManualModal />

    </Page>
  );
}
export { RepositoryList }