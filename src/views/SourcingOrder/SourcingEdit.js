/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-02-15 12:13:04
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, Form, FormLayout, Icon, IndexTable, Layout, Modal, Page, Select, TextField, TextStyle, useIndexResourceState } from "@shopify/polaris";
import {
  SearchMinor
} from '@shopify/polaris-icons';
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { editSourcingOrder, getBrandList, getGoodsQuery, getProviderDetail, getProviderList, getSubjectList, getWarehouseList } from "../../api/requests";
import { FstlnLoading } from "../../components/FstlnLoading";
import { FstlnSelectTree } from "../../components/FstlnSelectTree/FstlnSelectTree";
import { SourcingCardSection } from "../../components/SecondaryCard/SourcingCardSection";
import { SourcingRemarkCard } from "../../components/SecondaryCard/SourcingNoteCard";
import { SourcingProviCard } from "../../components/SecondaryCard/SourcingProviCard";
import { SourcingRepoCard } from "../../components/SecondaryCard/SourcingRepoCard";
import { LoadingContext } from "../../context/LoadingContext";
import { ModalContext } from "../../context/ModalContext";
import { ToastContext } from "../../context/ToastContext";
import { UnsavedChangeContext } from "../../context/UnsavedChangeContext";
import { BUSINESS_TYPE, DEPARTMENT_LIST, PLATFORM_LIST } from "../../utils/StaticData";
import "./style/sourcingEdit.scss";



function SourcingEdit(props) {

  const navigate = useNavigate();

  const [brandList, setBrandList] = useState([]);
  const [provList, setProvList] = useState([]);
  const [subjList, setSubjList] = useState([]);
  const [wareList, setWareList] = useState([]);


  const [provMap, setProvMap] = useState(new Map());
  const [wareMap, setWareMap] = useState(new Map());

  const [accountList, setAccountList] = useState([]);

  const [tree, setTree] = useState({});
  const [selectGoodsMapTemp, setSelectGoodsMapTemp] = useState(new Map());


  const loadingContext = useContext(LoadingContext);
  const unsavedChangeContext = useContext(UnsavedChangeContext);
  const modalContext = useContext(ModalContext);
  const toastContext = useContext(ToastContext);


  const [sourcingOrderForm, setSourcingOrderForm] = useState({
    remark: "",
    // provider_id: "",
    warehouse_code: "",
    account_id: "",
    brand_code: "",
    subject_code: "",
    division: "",
    business_type: "",
    platform: "",
    po_no: "",
    po_item: [],

  });

  const [currency, setCurrency] = useState("");

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

  const [goodsTableDataMap, setGoodsTableDataMap] = useState(new Map());

  const selectedGoods = useMemo(() => {
    const arr = [];
    for (const [key, goods] of goodsTableDataMap) {
      arr.push(goods);
    }
    return arr;
  }, [goodsTableDataMap]);

  const saveOrder = useCallback(
    () => {
      const selectedGoodsFormat = selectedGoods.map(goods=>({
        ...goods,
        purchase_currency : currency,
        purchase_price: goods.price,
      }))
      const data = {
        ...sourcingOrderForm,
        provider_id,
        po_item: selectedGoodsFormat
      }
      loadingContext.loading(true);
      editSourcingOrder(data)
      .then(res=>{
        const { code, message } = res;
        if( code === 200 ){
          toastContext.toast({
            active: true,
            message: "保存采购单成功！",
            onDismiss: ()=>{
              toastContext.toast({active: false});
              navigate(-1)
            }
          })
        }else{
          toastContext.toast({
            active: true,
            message,
            error: true
          })

        }
      })
      .finally(()=>{
        loadingContext.loading(false);
      })
    },
    [currency, selectedGoods, sourcingOrderForm],
  );
  

  useEffect(() => {
    loadingContext.loading(true)
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
          division: DEPARTMENT_LIST[0].value,
          business_type: BUSINESS_TYPE[0].value,
          platform: PLATFORM_LIST[0].value,

        })
        setProvider_id(provListArr[0].value)



      })
      .finally(() => {
        loadingContext.loading(false);
      })
  },
    [])

  useEffect(() => {
    unsavedChangeContext.remind({
      active: true,
      message: "未保存的修改",
      actions: {
        saveAction: {
          content: "保存",
          onAction: () => {
            saveOrder();
          },
        },
        discardAction: {
          content: "取消",
          onAction: () => {
            modalContext.modal({
              active: true,
              title: "取消",
              message: "确认放弃保存？",
              primaryAction: {
                content: "确认",
                destructive: true,
                onAction: () => {

                },
              },
              secondaryActions: [
                {
                  content: "取消",
                  onAction: () => {
                    modalContext.modal({ active: false });
                  },
                }
              ],

            })
          },
        }
      },
    })
  },
  [saveOrder])


  useEffect(() => {
    accountList.length > 0 && setSourcingOrderForm({ ...sourcingOrderForm, account_id: accountList[0].value });
  }, [accountList]);

  useEffect(() => {
    if (!provider_id) return;
    const opt = providerDetailMap.get(provider_id);
    if (opt) {
      setAccountList(opt)
      // set initial account
      // setSourcingOrderForm({ ...sourcingOrderForm, account_id: opt[0].value })

    } else {
      getProviderDetail(provider_id)
        .then(res => {
          const { data } = res;
          const options = data.map( ({ bank_card_number,currency, id }) => ({ id, label: bank_card_number, value: id, currency }));
          const newMap = new Map(providerDetailMap);
          newMap.set(provider_id, options)
          setproviderDetailMap(newMap)
          setAccountList(options)
          // set initial account
          // setSourcingOrderForm({ ...sourcingOrderForm, account_id: options[0].value })

        })
    }

  }, [provider_id])

  // set provMap account card info
  useEffect(() => {
    const provInfo = provMap.get(provider_id);
    const _map = new Map(provMap);
    _map.set(provider_id, { ...provInfo, account_id: sourcingOrderForm.account_id })
    setProvMap(_map)
  },
    [sourcingOrderForm])

  // update currencty
  useEffect(() => {
    const accountInfo = accountList.find((account)=>account.id === sourcingOrderForm.account_id)
    accountInfo && setCurrency(accountInfo.currency);
  }, [sourcingOrderForm.account_id]);



  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);


  const resourceName = {
    singular: '商品',
    plural: '商品',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(selectedGoods, { resourceIDResolver: (goods) => goods.sku });

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
    selectedGoods.map(({ id, cn_name, en_name, price, sku, purchase_num = 0 }, index) => (
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
          <TextField
            type="number"
            value={purchase_num}
            onChange={(v) => { goodsFormChangeHandler(id, v, "purchase_num") }}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="number"
            value={price}
            prefix="$"
            onChange={(v) => { goodsFormChangeHandler(id, v, "price") }}
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    ))
    ,
    [goodsFormChangeHandler, selectedGoods, selectedResources]
  )


  const [treeLoading, setTreeLoading] = useState(false);
  const [treeQueryForm, setTreeQueryForm] = useState({
    type: "1",
    query: ""
  });

  const treeQueryFormChangeHandler = useCallback(
    (val, id) => {
      setTreeQueryForm({ ...treeQueryForm, [id]: val })
    },
    [],
  );

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
    if (active === false) return;
    setTreeLoading(true);
    getGoodsQuery({
      // ...treeQueryForm,
      provider_id,
      currency: "USD",
    })
      .then(res => {
        const { data } = res;
        setTree(data);

      })
      .finally(() => {
        setTreeLoading(false)
      })
  },
    [active, treeQueryForm, provider_id]
  );

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
                    value={sourcingOrderForm.division}
                    id="division"
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
              { rowMarkup }
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
          <SourcingRemarkCard remark={sourcingOrderForm.remark} onChange={(val) => { formChangeHandler(val, "remark") }} />


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
              id="query"
              value={treeQueryForm.query}
              onChange={treeQueryFormChangeHandler}
              prefix={<Icon
                source={SearchMinor}
                color="subdued"
              />
              }
              connectedLeft={
                <div style={{ width: "8em" }}>
                  <Select
                    onChange={treeQueryFormChangeHandler}
                    id="type"
                    value={treeQueryForm.type}
                    options={[
                      { label: "商品SKU ", value: "1" },
                      { label: "品牌", value: "2" },
                    ]}
                  />
                </div>
              }
            />
          </div>

          {
            treeLoading
              ?
              <FstlnLoading />
              :
              <FstlnSelectTree
                treeData={ tree }
                treeHeadRender={treeHeadRender}
                treeRowRender={treeRowRender}
                onTreeSelectChange={treeSelectChange}
                identifier={ (item=>item.id) }
              />
          }


        </div>
      </Modal>

    </Page>
  );
}
export { SourcingEdit }


