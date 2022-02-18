/*
 * @Author: lijunwei
 * @Date: 2022-01-24 16:02:59
 * @LastEditTime: 2022-02-18 16:54:59
 * @LastEditors: lijunwei
 * @Description: 
 */

import { IndexTable, Modal, TextField, TextStyle, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";

function InRepositoryManualModal(props) {

  const { 
    modalOpen = false, 
    modalOpenChange = () => { }, 
    tableList = [], 
    tableListChange = () => { } ,
    onCommit = ()=>{}
  } = props;

  const resourceName = {
    singular: '商品',
    plural: '商品',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(tableList);

  const promotedBulkActions = [
    {
      content: '移除',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];

  const goodsFormChangeHandler = useCallback(
    (idx, val, key) => {

      const a = [...tableList];

      a[idx][key] = val
      tableListChange(a);
    },
    [tableList, tableListChange],
  );


  const rowMarkup = useMemo(() => {
    return tableList.map(
      ({ id,
        plan_qty,
        po_item_id,
        po_no,
        shipping_no,
        goods: {
          cn_name
        },
        inbound_qty = "0",
        sku }, index) => (
        <IndexTable.Row
          id={id}
          key={index}
          // selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <TextStyle variation="strong">{sku}</TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>{cn_name}</IndexTable.Cell>
          <IndexTable.Cell>
            {plan_qty}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextField
              type="number"
              value={inbound_qty}
              // prefix="$"
              onChange={(v) => { goodsFormChangeHandler(index, v, "inbound_qty") }}
            />
          </IndexTable.Cell>
          <IndexTable.Cell>{po_no}</IndexTable.Cell>
          <IndexTable.Cell>{shipping_no}</IndexTable.Cell>

        </IndexTable.Row>
      ),
    )
  },
    [goodsFormChangeHandler, tableList]
  );
  // ====-=



  return (
    <Modal
      large={true}
      open={modalOpen}
      onClose={() => { modalOpenChange(false) }}
      title="确认入库 - 产品明细"
      primaryAction={{
        content: '确认',
        onAction: () => {
          onCommit( tableList )
        },
      }}
      secondaryActions={[
        {
          content: '取消',
          onAction: () => {
            modalOpenChange(false);
          },
        },
      ]}
    >
      <IndexTable
        resourceName={resourceName}
        itemCount={tableList.length}
        // selectedItemsCount={
        //   allResourcesSelected ? 'All' : selectedResources.length
        // }
        // onSelectionChange={handleSelectionChange}
        // promotedBulkActions={promotedBulkActions}
        selectable={false}
        headings={[
          { title: '货品SKU' },
          { title: '商品信息' },
          { title: '预入库数量' },
          { title: '已入库数量' },
          { title: '关联采购单' },
          { title: '关联发货单' },
        ]}
      >
        {rowMarkup}
      </IndexTable>

    </Modal>
  );
}
export { InRepositoryManualModal }
