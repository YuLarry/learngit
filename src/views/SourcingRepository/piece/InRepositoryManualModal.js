/*
 * @Author: lijunwei
 * @Date: 2022-01-24 16:02:59
 * @LastEditTime: 2022-03-20 17:58:35
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, IndexTable, Modal, TextField, TextStyle, Thumbnail } from "@shopify/polaris";
import { useCallback, useMemo } from "react";
import { ProductInfoPopover } from "../../../components/ProductInfoPopover/ProductInfoPopover";
import { fstlnTool } from "../../../utils/Tools";

function InRepositoryManualModal(props) {

  const {
    modalOpen = false,
    modalOpenChange = () => { },
    tableListObject = null,
    tableListObjectChange = () => { },
    onCommit = () => { }
  } = props;

  const resourceName = {
    singular: '商品',
    plural: '商品',
  };

  const goodsFormChangeHandler = useCallback(
    (wSku, val, key) => {
      if (val !== "" && !fstlnTool.INT_MORE_THAN_ZERO_REG.test(val)) return;
      const _table = { ...tableListObject };

      _table[wSku][0][key] = val
      tableListObjectChange(_table);
    },
    [tableListObject, tableListObjectChange],
  );

  const productInfo = (product) => {
    if (!product) return null;
    const { cn_name, en_name, image_url, id, price, sku } = product;
    return (
      <div className="product-container" style={{ maxWidth: "400px", display: "flex", alignItems: "flex-start" }}>

        <Thumbnail
          source={image_url || ""}
          alt={en_name}
          size="small"
        />
        <div style={{ flex: 1, marginLeft: "1em" }}>
          <h4>{en_name}</h4>
          <h4>{cn_name}</h4>
          <span>{price}</span>
        </div>
      </div>
    )
  }

  const rowMarkup = useMemo(() => {
    if (!tableListObject) return;
    const warehouseSkuKeys = Object.keys(tableListObject);
    return warehouseSkuKeys.map(
      (wSku, index) => {
        const { id,
          plan_qty,
          po_item_id,
          po_no,
          shipping_no,
          warehouse_goods: goods,
          actual_qty = "",
          inbound_qty,
          sku } = tableListObject[wSku][0];
        return (<IndexTable.Row
          id={id}
          key={index}
          // selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <TextStyle variation="strong">{wSku}</TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <ProductInfoPopover
              popoverNode={productInfo(goods)}
            >
              <div>{goods && goods.cn_name}</div>
              <div>{goods && goods.en_name}</div>
            </ProductInfoPopover>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {plan_qty}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div style={{ minWidth: "8em" }}>
              {
                actual_qty === plan_qty
                  ?
                  <div>{actual_qty}</div>
                  :
                  <TextField
                    type="number"
                    value={inbound_qty !== undefined ? inbound_qty.toString() : actual_qty.toString()}
                    min={actual_qty}
                    max={plan_qty}
                    onChange={(v) => { goodsFormChangeHandler(wSku, v, "inbound_qty") }}
                  />
              }
            </div>

          </IndexTable.Cell>
          <IndexTable.Cell>
            <Button
              plain
              url={`/sourcing/detail/${btoa(encodeURIComponent(po_no))}`}
            >
              {po_no}
            </Button>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Button
              plain
              url={`/delivery/detail/${btoa(encodeURIComponent(shipping_no))}`}
            >
              {shipping_no}
            </Button>

          </IndexTable.Cell>

        </IndexTable.Row>

        )
      })
  },
    [goodsFormChangeHandler, tableListObject]
  );

  return (
    <Modal
      large={true}
      open={modalOpen}
      onClose={() => { modalOpenChange(false) }}
      title="确认入库 - 产品明细"
      primaryAction={{
        content: '确认',
        onAction: () => {
          onCommit(tableListObject)
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
        itemCount={tableListObject ? Object.keys(tableListObject).length : 0}
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
