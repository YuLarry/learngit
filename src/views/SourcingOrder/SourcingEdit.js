/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-02-09 17:15:56
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, Form, FormLayout, Icon, IndexTable, Layout, Modal, Page, Select, TextField, TextStyle, useIndexResourceState } from "@shopify/polaris";
import {
  SearchMinor
} from '@shopify/polaris-icons';
import { useCallback, useEffect, useMemo, useState } from "react";
import { getBrandList, getGoodsQuery, getProviderDetail, getProviderList, getSubjectList, getWarehouseList } from "../../api/requests";
import { FstlnSelectTree } from "../../components/FstlnSelectTree/FstlnSelectTree";
import { SourcingCardSection } from "../../components/SecondaryCard/SourcingCardSection";
import { SourcingProviCard } from "../../components/SecondaryCard/SourcingProviCard";
import { SourcingRepoCard } from "../../components/SecondaryCard/SourcingRepoCard";
import { BUSINESS_TYPE, DEPARTMENT_LIST, PLATFORM_LIST } from "../../utils/StaticData";
import "./style/sourcingEdit.scss";



function SourcingEdit(props) {

  const [brandList, setBrandList] = useState([]);
  const [provList, setProvList] = useState([]);
  const [subjList, setSubjList] = useState([]);
  const [wareList, setWareList] = useState([]);

  // const [brandMap, setBrandMap] = useState(new Map());
  // const [subjMap, setSubjMap] = useState(new Map());
  const [provMap, setProvMap] = useState(new Map());
  const [wareMap, setWareMap] = useState(new Map());

  const [accountList, setAccountList] = useState([]);

  const [tree, setTree] = useState({});
  const [selectGoodsMapTemp, setSelectGoodsMapTemp] = useState(new Map());
  

  useEffect(() => {
    Promise.all([
      getBrandList(),
      getProviderList(),
      getSubjectList(),
      getWarehouseList(),

    ])
      .then(([resBrand, resProv, resSubj, resWare]) => {
        const { data } = resBrand;
        const brandListArr = Object.keys(data).map((key) => ({ label: data[key], value: key }))
        setBrandList(brandListArr);

        const { data: subjData } = resSubj;
        const subjListArr = Object.keys(subjData).map((key) => ({ label: subjData[key], value: key }))
        setSubjList(subjListArr);

        const { data: provData } = resProv;
        const provDataMap = new Map();
        const provListArr = provData.map((item) => {
          provDataMap.set(item.id.toString(), item);
          return ({ label: item.business_name, value: item.id.toString() })
        })
        setProvList(provListArr)
        setProvMap(provDataMap);



        const { data: wareData } = resWare;
        const wareDataMap = new Map();
        const wareListArr = wareData.map((item) => {
          wareDataMap.set(item.code, item);
          return ({ label: item.name, value: item.code })
        })
        setWareList(wareListArr)
        setWareMap(wareDataMap);


        // set initial form value
        setSourcingOrderForm({
          ...sourcingOrderForm,
          brand_code: brandListArr[0].value,
          // provider_id: provListArr[0].value,
          warehouse_code: wareListArr[0].value,
          subject_code: subjListArr[0].value,
          cause_team: DEPARTMENT_LIST[0].value,
          business_type: BUSINESS_TYPE[0].value,
          platform: PLATFORM_LIST[0].value,

        })
        setProvider_id(provListArr[0].value)

      })
  },
    [])


  const [sourcingOrderForm, setSourcingOrderForm] = useState({
    remark: "",
    // provider_id: "",
    warehouse_code: "",
    account_id: "",
    brand_code: "",
    subject_code: "",
    cause_team: "",
    business_type: "",
    platform: "",
    po_no: "",
    po_item: [],

  });

  const [provider_id, setProvider_id] = useState("");

  const formChangeHandler = useCallback(
    (value, id) => {
      // console.log(id, value);
      const newForm = { ...sourcingOrderForm, [id]: value };
      setSourcingOrderForm(newForm);
    },
    [sourcingOrderForm],
  );


  const [providerDetailMap, setproviderDetailMap] = useState(new Map());

  useEffect(() => {
    if (!provider_id) return;
    const opt = providerDetailMap.get(provider_id);
    if (opt) {
      setAccountList(opt)
      // set initial account
      setSourcingOrderForm({ ...sourcingOrderForm, account_id: opt[0].value })

    } else {
      getProviderDetail(provider_id)
        .then(res => {
          const { data } = res;
          const options = data.map(account => ({ id: account.bank_card_number, label: account.bank_card_number, value: account.bank_card_number }));
          const newMap = new Map(providerDetailMap);
          newMap.set(provider_id, options)
          setproviderDetailMap(newMap)
          setAccountList(options)
          // set initial account
          setSourcingOrderForm({ ...sourcingOrderForm, account_id: options[0].value })


        })
    }

  }, [provider_id])

  useEffect(() => {
    // set provMap account info
    const provInfo = provMap.get(provider_id);
    const _map = new Map(provMap);
    _map.set(provider_id, { ...provInfo, account_id: sourcingOrderForm.account_id })
    setProvMap(_map)
  },
    [sourcingOrderForm])


  // = modal =
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  // = modal =

  // =======

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

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(selectedGoods, { resourceIDResolver: ( goods )=> goods.sku });

  const promotedBulkActions = [
    {
      content: '移除',
      onAction: () => { 
        console.log(selectedResources)
        
        const tempMap = new Map(goodsTableDataMap);
        
        selectedResources.map((sku)=>{
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
    selectedGoods.map(({ cn_name, en_name, price, sku, orders = 0 }, index)=>(
      <IndexTable.Row
        id={sku}
        key={sku}
        selected={selectedResources.includes(sku)}
        position={index}
      >
        <IndexTable.Cell>
          {sku}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="number"
            value={ orders }
            onChange={(v) => { goodsFormChangeHandler(sku, v, "orders") }}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="number"
            value={price}
            prefix="$"
            onChange={(v) => { goodsFormChangeHandler(sku, v, "amountSpent") }}
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    ))
  ,
    [goodsFormChangeHandler, selectedGoods, selectedResources]
  )

  // ======



  const treeHeadRender = (rowItem, itemDetail, children) => {
    return (
      <div>{rowItem}</div>
    )
  }

  const treeRowRender = (child) => {
    const { sku, cn_name, en_name, price } = child
    
    return (
      <div className="sourcing-edit-row">
        <div>{sku}</div>
        <div>{en_name}</div>
        <div>{cn_name}</div>
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
    getGoodsQuery({
      provider_id: 6,
      currency: "USD",
      type: "",
      search: "",
    })
      .then(res => {
        console.log(res);


      })
      .finally(() => {
        const data = '[{"sku":"6902176905315","cn_name":"努比亚24W快速充电器（英规）","en_name":"Nubia UK Adapter","price":"4.0000"},{"sku":"6902176906558","cn_name":"NX659J 红魔5S 银色 亚欧 8G+128G","en_name":"Red Magic 5S 8+128 EU Silver","price":"508.2600"},{"sku":"6902176906565","cn_name":"NX659J 红魔5S 红蓝渐变 亚欧12G+256G","en_name":"RedMagic 5S 12+256 EU Red & Blue","price":"572.7300"},{"sku":"6902176906596","cn_name":"NX659J 红魔5S 银色 美洲 8G+128G","en_name":"RedMagic 5S 8+128 NA Silver","price":"508.2600"},{"sku":"6902176906954","cn_name":"NX659S 红魔5S 黑色 亚欧  8+128","en_name":"RedMagic 5S 8+128 EU Black","price":"508.2600"},{"sku":"6902176906602","cn_name":"NX659J 红魔5S 红蓝渐变 美洲 12G+256G","en_name":"RedMagic 5S 12+256 NA Red & Blue","price":"572.7300"},{"sku":"6902176906831","cn_name":"Nubia 手表绿色 1GB NA版","en_name":"Nubia watch 1G+8G Green NA","price":"174.5100"}]';

        setTree({
          "其他": JSON.parse(data)
        })

      })
  }, []);

  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/sourcing' }]}
      title="这是编辑"
      subtitle="2021-12-25 10:05:00 由xxxxxxxxx创建"
    >
      <Layout>
        <Layout.Section>
          <Card title="采购单信息" sectioned>
            <Form>
              <FormLayout>
                <FormLayout.Group>
                  <Select
                    label="项目"
                    options={brandList}
                    value={sourcingOrderForm.brand_code}
                    id="brand_code"
                    onChange={formChangeHandler}
                  />
                  <Select
                    label="采购方"
                    options={subjList}
                    value={sourcingOrderForm.subject_code}
                    id="subject_code"
                    onChange={formChangeHandler}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="供应商"
                    options={provList}
                    value={provider_id}
                    id="provider_id"
                    onChange={(value) => { setProvider_id(value) }}
                  />
                  <Select
                    label="收款账户"
                    options={accountList}
                    value={sourcingOrderForm.account_id}
                    id="account_id"
                    onChange={formChangeHandler}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="收货仓库"
                    options={wareList}
                    value={sourcingOrderForm.warehouse_code}
                    id="warehouse_code"
                    onChange={formChangeHandler}
                  />
                  <Select
                    label="事业部"
                    options={DEPARTMENT_LIST}
                    value={sourcingOrderForm.cause_team}
                    id="cause_team"
                    onChange={formChangeHandler}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="业务类型"
                    options={BUSINESS_TYPE}
                    value={sourcingOrderForm.business_type}
                    id="business_type"
                    onChange={formChangeHandler}
                  />
                  <Select
                    label="平台"
                    options={PLATFORM_LIST}
                    value={sourcingOrderForm.platform}
                    id="platform"
                    onChange={formChangeHandler}
                  />
                </FormLayout.Group>

              </FormLayout>
            </Form>


          </Card>
          <Card title="商品明细">
            <IndexTable
              resourceName={resourceName}
              itemCount={selectedGoods.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              promotedBulkActions={promotedBulkActions}
              headings={[
                { title: '系统SKU' },
                { title: '采购数量' },
                { title: '采购价格' },
              ]}
              emptyState={`商品为空`}
            >
              {rowMarkup}
            </IndexTable>
            <div style={{ textAlign: "center" }}>
              <Button onClick={() => { setActive(true) }}>添加商品</Button>
            </div>
            <br />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card title="采购信息">

            <SourcingCardSection title="金额" text="text 文字" />
            <SourcingCardSection title="币制" text="text 文字" />
            <SourcingCardSection title="采购数量" text="text 文字" />

          </Card>
          <SourcingProviCard provInfo={provMap.get(provider_id)} />
          <SourcingRepoCard wareInfo={wareMap.get(sourcingOrderForm.warehouse_code)} />



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
              onChange={formChangeHandler}

              prefix={<Icon
                source={SearchMinor}
                color="subdued"
              />
              }
              connectedLeft={
                <Select
                  onChange={formChangeHandler}

                  options={[
                    { label: "商品SKU ", value: "1" },
                    { label: "品牌", value: "2" },
                  ]}
                />
              }
            />
          </div>

          <FstlnSelectTree
            treeData={ tree }
            treeHeadRender={treeHeadRender}
            treeRowRender={treeRowRender}
            onTreeSelectChange={treeSelectChange}
          />

        </div>
      </Modal>

    </Page>
  );
}
export { SourcingEdit }


