/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-03-04 15:36:14
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, Form, FormLayout, Icon, IndexTable, Layout, Modal, Page, Select, TextField, useIndexResourceState } from "@shopify/polaris";
import {
  SearchMinor,
  DeleteMinor
} from '@shopify/polaris-icons';
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editSourcingOrder, getBrandList, getBusinessTypeList, getDepartmentList, getGoodsQuery, getPlatformList, getProviderDetail, getProviderList, getSourcingOrderDetail, getSubjectList, getWarehouseList } from "../../api/requests";
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
import { fstlnTool } from "../../utils/Tools";
import "./style/sourcingEdit.scss";



function SourcingEdit(props) {
  const { id } = useParams();
  const idDecode = id && atob(id);
  const idURIDecode = idDecode && decodeURIComponent(idDecode);
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

  const [departmentList, setDepartmentList] = useState([]);
  const [businessTypeList, setBusinessTypeList] = useState([]);
  const [platformList, setPlatformList] = useState([]);


  const [order, setOrder] = useState(null);

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

  useEffect(()=>{
    if( accountList.length !== 0 && order ){
      const idx = accountList.findIndex( (item)=>(item.id.toString() === order.account_id) );
      if( idx === -1 ){
        setSourcingOrderForm({ ...sourcingOrderForm, account_id: accountList[0].id.toString() })
      }
    }else if( accountList.length !== 0 ){
      setSourcingOrderForm({ ...sourcingOrderForm, account_id: accountList[0].id.toString() })
    }
    
  }
  ,[accountList, order])

  useEffect(() => {
    setSourcingOrderForm({ ...sourcingOrderForm, warehouse_code: wareList.length > 0 && wareList[0].value })
  }, [wareList]);

  useEffect(() => {
    setSourcingOrderForm({ ...sourcingOrderForm, business_type: businessTypeList.length > 0 && businessTypeList[0].value })
  }, [businessTypeList]);

  const [currency, setCurrency] = useState("");

  const [provider_id, setProvider_id] = useState("");

  useEffect(() => {
    if( !id && !provider_id ){
      provList.length > 0 && setProvider_id( provList[0].value )
    }
  }, [id, provList, provider_id]);

  const accountBankNum = useMemo(() => {
    const detailItem = accountList.find(item => item.id.toString() === sourcingOrderForm.account_id && sourcingOrderForm.account_id.toString() || "")
    let numText = "";
    if (detailItem) {
      numText = detailItem.label
    }
    return numText;
  }
    , [accountList, sourcingOrderForm])

  const formChangeHandler = useCallback(
    (value, id) => {
      console.log(id, value);
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
      const selectedGoodsFormat = selectedGoods.map(goods => ({
        ...goods,
        purchase_currency: currency,
        purchase_price: goods.price,
      }))
      const data = {
        ...sourcingOrderForm,
        provider_id,
        po_item: selectedGoodsFormat
      }
      loadingContext.loading(true);
      editSourcingOrder(data)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            toastContext.toast({
              active: true,
              message: "保存采购单成功！",
              onDismiss: () => {
                toastContext.toast({ active: false });
                navigate(-1)
              }
            })
          } else {
            toastContext.toast({
              active: true,
              message,
              error: true
            })

          }
        })
        .finally(() => {
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

      getPlatformList(),
      getBusinessTypeList(),
      getDepartmentList(),

    ])
      .then(([resBrand, resProv, resSubj, resWare, resPlatform, resBusinessType, resDepartment]) => {
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

        const { data: resPlat } = resPlatform;
        const platArr = [{label: "", value: ""}];
        for (const k in resPlat) {
          platArr.push({ label: resPlat[k], value: k })
        }
        setPlatformList( platArr )

        const { data: resBusin } = resBusinessType;
        const busiArr = [];
        for (const ke in resBusin) {
          busiArr.push({ label: resBusin[ke], value: ke })
        }
        setBusinessTypeList( busiArr )

        const { data: resDepa } = resDepartment;
        const depaArr = [];
        for (const key in resDepa) {
          depaArr.push({ label: resDepa[key], value: key })
        }
        setDepartmentList( depaArr )

        // set initial form value
        setSourcingOrderForm({
          ...sourcingOrderForm,
          brand_code: brandListArr[0].value,
          // provider_id: provListArr[0].value,
          warehouse_code: wareListArr[0].value,
          subject_code: subjListArr[0].value,
          division: depaArr[0].value,
          business_type: busiArr[0].value,
          platform: platArr[0].value,

        })
        // setProvider_id(provListArr[0].value);

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
                  modalContext.modal({
                    active: false,
                  })
                  navigate(-1)
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
    });
    return () => {
      unsavedChangeContext.remind({
        active: false,
      })
    }
  },
    [saveOrder])

  useEffect(() => {
    if (!provider_id) return;
    const opt = providerDetailMap.get(provider_id);
    if (opt) {
      setAccountList(opt)     
    } else {
      getProviderDetail(provider_id)
        .then(res => {
          const { data } = res;
          const options = data.map(({ bank_card_number, currency, id }) => ({ id, label: bank_card_number, value: id.toString(), currency }));
          const newMap = new Map(providerDetailMap);
          newMap.set(provider_id, options);

          setproviderDetailMap(newMap);
          setAccountList(options);
          
        })
    }

  }, [providerDetailMap, provider_id])

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
    const accountInfo = accountList.find((account) => account.value === sourcingOrderForm.account_id)
    accountInfo && setCurrency(accountInfo.currency);
  }, [sourcingOrderForm]);

  useEffect(() => {
    if (!id) return;
    loadingContext.loading(true);
    getSourcingOrderDetail(idDecode)
      .then(res => {
        // console.log(res);
        const { data } = res;
        const provider_account = data && data.provider_account;
        const { 
          warehouse,


        } = data || {};
        setOrder( {
          ...data, 
          account_id: provider_account.id.toString(),

        } );
        setSourcingOrderForm( {
          ...data, 
          account_id: provider_account.id.toString(),
          brand_code: "",
          business_type: "",
          division: "",
          subject_code: "",
          warehouse_code: warehouse.id.toString(),
        } );
        setProvider_id( res.data && res.data.provider && res.data.provider.id.toString() )

        const _goodsMap = new Map();
        data.item.map((it)=>{
          const { goods } = it;
          _goodsMap.set( goods.id, {...it, id: goods.id} );
        })
        setGoodsTableDataMap( _goodsMap );

      })
      .finally(() => {
        loadingContext.loading(false);
      })

  }, []);

  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);


  const resourceName = {
    singular: '商品',
    plural: '商品',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(selectedGoods, { resourceIDResolver: (goods) => goods.sku });


  const handleDeleteGoods = useCallback((id) => {
    const tempMap = new Map(goodsTableDataMap);
    tempMap.delete(id);
    setGoodsTableDataMap(tempMap);
  }
    , [goodsTableDataMap])

  const promotedBulkActions = useMemo(() => (
    [
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
    ]
  ));

  const goodsFormChangeHandler = useCallback(
    (sku, val, key) => {
      if( val && key === "purchase_num" && !fstlnTool.INT_MORE_THAN_ZERO_REG.test(val) ) return;
      if( val && key === "price" && !fstlnTool.FLOAT_MORE_THAN_ZERO_REG.test(val) ) return;
      const _tempGoodItem = goodsTableDataMap.get(sku);
      _tempGoodItem[key] = val
      const tempMap = new Map(goodsTableDataMap);
      tempMap.set(sku, _tempGoodItem);
      setGoodsTableDataMap(tempMap);

    },
    [goodsTableDataMap],
  );


  const rowMarkup = useMemo(() =>
    selectedGoods.map(({ id, cn_name, en_name, price, sku, purchase_num = 0,purchase_price }, index) => (
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
            value={purchase_num.toString()}
            onChange={(v) => { goodsFormChangeHandler(id, v, "purchase_num") }}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="number"
            value={price || purchase_price}
            prefix="$"
            onChange={(v) => { goodsFormChangeHandler(id, v, "price") }}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Button
            icon={DeleteMinor}
            onClick={() => { handleDeleteGoods(id) }}
          ></Button>
        </IndexTable.Cell>

      </IndexTable.Row>
    ))
    ,
    [goodsFormChangeHandler, handleDeleteGoods, selectedGoods, selectedResources]
  )


  const [treeLoading, setTreeLoading] = useState(false);
  const [treeQueryForm, setTreeQueryForm] = useState({
    type: "goods_sku",
    query: ""
  });

  const treeQueryFormChangeHandler = useCallback(
    (val, id) => {
      setTreeQueryForm({ ...treeQueryForm, [id]: val })
    },
    [treeQueryForm],
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
      console.log(selectsMap);
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

  const queryGoodsRequest = useCallback(
    () => {
      const { type, query } = treeQueryForm;
      setTreeLoading(true);
      getGoodsQuery({
        goods_sku: "",
        brand_name: "",
        goods_name: "",
        provider_id,
        currency: "USD",
        [type]: query,
      })
        .then(res => {
          const { data } = res;
          setTree(data);

        })
        .finally(() => {
          setTreeLoading(false)
        })
    },
    [provider_id, treeQueryForm],
  );


  useEffect(() => {
    if (active === false) return;
    const timer = setTimeout(() => {
      queryGoodsRequest();
    }, 1000);
    return () => {
      clearTimeout(timer);
    }
  },
    [active, queryGoodsRequest]
  );



  return (
    <Page
      breadcrumbs={[
        {
          onAction: ()=>{
            navigate(-1);
          }
        }
      ]}
      title={id ? idURIDecode : "创建采购单"}
      subtitle={ order && order.create_message || "" }

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
                    disabled={ order }
                  />
                  <Select
                    label="采购方"
                    options={subjList}
                    value={sourcingOrderForm.subject_code}
                    id="subject_code"
                    onChange={formChangeHandler}
                    disabled={ order }
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="供应商"
                    options={provList}
                    value={provider_id.toString()}
                    id="provider_id"
                    onChange={(value) => { console.log(value);setProvider_id(value) }}
                    disabled={ order }
                  />
                  <Select
                    label="收款账户"
                    options={accountList}
                    value={sourcingOrderForm.account_id}
                    id="account_id"
                    onChange={formChangeHandler}
                    disabled={ order }
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="收货仓库"
                    options={wareList}
                    value={sourcingOrderForm.warehouse_code}
                    id="warehouse_code"
                    onChange={formChangeHandler}
                    disabled={ order }
                  />
                  <Select
                    label="事业部"
                    options={departmentList}
                    value={sourcingOrderForm.division}
                    id="division"
                    onChange={formChangeHandler}
                    disabled={ order }
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="业务类型"
                    options={businessTypeList}
                    value={sourcingOrderForm.business_type}
                    id="business_type"
                    onChange={formChangeHandler}
                    disabled={ order }
                  />
                  <Select
                    label="平台"
                    options={platformList}
                    value={sourcingOrderForm.platform}
                    id="platform"
                    onChange={formChangeHandler}
                    disabled={ order }
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
                { title: '' },
              ]}
              emptyState={`商品为空`}
              selectable={false}
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
          <SourcingProviCard provInfo={{ ...provMap.get(provider_id), account_id: accountBankNum }} />
          <SourcingRepoCard wareInfo={ wareMap.get(sourcingOrderForm.warehouse_code) } />
          <SourcingRemarkCard remark={sourcingOrderForm.remark || ""} onChange={(val) => { formChangeHandler(val, "remark") }} />


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
                <div style={{ width: "12em" }}>
                  <Select
                    onChange={treeQueryFormChangeHandler}
                    id="type"
                    value={treeQueryForm.type}
                    options={[
                      { label: "商品SKU ", value: "goods_sku" },
                      { label: "商品中英文名称", value: "goods_name" },
                      { label: "品牌", value: "brand_name" },
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
                treeData={tree}
                treeHeadRender={treeHeadRender}
                treeRowRender={treeRowRender}
                onTreeSelectChange={treeSelectChange}
                identifier={(item => item.id)}
              />
          }


        </div>
      </Modal>

    </Page>
  );
}
export { SourcingEdit }


