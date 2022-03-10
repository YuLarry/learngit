/*
 * @Author: lijunwei
 * @Date: 2022-01-24 16:02:59
 * @LastEditTime: 2022-03-10 16:51:58
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
    tableList = [],
    tableListChange = () => { },
    onCommit = () => { }
  } = props;

  const resourceName = {
    singular: '商品',
    plural: '商品',
  };


  const goodsFormChangeHandler = useCallback(
    (idx, val, key) => {
      if (val && key === "inbound_qty" && !fstlnTool.INT_MORE_THAN_ZERO_REG.test(val)) return;
      const a = [...tableList];

      a[idx][key] = val
      tableListChange(a);
    },
    [tableList, tableListChange],
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
    return tableList.map(
      ({ id,
        plan_qty,
        po_item_id,
        po_no,
        shipping_no,
        goods,
        inbound_qty = "1",
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
          <IndexTable.Cell>
            <ProductInfoPopover
              popoverNode={productInfo(goods)}
            >
              <div>{goods.cn_name}</div>
              <div>{goods.en_name}</div>
            </ProductInfoPopover>
          </IndexTable.Cell>
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
          onCommit(tableList)
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
