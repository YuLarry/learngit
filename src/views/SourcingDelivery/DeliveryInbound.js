/*
 * @Author: lijunwei
 * @Date: 2022-01-21 15:28:14
 * @LastEditTime: 2022-02-10 16:27:01
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Autocomplete, Card, Form, FormLayout, IndexTable, Modal, Page, Select, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getClientAccount, getShippingDetail, getSkuOptionsList, getWarehouseArea } from "../../api/requests";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";

function DeliveryInbound(props) {

  const [detail, setDetail] = useState({});

  const [inboundModalOpen, setInboundModalOpen] = useState(true);
  const handleInboundModalOpenChange = useCallback(() => setInboundModalOpen(!inboundModalOpen), [inboundModalOpen]);

  const [skuDetailModalOpen, setSkuDetailModalOpen] = useState(false);
  const handleSkuDetailModalOpenChange = useCallback(() => setSkuDetailModalOpen(!skuDetailModalOpen), [skuDetailModalOpen]);

  const [clientList, setClientList] = useState(new Map());
  const [warehouseArea, setWarehouseArea] = useState(new Map());

  const [clientSelected, setClientSelected] = useState("");
  const [warehouseSelected, setWarehouseSelected] = useState("");

  const clientsOptions = useMemo(() => {
    const arr = [];
    for (const [value, label] of clientList) {
      arr.push({ label, value });
    }
    arr.length > 0 && setClientSelected(arr[0].value);
    return arr;
  },
    [clientList])

  const warehousesOptions = useMemo(() => {
    const arr = [];
    for (const [value, label] of warehouseArea) {
      arr.push({ label, value })
    }
    arr.length > 0 && setWarehouseSelected(arr[0].value)
    return arr;
  },
    [warehouseArea])


  const [plan_total_qty, setPlan_total_qty] = useState(0);


  // =====
  const [goodsMap, setGoodsMap] = useState(new Map());

  const goodsList = useMemo(() => {
    const arr = [];
    for (const [key, item] of goodsMap) {
      arr.push(item);
    }
    return arr;
  });

  const resourceName = {
    singular: '商品',
    plural: '商品',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(goodsList);

  const promotedBulkActions = [
    {
      content: '预报仓库',
      // onAction: () => setInboundModalOpen(true),
      onAction: () => {
        console.log(selectedResources)
        selectedResources.map((id)=>{
          const _tempMap = new Map(inboundGoodsMap)
          _tempMap.set( id, goodsMap.get(id) )
          setInboundGoodsMap(_tempMap)

          const _tempGmap = new Map(goodsMap);
          _tempGmap.delete(id);
          setGoodsMap(_tempGmap);
        })
      },
    },
  ];


  const productInfo = (product) => {
    return (
      <div className="product-container" style={{ maxWidth: "400px", display: "flex", alignItems: "flex-start" }}>

        <Thumbnail
          source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
          alt="Black choker necklace"
          size="small"
        />
        <div style={{ flex: 1, marginLeft: "1em" }}>
          <h4>ZTE Watch Live Black</h4>
          <h4>ZTE 手表 黑</h4>
          <span>$100</span>
        </div>
      </div>
    )
  }

  const rowMarkup = useMemo(() => {
    return goodsList.map(
      ({ id, sku, po_no, shipping_num, goods }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            {sku}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <ProductInfoPopover popoverNode={productInfo()} tableCellText={goods.cn_name} />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div style={{ width: "5em", textAlign: "right" }}>
              {shipping_num}
            </div>
          </IndexTable.Cell>

        </IndexTable.Row>
      ),
    )
  },
    [goodsList, selectedResources]
  );

  const [inboundGoodsMap, setInboundGoodsMap] = useState(new Map());
  const inboundGoodsList = useMemo(() => {
    const arr = [];
    for (const [key, item] of inboundGoodsMap) {
      arr.push(item);
    }
    return arr;
  },
    [inboundGoodsMap]);

  const inboundListMarkup = useMemo(() => {
    return inboundGoodsList.map(
      ({ id, sku, po_no, shipping_num, goods }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            {sku}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <ProductInfoPopover popoverNode={productInfo()} tableCellText={goods.cn_name} />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div style={{ width: "5em", textAlign: "right" }}>
              {shipping_num}
            </div>
          </IndexTable.Cell>

        </IndexTable.Row>
      ),
    )
  },
    [inboundGoodsList, selectedResources]
  );

  const skuList = useMemo(() => {
    return goodsList.map(
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
          <IndexTable.Cell>
            {/* <ProductInfoPopover popoverNode={productInfo()} tableCellText={"商品信息"} /> */}
            ZTE Watch Live Black<br />
            ZTE 手表 黑
          </IndexTable.Cell>
          <IndexTable.Cell>
            {orders}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {orders}
          </IndexTable.Cell>

        </IndexTable.Row>
      ),
    )
  },
    [goodsList, selectedResources]
  );

  // =====

  // modal ===

  const [active, setActive] = useState(true);

  const handleChange = useCallback(() => setActive(!active), [active]);

  // modal ===



  // autocomplete ===
  const [selectedSku, setSelectedSku] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [skuOptions, setSkuOptions] = useState([]);
  const [skuOptionsBackup, setSkuOptionsBackup] = useState([]);
  const [skuOptionsMap, setSkuOptionsMap] = useState(new Map());

  const updateSkuSelectText = useCallback(
    (value) => {
      setInputValue(value);
      const valTrim = value.trim();
      if (valTrim === '') {
        setSkuOptions(skuOptionsBackup);
        return;
      }

      const resultOptions = skuOptionsBackup.filter((option) =>
        option.label.indexOf(valTrim) > -1,
      );
      setSkuOptions(resultOptions);
    },
    [skuOptionsBackup],
  );


  const updateSelectedSku = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = skuOptions.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.value;
      });

      setSelectedSku(selected);
      setInputValue(selectedValue[0]);
    },
    [skuOptions],
  );
  const textField = (
    <Autocomplete.TextField
      onChange={updateSkuSelectText}
      label="货品SKU"
      value={inputValue}
      placeholder="请输入仓库SKU进行搜索"
    />
  );
  // autocomplete ===



  useEffect(() => {
    Promise.all([
      getClientAccount(),
      getWarehouseArea(),
      // getShippingDetail(1)
    ])

      .then(([clientRes, warehouseRes, detailRes]) => {
        const { data: clients } = clientRes;
        const clientsMap = new Map(Object.entries(clients));
        setClientList(clientsMap)

        const { data: warehouses } = warehouseRes;
        const warehousesMap = new Map(Object.entries(warehouses));
        setWarehouseArea(warehousesMap)


      })
      .finally(() => {
        const data = {
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
          "status": "待预报",
          "shipping_date": "2022-01-01",
          "expected_date": "2022-01-07",
          "item": [
            {
              "id": 81,
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
              "id": 82,
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
          },
          "operation_record": [
            {
              "content": "创建发货单。",
              "created_at": "2022-01-26 06:29:13"
            }
          ]
        }


        setDetail(data);

        // setGoodsList(data.item)

        const dataArrWidthKey = data.item.map((goods) => [goods.id, goods])
        setGoodsMap(new Map(dataArrWidthKey));


      })
  }, []);


  useEffect(() => {
    getSkuOptionsList()
      .then(() => {

      })
      .finally(() => {
        const data = [
          {
            "sku": "6902176906473",
            "warehouse_sku": "6902176906473",
            "client_account_code": "WSRM",
            "client_account_name": "WS Redmagic",
            "service_provider_code": "wingsing",
            "service_provider_name": "荣晟",
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
            "warehouse_sku": "6902176906596",
            "client_account_code": "WSRM",
            "client_account_name": "WS Redmagic",
            "service_provider_code": "wingsing",
            "service_provider_name": "荣晟",
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
            "warehouse_sku": "6902176906664",
            "client_account_code": "WSRM",
            "client_account_name": "WS Redmagic",
            "service_provider_code": "wingsing",
            "service_provider_name": "荣晟",
            "goods": {
              "sku": "6902176906664",
              "cn_name": "红魔5S 12+256 UK 红蓝渐变",
              "en_name": "RedMagic 5S 12+256 UK Red & Blue",
              "price": "549.00",
              "image_url": ""
            }
          }
        ];

        const optionsArr = [];
        const skuMap = new Map();
        data.map((skuItem) => {
          const { sku, goods: { cn_name, en_name }, service_provider_name, client_account_name } = skuItem
          optionsArr.push({ value: sku, label: `${sku} | ${cn_name} ${service_provider_name} | ${client_account_name}` })
          skuMap.set(sku, skuItem);
        })
        setSkuOptions(optionsArr);
        setSkuOptionsBackup(optionsArr);
        setSkuOptionsMap(skuMap);


      })
  }, []);



  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/delivery' }]}
      title="预报仓库-xxx"
      narrowWidth
    >
      <Card title="仓库信息" sectioned>
        <Form>
          <FormLayout>
            <FormLayout.Group>
              <Select
                label="货主"
                options={clientsOptions}
                value={clientSelected}
                onChange={(val) => { setClientSelected(val) }}
              />
              <Select
                label="货区"
                options={warehousesOptions}
                value={warehouseSelected}
                onChange={(val) => { setWarehouseSelected(val) }}
              />

            </FormLayout.Group>

          </FormLayout>
        </Form>


      </Card>

      <Card title="发货明细"

      >
        <IndexTable
          resourceName={resourceName}
          itemCount={goodsList.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          promotedBulkActions={promotedBulkActions}
          headings={[
            { title: '系统SKU' },
            { title: '商品信息' },
            { title: '本次发货数量' },
          ]}
        >
          {rowMarkup}
        </IndexTable>

        <br />
      </Card>

      <Card title="入库信息"

      >
        <IndexTable
          resourceName={resourceName}
          itemCount={goodsList.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          promotedBulkActions={promotedBulkActions}
          selectable={false}
          headings={[
            { title: '系统SKU' },
            { title: '商品信息' },
            { title: '预报数量' },
          ]}
        >
          {inboundListMarkup}
        </IndexTable>
        <br />
      </Card>


      <Modal
        // small
        open={inboundModalOpen}
        // open={false}
        onClose={handleInboundModalOpenChange}
        title="按xxxx入库"
        primaryAction={{
          content: '确认',
          onAction: () => { },
        }}
        secondaryActions={[
          {
            content: '取消',
            onAction: handleInboundModalOpenChange,
          },
        ]}
      >
        <Modal.Section>
          <Form>
            <FormLayout>
              <Autocomplete
                options={skuOptions}
                selected={selectedSku}
                onSelect={updateSelectedSku}
                textField={textField}
              />
              <TextField
                type="number"
                label="预报数量"
                value={plan_total_qty}
                onChange={(val) => setPlan_total_qty(val)}
              />
            </FormLayout>

          </Form>

        </Modal.Section>


      </Modal>


      <Modal
        open={skuDetailModalOpen}
        onClose={handleSkuDetailModalOpenChange}
        title="查看货品SKU"
      // primaryAction={{
      //   content: '确认',
      //   onAction: handleSkuDetailModalOpenChange,
      // }}
      // secondaryActions={[
      //   {
      //     content: '取消',
      //     onAction: handleSkuDetailModalOpenChange,
      //   },
      // ]}
      >
        <div>

          <IndexTable
            resourceName={resourceName}
            itemCount={goodsList.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            promotedBulkActions={promotedBulkActions}
            selectable={false}
            headings={[
              { title: '系统SKU' },
              { title: '商品信息' },
              { title: '本次发货数量' },
              { title: 'pcs/箱' },
            ]}
          >
            {skuList}
          </IndexTable>
        </div>



      </Modal>
    </Page>
  );
}
export { DeliveryInbound }

