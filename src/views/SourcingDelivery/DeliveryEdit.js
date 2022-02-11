/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-02-11 15:34:04
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, DatePicker, Form, FormLayout, Icon, IndexTable, Layout, Modal, Page, Popover, Select, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import {
  SearchMinor
} from '@shopify/polaris-icons';
import { useCallback, useEffect, useMemo, useState } from "react";
import { getPoItemList } from "../../api/requests";
import { FstlnSelectTree } from "../../components/FstlnSelectTree/FstlnSelectTree";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingRemarkCard } from "../../components/SecondaryCard/SourcingNoteCard";
import { SourcingProviCard } from "../../components/SecondaryCard/SourcingProviCard";
import { SourcingRepoCard } from "../../components/SecondaryCard/SourcingRepoCard";
import {
  CalendarMajor
} from '@shopify/polaris-icons';
import "./style/deliveryEdit.scss"



function DeliveryEdit(props) {

  // = modal =
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);
  // = modal =

  // =======
  const [tree, setTree] = useState({});
  const [selectGoodsMapTemp, setSelectGoodsMapTemp] = useState(new Map());

  const [goodsTableDataMap, setGoodsTableDataMap] = useState(new Map());

  const selectedGoods = useMemo(() => {
    const arr = [];
    for (const [key, goods] of goodsTableDataMap) {
      arr.push(goods);
    }
    return arr;
  }, [goodsTableDataMap]);


  const resourceName = {
    singular: '商品',
    plural: '商品',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(selectedGoods, { resourceIDResolver: (goods) => goods.sku });

  const promotedBulkActions = [
    {
      content: '移除',
      onAction: () => {
        console.log(selectedResources)

        const tempMap = new Map(goodsTableDataMap);

        selectedResources.map((sku) => {
          tempMap.delete(sku);
          handleSelectionChange("single", false, sku);
        })
        setGoodsTableDataMap(tempMap);
      },
    },
  ];

  const goodsFormChangeHandler = useCallback(
    (sku, val, key) => {
      const _tempGoodItem = goodsTableDataMap.get(sku);
      _tempGoodItem[key] = val
      const tempMap = new Map(goodsTableDataMap);
      tempMap.set(sku, _tempGoodItem);
      setGoodsTableDataMap(tempMap);

    },
    [goodsTableDataMap],
  );

  const rowMarkup = useMemo(() =>
    selectedGoods.map(({ sku, purchase_num, goods_name, headKey, count = 0 }, index) => (
      <IndexTable.Row
        id={sku}
        key={sku}
        selected={selectedResources.includes(sku)}
        position={index}
      >
        <IndexTable.Cell>
          {headKey}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <ProductInfoPopover tableCellText={sku} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ width: "8em" }}>
            <TextField
              type="number"
              value={count}
              prefix=""
              onChange={(v) => { goodsFormChangeHandler(sku, v, "count") }}
            />
          </div>
        </IndexTable.Cell>
      </IndexTable.Row>
    ))
    ,
    [goodsFormChangeHandler, selectedGoods, selectedResources]
  )
  // ======



  const treeHeadRender = (rowItem, itemDetail, children) => {
    const { po_no, warehouse_name, brand_name, purchase_qty } = itemDetail
    return (
      <div className="tree-row">
        <div>{po_no}</div>
        <div>{brand_name}</div>
        <div>{warehouse_name}</div>
        <div>{purchase_qty}</div>
      </div>
    )
  }

  const treeRowRender = (child) => {
    const { sku, purchase_num, goods_name } = child
    return (
      <div className="tree-row">
        {/* <div style={{width: "20%"}}></div> */}
        <div>{sku}</div>
        <div>{goods_name}</div>
        <div>{purchase_num}</div>
      </div>
    )
  }

  const treeSelectChange = useCallback(
    (selectsMap) => {
      setSelectGoodsMapTemp(selectsMap);
    },
    [],
  );

  const handleConfirmAddGoods = useCallback(
    () => {
      // console.log(selectGoodsMapTemp);
      setGoodsTableDataMap(new Map([...goodsTableDataMap, ...selectGoodsMapTemp]))
      setActive(false);
    },
    [goodsTableDataMap, selectGoodsMapTemp],
  );

  useEffect(() => {
    getPoItemList({
      // provider_id: 6,
      // currency: "USD",
      // type: "",
      // search: "",
    })
      .then(res => {
        console.log(res);


      })
      .finally(() => {
        // const data = '[{"sku":"6902176905315","cn_name":"努比亚24W快速充电器（英规）","en_name":"Nubia UK Adapter","price":"4.0000"},{"sku":"6902176906558","cn_name":"NX659J 红魔5S 银色 亚欧 8G+128G","en_name":"Red Magic 5S 8+128 EU Silver","price":"508.2600"},{"sku":"6902176906565","cn_name":"NX659J 红魔5S 红蓝渐变 亚欧12G+256G","en_name":"RedMagic 5S 12+256 EU Red & Blue","price":"572.7300"},{"sku":"6902176906596","cn_name":"NX659J 红魔5S 银色 美洲 8G+128G","en_name":"RedMagic 5S 8+128 NA Silver","price":"508.2600"},{"sku":"6902176906954","cn_name":"NX659S 红魔5S 黑色 亚欧  8+128","en_name":"RedMagic 5S 8+128 EU Black","price":"508.2600"},{"sku":"6902176906602","cn_name":"NX659J 红魔5S 红蓝渐变 美洲 12G+256G","en_name":"RedMagic 5S 12+256 NA Red & Blue","price":"572.7300"},{"sku":"6902176906831","cn_name":"Nubia 手表绿色 1GB NA版","en_name":"Nubia watch 1G+8G Green NA","price":"174.5100"}]';

        // setTree({
        //   "其他": JSON.parse(data)
        // })
        const data = {
          "PO#ZTE2112086": {
            "po_no": "PO#ZTE2112086",
            "brand_name": "BlackShark",
            "warehouse_name": "荣晟波兰3仓",
            "purchase_qty": 0,
            "provider": {
              "id": 5,
              "business_name": "ZTE CORPORATION",
              "phone": "13818027409",
              "contacts": "易艳",
              "business_address": "6/F., A Wing,  ZTE Plaza, Keji Road South, Hi-Tech Industrial Park, Nanshan District, Shenzhen, P.R.China"
            },
            "warehouse": {
              "id": 1,
              "business_name": "荣晟波兰3仓",
              "phone": "+48 953 030 195",
              "contacts": "SR WHPL",
              "business_address": "Ul. Logistyczna 1, Swiecko  69100, Poland\r\nSR WHPL"
            },
            "item_list": [
              {
                "sku": "6921815618126",
                "purchase_num": 3,
                "goods_name": "红魔7 plus"
              }
            ]
          },
          "PO#ZTE2112087": {
            "po_no": "PO#ZTE2112087",
            "brand_name": "BlackShark",
            "warehouse_name": "荣晟波兰3仓",
            "purchase_qty": 0,
            "provider": {
              "id": 5,
              "business_name": "ZTE CORPORATION",
              "phone": "13818027409",
              "contacts": "易艳",
              "business_address": "6/F., A Wing,  ZTE Plaza, Keji Road South, Hi-Tech Industrial Park, Nanshan District, Shenzhen, P.R.China"
            },
            "warehouse": {
              "id": 1,
              "business_name": "荣晟波兰3仓",
              "phone": "+48 953 030 195",
              "contacts": "SR WHPL",
              "business_address": "Ul. Logistyczna 1, Swiecko  69100, Poland\r\nSR WHPL"
            },
            "item_list": [
              {
                "sku": "6921815618126",
                "purchase_num": 2,
                "goods_name": "红魔7 plus"
              }
            ]
          },
          "PO#ZTE2112081": {
            "po_no": "PO#ZTE2112081",
            "brand_name": "ZTE",
            "warehouse_name": "荣晟波兰3仓",
            "purchase_qty": 0,
            "provider": {
              "id": 5,
              "business_name": "ZTE CORPORATION",
              "phone": "13818027409",
              "contacts": "易艳",
              "business_address": "6/F., A Wing,  ZTE Plaza, Keji Road South, Hi-Tech Industrial Park, Nanshan District, Shenzhen, P.R.China"
            },
            "warehouse": {
              "id": 1,
              "business_name": "荣晟波兰3仓",
              "phone": "+48 953 030 195",
              "contacts": "SR WHPL",
              "business_address": "Ul. Logistyczna 1, Swiecko  69100, Poland\r\nSR WHPL"
            },
            "item_list": [
              {
                "sku": "6974786420014",
                "purchase_num": 6,
                "goods_name": "Heyup迷你三脚架"
              }
            ]
          },
          "PO#ZTE2112082": {
            "po_no": "PO#ZTE2112082",
            "brand_name": "RedMagic",
            "warehouse_name": "荣晟波兰3仓",
            "purchase_qty": 0,
            "provider": {
              "id": 5,
              "business_name": "ZTE CORPORATION",
              "phone": "13818027409",
              "contacts": "易艳",
              "business_address": "6/F., A Wing,  ZTE Plaza, Keji Road South, Hi-Tech Industrial Park, Nanshan District, Shenzhen, P.R.China"
            },
            "warehouse": {
              "id": 1,
              "business_name": "荣晟波兰3仓",
              "phone": "+48 953 030 195",
              "contacts": "SR WHPL",
              "business_address": "Ul. Logistyczna 1, Swiecko  69100, Poland\r\nSR WHPL"
            },
            "item_list": [
              {
                "sku": "Test210507001",
                "purchase_num": 188,
                "goods_name": "红魔 Test210507001"
              }
            ]
          },
          "PO#ZTE2111261": {
            "po_no": "PO#ZTE2111261",
            "brand_name": "ZTE",
            "warehouse_name": "荣晟波兰3仓",
            "purchase_qty": 0,
            "provider": {
              "id": 5,
              "business_name": "ZTE CORPORATION",
              "phone": "13818027409",
              "contacts": "易艳",
              "business_address": "6/F., A Wing,  ZTE Plaza, Keji Road South, Hi-Tech Industrial Park, Nanshan District, Shenzhen, P.R.China"
            },
            "warehouse": {
              "id": 1,
              "business_name": "荣晟波兰3仓",
              "phone": "+48 953 030 195",
              "contacts": "SR WHPL",
              "business_address": "Ul. Logistyczna 1, Swiecko  69100, Poland\r\nSR WHPL"
            },
            "item_list": [
              {
                "sku": "6902176053009",
                "purchase_num": 6,
                "goods_name": "ZTE 手表 黑"
              },
              {
                "sku": "6902176063299",
                "purchase_num": 100,
                "goods_name": "Axon 30 5G  8GB Aqua -欧洲整机"
              }
            ]
          },
          "PO#XIAOMI H.K. LIMITED2110201": {
            "po_no": "PO#XIAOMI H.K. LIMITED2110201",
            "brand_name": "Xiaomi",
            "warehouse_name": "荣晟香港2仓",
            "purchase_qty": 0,
            "provider": {
              "id": 18,
              "business_name": "小米科技责任有限公司",
              "phone": "15873187593",
              "contacts": "老王",
              "business_address": "Suite 3209, 32/F, Tower 5, The Gateway, Harbour City, 15 Canton Road, Tsim Sha Tsui, Kowloon, Hong Kong"
            },
            "warehouse": {
              "id": 2,
              "business_name": "荣晟香港2仓",
              "phone": "(852) 2400 1637",
              "contacts": "Esther Leung",
              "business_address": "Shing Fat Transportation Ltd <br /> 23/F GOODMAN DYNAMIC CTR <br /> 188 YEUNG UK ROAD，TSUEN WAN，HONG KONG <br /> Esther Leung Tel:(852)24001637 <br /> 盛發運輸有限公司 <br /> 新界荃灣楊屋道188號嘉民達力中心23樓A室。<br /> *請到3 / 4 / 5樓，乘搭貨用升降機才可以到達23樓貨倉*"
            },
            "item_list": [
              {
                "sku": "XMSP19049TP",
                "purchase_num": 88,
                "goods_name": "小米9T钢化保护膜"
              }
            ]
          },
          "PO#NOTHING HK2110131": {
            "po_no": "PO#NOTHING HK2110131",
            "brand_name": "Nothing",
            "warehouse_name": "荣晟香港2仓",
            "purchase_qty": 0,
            "provider": {
              "id": 13,
              "business_name": "Nothing Technology HK Limited",
              "phone": "18728496519",
              "contacts": "张佳其",
              "business_address": "SUITE 3101, EVERBRIGHT CTR, 108 GLOUCESTER RD, WANCHAI, HONG KONG"
            },
            "warehouse": {
              "id": 2,
              "business_name": "荣晟香港2仓",
              "phone": "(852) 2400 1637",
              "contacts": "Esther Leung",
              "business_address": "Shing Fat Transportation Ltd <br /> 23/F GOODMAN DYNAMIC CTR <br /> 188 YEUNG UK ROAD，TSUEN WAN，HONG KONG <br /> Esther Leung Tel:(852)24001637 <br /> 盛發運輸有限公司 <br /> 新界荃灣楊屋道188號嘉民達力中心23樓A室。<br /> *請到3 / 4 / 5樓，乘搭貨用升降機才可以到達23樓貨倉*"
            },
            "item_list": [
              {
                "sku": "6974434220089-CTN",
                "purchase_num": 8500,
                "goods_name": "Nothing真无线蓝牙耳机日韩版本 卡板"
              }
            ]
          },
          "PO#NUBIA2109162": {
            "po_no": "PO#NUBIA2109162",
            "brand_name": "RedMagic",
            "warehouse_name": "荣晟香港2仓",
            "purchase_qty": 0,
            "provider": {
              "id": 6,
              "business_name": "Nubia Technology Co., Ltd.",
              "phone": "15710800732",
              "contacts": "陈锐锋",
              "business_address": "16/F, Building 2, Chongwen Park, Nanshan Zhiyuan, 3370 Liuxian Road, Nanshan District, Shenzhen 518055, China."
            },
            "warehouse": {
              "id": 2,
              "business_name": "荣晟香港2仓",
              "phone": "(852) 2400 1637",
              "contacts": "Esther Leung",
              "business_address": "Shing Fat Transportation Ltd <br /> 23/F GOODMAN DYNAMIC CTR <br /> 188 YEUNG UK ROAD，TSUEN WAN，HONG KONG <br /> Esther Leung Tel:(852)24001637 <br /> 盛發運輸有限公司 <br /> 新界荃灣楊屋道188號嘉民達力中心23樓A室。<br /> *請到3 / 4 / 5樓，乘搭貨用升降機才可以到達23樓貨倉*"
            },
            "item_list": [
              {
                "sku": "6902176902864",
                "purchase_num": 100,
                "goods_name": "红魔游戏背包"
              }
            ]
          }
        };
        setTree(data);
      })
  }, []);


  const [formObject, setFormObject] = useState({
    shipping_date: new Date(),
    shipping_no: "",
    expected_days: 6,
    tracking_no: "",
    tracking_service: "",
    shipping_price: "",
    shipping_currency: "USD",
    // currency: "USD",
    binning_no: "",
    remark: ""
  });

  const handleFormObjectChange = useCallback(
    (val, id) => {
      setFormObject({...formObject, [id]: val})
    },
    [formObject],
  );

  const activator = useMemo(() => {
    const { shipping_date } = formObject;
    const str = `${shipping_date.getFullYear()}-${shipping_date.getMonth() + 1}-${shipping_date.getDate()}`
    return (
    <TextField
      label="发货日期"
      prefix={
        <Icon
          source={CalendarMajor}
          color="subdued" />
      }
      value={ str }
      onFocus={() => { setDatePopoverActive(true) }}
    />)
  },
    [formObject])

  const [{ month, year }, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    [],
  );

  const [datePopoverActive, setDatePopoverActive] = useState(false);
  const datePop = useMemo(() => {
    return (
      <Popover
        active={datePopoverActive}
        activator={activator}
        onClose={() => { setDatePopoverActive(false) }}
        ariaHaspopup={false}
        sectioned
      >
        <DatePicker
          month={month}
          year={year}
          id="shipping_date"
          onChange={ ({start})=>{ handleFormObjectChange( start, "shipping_date" ) } }
          onMonthChange={handleMonthChange}
          selected={formObject.shipping_date}
        />
      </Popover>
    )
  },
    [activator, datePopoverActive, formObject.shipping_date, handleFormObjectChange, handleMonthChange, month, year])


  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/delivery' }]}
      title="xxxxf发货单"
      subtitle="2021-12-25 10:05:00 由xxxxxxxxx创建"
    >
      <Layout>
        <Layout.Section>

          <Card title="商品明细">

            <IndexTable
              resourceName={resourceName}
              itemCount={selectedGoods.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              promotedBulkActions={promotedBulkActions}
              emptyState={`商品为空`}
              headings={[
                { title: '采购单号' },
                { title: '系统SKU' },
                { title: '本次发货数量' },
              ]}
            >
              {rowMarkup}
            </IndexTable>
            <div style={{ textAlign: "center" }}>
              <Button onClick={() => { setActive(true) }}>添加商品</Button>
            </div>
            <br />
          </Card>


          <Card title="采购单信息" sectioned>
            <Form>
              <FormLayout>
                <FormLayout.Group>
                  {datePop}
                  <TextField
                    label="发货单单号"
                    value={ formObject.shipping_no }
                    name="shipping_no"
                    id="shipping_no"
                    onChange={ handleFormObjectChange }
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField
                    label="预计到货天数"
                    value={ formObject.expected_days }
                    name="expected_days"
                    id="expected_days"
                    onChange={ handleFormObjectChange }
                  />
                  <TextField
                    label="物流单号（选填）"
                    value={ formObject.tracking_no }
                    name="tracking_no"
                    id="tracking_no"
                    onChange={ handleFormObjectChange }
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField
                    label="物流服务商（选填）"
                    value={ formObject.tracking_service }
                    name="tracking_service"
                    id="tracking_service"
                    onChange={ handleFormObjectChange }
                  />
                  <TextField
                    label="运费（选填）"
                    value={ formObject.shipping_price }
                    name="shipping_price"
                    id="shipping_price"
                    onChange={ handleFormObjectChange }
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="运费币制（运费选了必填）"
                    value={ formObject.shipping_currency }
                    name="shipping_currency"
                    id="shipping_currency"
                    onChange={ handleFormObjectChange }
                    options={[
                      {label: "USD",value: "USD"},
                      {label: "RMB",value: "RMB"},
                    ]}
                  />
                  <TextField
                    label="入仓号"
                    value={ formObject.binning_no }
                    name="binning_no"
                    id="binning_no"
                    onChange={ handleFormObjectChange }
                  />
                </FormLayout.Group>

              </FormLayout>
            </Form>


          </Card>

        </Layout.Section>
        <Layout.Section secondary>

          <SourcingProviCard />
          <SourcingRepoCard />
          <SourcingRemarkCard  />

        </Layout.Section>
      </Layout>


      <Modal
        large={false}
        open={active}
        onClose={handleChange}
        title="选择采购商品"
        primaryAction={{
          content: '添加',
          onAction: handleConfirmAddGoods,
        }}
        secondaryActions={[
          {
            content: '取消',
            onAction: handleChange,
          },
        ]}
      >
        <div>
          <div style={{ padding: "1em" }}>

            <TextField
              type="text"
              placeholder="搜索商品"
              onChange={() => { }}

              prefix={<Icon
                source={SearchMinor}
                color="subdued"
              />
              }
              connectedLeft={
                <Select
                  onChange={() => { }}

                  options={[
                    { label: "商品SKU ", value: "1" },
                    { label: "品牌", value: "2" },
                  ]}
                />
              }
            />
          </div>

          <FstlnSelectTree
            treeData={tree}
            treeHeadRender={treeHeadRender}
            treeRowRender={treeRowRender}
            onTreeSelectChange={treeSelectChange}
            childrenResolver={(item) => item.item_list}
          />

        </div>
      </Modal>

    </Page>
  );
}
export { DeliveryEdit }


