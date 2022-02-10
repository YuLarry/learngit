/*
 * @Author: lijunwei
 * @Date: 2022-01-24 16:02:59
 * @LastEditTime: 2022-01-24 16:14:32
 * @LastEditors: lijunwei
 * @Description: 
 */

import { IndexTable, Modal, TextField, TextStyle, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";

function InRepositoryManualModal(props) {

  // ====
  const [customers, setCustomers] = useState([
    {
      id: '3413',
      url: 'customers/341',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      orders: 20,
      amountSpent: 2400,
    },
    {
      id: '2563',
      url: 'customers/256',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      orders: 30,
      amountSpent: 140,
    },
  ]);
  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customers);

  const promotedBulkActions = [
    {
      content: '移除',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];

  const goodsFormChangeHandler = useCallback(
    (idx, val, key) => {

      const a = [...customers];

      a[idx][key] = val
      setCustomers(a);
    },
    [customers],
  );


  const rowMarkup = useMemo(() => {
    return customers.map(
      ({ id, name, location, orders, amountSpent }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <TextStyle variation="strong">{name}</TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>{location}</IndexTable.Cell>
          <IndexTable.Cell>
            { orders }
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextField
              type="number"
              value={amountSpent}
              prefix="$"
              onChange={(v) => { goodsFormChangeHandler(index, v, "amountSpent") }}
            />
          </IndexTable.Cell>
          <IndexTable.Cell>{location}</IndexTable.Cell>
          <IndexTable.Cell>{location}</IndexTable.Cell>

        </IndexTable.Row>
      ),
    )
  },
    [customers, goodsFormChangeHandler, selectedResources]
  );
  // ====-=

  const [modalOpen, setModalOpen] = useState(false);
  const handleChange = useCallback(
    () => {
      setModalOpen(false);
    },
    [],
  );


  return (
    <Modal
        large={true}
        open={modalOpen}
        onClose={handleChange}
        title="确认入库 - 产品明细"
        primaryAction={{
          content: '确认',
          onAction: handleChange,
        }}
        secondaryActions={[
          {
            content: '取消',
            onAction: handleChange,
          },
        ]}
      >
      <IndexTable
        resourceName={resourceName}
        itemCount={customers.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        promotedBulkActions={promotedBulkActions}
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
