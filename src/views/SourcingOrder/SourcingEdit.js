/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-01-28 19:28:30
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
import "./sourcingOrder.scss";



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
          return ({ label: item.business_name, value: item.id.toString()})
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
    if( !provider_id ) return;
    const opt = providerDetailMap.get(provider_id);
    if ( opt ) {
      setAccountList( opt )
      // set initial account
      setSourcingOrderForm({...sourcingOrderForm, account_id: opt[0].value})

    } else {
      getProviderDetail(provider_id)
        .then(res => {
          const { data } = res;
          const options = data.map(account=>({id: account.bank_card_number, label: account.bank_card_number, value: account.bank_card_number}));
          const newMap = new Map(providerDetailMap);
          newMap.set( provider_id,  options)
          setproviderDetailMap( newMap )
          setAccountList( options )
           // set initial account
          setSourcingOrderForm({...sourcingOrderForm, account_id: options[0].value})
          
          
        })
    }
    
  }, [provider_id])

  useEffect(()=>{
    // set provMap account info
    const provInfo = provMap.get(provider_id);
    const _map = new Map(provMap);
    _map.set( provider_id, {...provInfo, account_id: sourcingOrderForm.account_id} )
    setProvMap(_map)
  },
  [sourcingOrderForm])


  // = modal =
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  // = modal =

  // =======

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
            <TextField
              type="number"
              value={orders}
              onChange={(v) => { goodsFormChangeHandler(index, v, "orders") }}
            />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextField
              type="number"
              value={amountSpent}
              prefix="$"
              onChange={(v) => { goodsFormChangeHandler(index, v, "amountSpent") }}
            />
          </IndexTable.Cell>
        </IndexTable.Row>
      ),
    )
  },
    [customers, goodsFormChangeHandler, selectedResources]
  );
  // ======


  const tree = {
    "zte": [
      {
        "sku": "6902176907197",
        "cn_name": "红魔6/6Pro钢化玻璃屏幕保护膜",
        "en_name": "RedMagic 6/6Pro tempered glass",
        "qty": 111
      },
      {
        "sku": "6902176903731",
        "cn_name": "红魔战神手柄",
        "en_name": "RedMagic 5G E-Sports Handle",
        "qty": 111
      }
    ],
    "relx": [
      {
        "sku": "69021769071971",
        "cn_name": "红魔6/6Pro钢化玻璃屏幕保护膜1",
        "en_name": "RedMagic 6/6Pro tempered glass1",
        "qty": 111
      },
      {
        "sku": "69021769037311",
        "cn_name": "红魔战神手柄1",
        "en_name": "RedMagic 5G E-Sports Handle1",
        "qty": 111
      }
    ]
  }

  const treeHeadRender = (rowItem) => {

    return (
      <div>{rowItem}</div>
    )
  }

  const treeRowRender = (rowItem) => {

    return (
      <div>{rowItem}</div>
    )
  }

  useEffect(() => {
    getGoodsQuery({
      provider: 6,
      currency: "USD",
      type: "2",
      search: "",
    })
    .then(res=>{
      console.log(res);


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
                    value={ provider_id }
                    id="provider_id"
                    onChange={(value)=>{setProvider_id(value)}}
                  />
                  <Select
                    label="收款账户"
                    options={ accountList }
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
          <Card title="商品明细"
          // actions={[
          //   {
          //     content: "添加商品",
          //     onAction: () => setActive(true),
          //   }
          // ]}
          >
            {/* <Card.Section>
              <TextField
                prefix={<Icon
                  source={SearchMinor}
                  color="subdued" />
                }
                connectedRight={<Button>浏览</Button>}
              />
            </Card.Section> */}

            <IndexTable
              resourceName={resourceName}
              itemCount={customers.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              promotedBulkActions={promotedBulkActions}
              headings={[
                { title: 'Name' },
                { title: 'Location' },
                { title: 'Order count' },
                { title: 'Amount spent' },
              ]}
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
          <SourcingProviCard provInfo={ provMap.get(provider_id) } />
          <SourcingRepoCard wareInfo={ wareMap.get(sourcingOrderForm.warehouse_code) } />



        </Layout.Section>
      </Layout>


      <Modal
        large={false}
        open={active}
        onClose={handleChange}
        title="选择采购商品"
        primaryAction={{
          content: '添加',
          onAction: handleChange,
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
            treeData={tree}
            headRender={treeHeadRender}
            itemRowRender={treeRowRender}
          />

        </div>
      </Modal>

    </Page>
  );
}
export { SourcingEdit }


