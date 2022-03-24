/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-03-24 15:00:37
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Banner, Button, ButtonGroup, Card, DropZone, Form, FormLayout, Icon, IndexTable, Layout, List, Modal, Page, Select, TextField, TextStyle, useIndexResourceState } from "@shopify/polaris";
import {
  SearchMinor,
  DeleteMinor
} from '@shopify/polaris-icons';
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editSourcingOrder, getBrandList, getBusinessTypeList, getDepartmentList, getGoodsQuery, getPlatformList, getProviderDetail, getProviderList, getSourcingOrderDetail, getSubjectList, getWarehouseList } from "../../api/requests";
import { SourcingCardSection } from "../../components/SecondaryCard/SourcingCardSection";
import { SourcingProviCard } from "../../components/SecondaryCard/SourcingProviCard";
import { SourcingRepoCard } from "../../components/SecondaryCard/SourcingRepoCard";
import { BadgeAuditStatus } from "../../components/StatusBadges/BadgeAuditStatus";
import { BadgeDeliveryStatus } from "../../components/StatusBadges/BadgeDeliveryStatus";
import { BadgePaymentStatus } from "../../components/StatusBadges/BadgePaymentStatus";
import { LoadingContext } from "../../context/LoadingContext";
import { ModalContext } from "../../context/ModalContext";
import { ToastContext } from "../../context/ToastContext";
import { UnsavedChangeContext } from "../../context/UnsavedChangeContext";
import { CURRENCY_TYPE } from "../../utils/StaticData";
import { fstlnTool } from "../../utils/Tools";
import "./style/sourcingEdit.scss";
import readXlsxFile from 'read-excel-file'
import exampleXlsx from "../../asset/files/example.xlsx"



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
  const [tree, setTree] = useState([]);

  const treeMap = useMemo(() => {
    const _map = new Map();
    tree.forEach(goodsItem => {
      _map.set(goodsItem.id, { ...goodsItem });
    })
    return _map;
  }
    , [tree]);


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
    warehouse_code: "",
    brand_code: "",
    subject_code: "",
    division: "",
    business_type: "",
    platform: "",
    po_no: "",
    po_item: [],

  });

  const [accountInfo, setAccountInfo] = useState(null);



  // console.log(accountInfo)
  const accountHandler = useCallback(
    (id) => {
      if (accountList.length === 0) return;
      const accountInfo = accountList.find(item => item.id.toString() === id);
      setAccountInfo(accountInfo)
    }
    , [accountList]
  );

  useEffect(() => {
    setSourcingOrderForm({ ...sourcingOrderForm, warehouse_code: wareList.length > 0 && wareList[0].value })
  }, [wareList]);

  useEffect(() => {
    setSourcingOrderForm({ ...sourcingOrderForm, business_type: businessTypeList.length > 0 && businessTypeList[0].value })
  }, [businessTypeList]);


  const [provider_id, setProvider_id] = useState("");
  const selectProviderInfo = useMemo(() => {
    if (!provider_id) return null;
    return provMap.get(provider_id);
  }
    , [provMap, provider_id])


  const formChangeHandler = useCallback(
    (value, id) => {
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
      arr.push({ ...goods, symb: key });
    }
    return arr;
  }, [goodsTableDataMap]);

  const total_purchase_money = useMemo(() => {
    let money = 0;
    selectedGoods.map((item) => {
      const price = item.price ? Number(item.price) : Number(item.purchase_price);
      const count = Number(item.purchase_num) || 0;
      money += (count * price)
    })
    return money.toFixed(2);
  }
    , [selectedGoods])
  const total_purchase_num = useMemo(() => {
    let num = 0;
    selectedGoods.map((item) => {
      num += Number(item.purchase_num)
    })
    return num;
  }
    , [selectedGoods])

  const saveOrder = useCallback(
    () => {
      const selectedGoodsFormat = selectedGoods.map(goods => ({
        ...goods,
        purchase_currency: accountInfo.currency,
        purchase_price: goods.purchase_price || goods.price,
      }))
      const data = {
        ...sourcingOrderForm,
        provider_id,
        account_id: accountInfo.id,
        po_item: selectedGoodsFormat
      }
      console.log(data);
      loadingContext.loading(true);
      editSourcingOrder(data)
        .then(res => {
          const { code, message } = res;
          if (code === 200) {
            toastContext.toast({
              active: true,
              message: "保存采购单成功！",
              duration: 2000,
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
    [accountInfo, navigate, provider_id, selectedGoods, sourcingOrderForm],
  );

  const [optsLoaded, setOptsLoaded] = useState(false);
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
        // brandListArr.unshift({label: "", value: "", })
        setBrandList(brandListArr);

        const { data: subjData } = resSubj;
        const subjListArr = Object.keys(subjData).map((key) => ({ label: subjData[key], value: key }))
        // subjListArr.unshift({label: "", value: "", })
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
        const platArr = [{ label: "", value: "" }];
        for (const k in resPlat) {
          platArr.push({ label: resPlat[k], value: k })
        }
        setPlatformList(platArr)

        const { data: resBusin } = resBusinessType;
        const busiArr = [];
        for (const ke in resBusin) {
          busiArr.push({ label: resBusin[ke], value: ke })
        }
        setBusinessTypeList(busiArr)

        const { data: resDepa } = resDepartment;
        const depaArr = [];
        for (const key in resDepa) {
          depaArr.push({ label: resDepa[key], value: key })
        }
        setDepartmentList(depaArr)

        setSourcingOrderForm({
          ...sourcingOrderForm,
          brand_code: "",
          provider_id: "",
          warehouse_code: "",
          subject_code: "",
          division: "",
          business_type: "",
          platform: "",

        })

        setOptsLoaded(true);
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

  const searchAndChangeAccount = useCallback((accList) => {
    if (accountInfo) {
      const idx = accList.findIndex((item => item.id.toString() === accountInfo.id.toString()))
      if (idx === -1) {
        setAccountInfo("");
      }
    } else {
      setAccountInfo("");
    }
  }, [accountInfo]);

  useEffect(() => {
    if (!provider_id) return;
    const opt = providerDetailMap.get(provider_id);
    if (opt) {
      setAccountList(opt)
      searchAndChangeAccount(opt);
    } else {
      getProviderDetail(provider_id)
        .then(res => {
          const { data } = res;
          const options = data.map(({ bank_card_number, currency, id }) => ({ id, label: bank_card_number, value: id.toString(), currency }));
          const newMap = new Map(providerDetailMap);
          newMap.set(provider_id, options);

          setproviderDetailMap(newMap);
          setAccountList(options);
          searchAndChangeAccount(options);

        })
    }

  }, [providerDetailMap, provider_id])


  // get order detail
  useEffect(() => {
    if (!id) return;
    if (!optsLoaded) return
    loadingContext.loading(true);
    getSourcingOrderDetail(idDecode)
      .then(res => {
        const { data } = res;
        const {
          brand,
          warehouse,
          subject,
          provider,
          provider_account,
          item,
        } = data || {};
        setOrder({
          ...data,
        });
        setSourcingOrderForm({
          ...data,
          platform: data.platform || "",
          brand_code: brand.code,
          subject_code: subject.subject_code,
          warehouse_code: warehouse.code,
        });

        setAccountInfo({ ...provider_account });

        setProvider_id(provider && provider.id.toString())

        const arr = item.map((it) => {
          const { goods } = it;
          return [Symbol(goods.sku), it]
        })
        setGoodsTableDataMap(new Map(arr));
      })
      .finally(() => {
        loadingContext.loading(false);
      })
  }, [optsLoaded]);

  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);


  const resourceName = {
    singular: '商品',
    plural: '商品',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(selectedGoods, { resourceIDResolver: (goods) => goods.sku });

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
      if (val && key === "purchase_num" && !fstlnTool.INT_MORE_THAN_ZERO_REG.test(val)) return;
      if (val && key === "price" && !fstlnTool.FLOAT_MORE_THAN_ZERO_REG.test(val)) return;
      const _tempGoodItem = goodsTableDataMap.get(sku);
      _tempGoodItem[key] = val
      const tempMap = new Map(goodsTableDataMap);
      tempMap.set(sku, _tempGoodItem);
      setGoodsTableDataMap(tempMap);

    },
    [goodsTableDataMap],
  );

  const handleDeleteGoods = useCallback((syblKey) => {
    if (id) {
      goodsFormChangeHandler(syblKey, "0", "purchase_num");
    } else {
      const tempMap = new Map(goodsTableDataMap);
      tempMap.delete(syblKey);
      setGoodsTableDataMap(tempMap);
    }
  }
    , [goodsFormChangeHandler, goodsTableDataMap, id])

  const rowMarkup = useMemo(() => {
    // console.log(selectedGoods);
    return selectedGoods.map(({ item_id, id, cn_name, en_name, price, sku, purchase_num = "0", purchase_price, symb }, index) => {
      // console.log( purchase_num );
      return (
        (item_id && purchase_num === "0")
          ?
          null
          :
          <IndexTable.Row
            id={item_id || id}
            key={index}
            selected={selectedResources.includes(symb)}
            position={index}
          >
            <IndexTable.Cell>
              {sku}
            </IndexTable.Cell>
            <IndexTable.Cell>
              <TextField
                type="number"
                value={purchase_num.toString()}
                onChange={(v) => { goodsFormChangeHandler(symb, v, "purchase_num") }}
              />
            </IndexTable.Cell>
            <IndexTable.Cell>
              <TextField
                type="number"
                value={price || purchase_price}
                prefix={accountInfo && CURRENCY_TYPE[accountInfo.currency]}
                onChange={(v) => { goodsFormChangeHandler(symb, v, "price") }}
              />
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Button
                icon={DeleteMinor}
                onClick={() => { handleDeleteGoods(symb) }}
              ></Button>
            </IndexTable.Cell>

          </IndexTable.Row>)
    })

  }
    , [accountInfo, goodsFormChangeHandler, handleDeleteGoods, selectedGoods, selectedResources]
  )


  const [treeLoading, setTreeLoading] = useState(false);
  const [treeQueryForm, setTreeQueryForm] = useState({
    type: "goods_sku",
    query: ""
  });


  /* modal tree indextable start */
  const { selectedResources: treeSelectedResources, allResourcesSelected: treeAllResourcesSelected, handleSelectionChange: treeHandleSelectionChange } = useIndexResourceState(tree, { resourceIDResolver: (goods) => goods.id });

  const treeMarkup = useMemo(() => {
    return tree.map((row, idx) => {
      const { id, sku, currency, price, store } = row;
      const { name } = store || {};
      return (
        <IndexTable.Row
          id={id}
          key={id}
          selected={treeSelectedResources.includes(id)}
          position={idx}
        >
          <IndexTable.Cell>
            {sku}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {name}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {price}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {currency}
          </IndexTable.Cell>
        </IndexTable.Row>
      )

    })

  }, [tree, treeSelectedResources]);

  /* modal tree indextable start */
  useEffect(() => {
    if (!active) return;
    setTreeQueryForm({
      type: "goods_sku",
      query: ""
    })
  }, [active])

  const treeQueryFormChangeHandler = useCallback(
    (val, id) => {
      setTreeQueryForm({ ...treeQueryForm, [id]: val })
    },
    [treeQueryForm],
  );


  const handleConfirmAddGoods = useCallback(
    () => {
      const arr = [];
      treeSelectedResources.forEach((goodsId) => {
        const goods = treeMap.get(goodsId);
        arr.push([Symbol(goods.sku), { ...goods }])
      })
      setGoodsTableDataMap(new Map([...goodsTableDataMap, ...arr]))
      treeHandleSelectionChange("page", false);
      setActive(false);
    },
    [goodsTableDataMap, treeHandleSelectionChange, treeMap, treeSelectedResources],
  );

  const queryGoodsRequest = useCallback(
    () => {
      if (treeLoading) return;
      const { type, query } = treeQueryForm;
      setTreeLoading(true);
      getGoodsQuery({
        goods_sku: "",
        brand_name: "",
        goods_name: "",
        provider_id,
        currency: accountInfo.currency,
        [type]: query,
      })
        .then(res => {
          const { data } = res;
          setTree(data.list);

        })
        .finally(() => {
          setTreeLoading(false)
        })
    },
    [accountInfo, provider_id, treeLoading, treeQueryForm],
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
    [treeQueryForm]
  );

  const badgesMarkup = useMemo(() => {
    if (!order) return null;
    const { audit_status, payment_status, delivery_status } = order;
    return (
      <div>
        <BadgeAuditStatus status={audit_status} />
        <BadgePaymentStatus status={payment_status} />
        <BadgeDeliveryStatus status={delivery_status} />
      </div>
    )
  }, [order])

  /* ---- import excel start ---*/
  const [activeImportModal, setActiveImportModal] = useState(false);
  const handleChangeImportModal = useCallback(() => {
    setActiveImportModal(!activeImportModal)
  }, [activeImportModal]);

  const [files, setFiles] = useState([]);
  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setFiles((files) => [...acceptedFiles]);
    }
    , []
  );

  const [excelResolveResult, setExcelResolveResult] = useState(null);

  useEffect(() => {
    if (files.length === 0) { setExcelResolveResult(null); return; };
    readXlsxFile(files[0]).then((rows) => {
      const rlt = fstlnTool.sortAndValidateExcel(
        rows,
        new Map([
          ["系统SKU", "sku"],
          ["供应商编码", "store_code"],
          ["价格", "price"],
          ["币制", "currency"],
        ]),
        {
          validations: {
            store_code: (val) => {
              return val === selectProviderInfo.provider_code;
            },
            currency: (val) => {
              return val === accountInfo.currency;
            },
          },
        }
      )
      setExcelResolveResult(rlt)
    })
  }, [accountInfo, files, selectProviderInfo]);

  const importModalSecondaryActions = useMemo(() => {
    const actions = [
      {
        content: '取消',
        onAction: () => { setFiles([]); handleChangeImportModal() },
      }];
    if (excelResolveResult && excelResolveResult.success) {
      actions.push({
        content: '重新选择Excel',
        onAction: () => { setFiles([]) },
      })
    }

    return actions
  }, [excelResolveResult, handleChangeImportModal]);

  const uploadTemplate = useMemo(() => {
    if (excelResolveResult && excelResolveResult.success) return null;
    return (
      <>
        <DropZone
          onDrop={handleDropZoneDrop}
          variableHeight
        >
          <DropZone.FileUpload actionHint="Accepts excel file" />
        </DropZone>
        <p style={{ marginTop: "1em" }}>
          <TextStyle variation="subdued"> 点击下载模板文件 <a href={exampleXlsx} download="example.xlsx">example.xlsx</a> </TextStyle>
        </p>
      </>
    )
  }, [excelResolveResult, handleDropZoneDrop]);

  const errorBanner = useMemo(() => {
    if (!excelResolveResult || excelResolveResult.success) return null;
    return (
      <Banner
        title={`供应商编码应为「${selectProviderInfo.store_code}」 币制应为「${accountInfo.currency}」请修改后重新导入`}
        status="warning"
      >
        <List>
          {
            excelResolveResult.errors.map((err, idx) => (
              <List.Item key={idx}>
                {`Excel数据 第${err.rowIndex + 1}条，${err.column}`}
              </List.Item>
            ))
          }
        </List>
      </Banner>
    )
  }
    , [accountInfo, excelResolveResult, selectProviderInfo]);


  const modalImportTable = useMemo(() => {
    if (!excelResolveResult || !excelResolveResult.success) { return null };
    const { data } = excelResolveResult;
    console.log(data);
    const rows = data.map((item, idx) => {
      const { sku, price, store_code, currency } = item;

      return (<IndexTable.Row
        id={idx}
        key={idx}
        position={idx}
        selectable={false}
      >
        <IndexTable.Cell>{sku}</IndexTable.Cell>
        <IndexTable.Cell>{store_code}</IndexTable.Cell>
        <IndexTable.Cell>{price}</IndexTable.Cell>
        <IndexTable.Cell>{currency}</IndexTable.Cell>
      </IndexTable.Row>
      )
    })
    return (
      <IndexTable
        resourceName={resourceName}
        itemCount={(excelResolveResult && excelResolveResult.success) ? excelResolveResult.data.length : 0}
        headings={[
          { title: '系统SKU' },
          { title: '供应商编码' },
          { title: '价格' },
          { title: '币制' },
        ]}
        selectable={false}
      >
        {rows}
      </IndexTable>
    )
  }
    , [excelResolveResult, resourceName]);

  const handleConfirmAddExcelGoods = useCallback(
    () => {
      if (!excelResolveResult || !excelResolveResult.success) return null;
      const arr = [];
      excelResolveResult.data.forEach((goods) => {
        arr.push([Symbol(goods.sku), { ...goods }])
      })
      setGoodsTableDataMap(new Map([...goodsTableDataMap, ...arr]))
      setFiles([]);
      setActiveImportModal(false);
    },
    [excelResolveResult, goodsTableDataMap],
  );

  /* ---- import excel end ---*/


  return (
    <Page
      breadcrumbs={[
        {
          onAction: () => {
            navigate(-1);
          }
        }
      ]}
      title={id ? `编辑采购单-${idURIDecode}` : "创建采购单"}
      subtitle={order && order.create_message || ""}
      titleMetadata={badgesMarkup}
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
                    placeholder=" "
                  />
                  <Select
                    label="采购方"
                    options={subjList}
                    value={sourcingOrderForm.subject_code}
                    id="subject_code"
                    onChange={formChangeHandler}
                    placeholder=" "
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="供应商"
                    options={provList}
                    value={provider_id.toString()}
                    id="provider_id"
                    onChange={(value) => {
                      setProvider_id(value);
                      setGoodsTableDataMap(new Map())
                    }}
                    placeholder=" "
                  />
                  <Select
                    label="收款账户"
                    options={accountList}
                    value={accountInfo && accountInfo.id.toString() || ""}
                    id="account_id"
                    onChange={accountHandler}
                    placeholder=" "
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="收货仓库"
                    options={wareList}
                    value={sourcingOrderForm.warehouse_code}
                    id="warehouse_code"
                    onChange={formChangeHandler}
                    placeholder=" "
                  />
                  <Select
                    label="事业部"
                    options={departmentList}
                    value={sourcingOrderForm.division}
                    id="division"
                    onChange={formChangeHandler}
                    placeholder=" "
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="业务类型"
                    options={businessTypeList}
                    value={sourcingOrderForm.business_type}
                    id="business_type"
                    onChange={formChangeHandler}
                    placeholder=" "
                  />
                  <Select
                    label="平台（选填）"
                    options={platformList}
                    value={sourcingOrderForm.platform}
                    id="platform"
                    onChange={formChangeHandler}
                  // placeholder=" "
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField
                    label="备注（选填）"
                    value={sourcingOrderForm.remark || ""}
                    onChange={(val) => { formChangeHandler(val, "remark") }}
                    multiline={3}
                    maxLength={100}
                  >
                  </TextField>
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
                { title: '采购单价' },
                { title: '' },
              ]}
              emptyState={<TextStyle variation="subdued">{`请先选择「供应商」与「采购单信息」然后才能添加商品`}</TextStyle>}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ButtonGroup
                spacing="loose"
              >
                <Button
                  onClick={() => { setActive(true) }}
                  disabled={!(provider_id && accountInfo)}
                >手动添加</Button>
                <Button
                  onClick={() => { setActiveImportModal(true) }}
                  disabled={!(provider_id && accountInfo)}
                >批量导入</Button>
              </ButtonGroup>

            </div>
            <br />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card title="采购信息">

            <SourcingCardSection title="金额" text={total_purchase_money || 0} />
            <SourcingCardSection title="币制" text={accountInfo && accountInfo.currency} />
            <SourcingCardSection title="采购数量" text={total_purchase_num || 0} />

          </Card>
          <SourcingProviCard provInfo={{ ...provMap.get(provider_id), account_id: accountInfo ? (accountInfo.label || accountInfo.bank_card_number) : "" }} />
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
          disabled: treeSelectedResources.length === 0
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

          <IndexTable
            resourceName={resourceName}
            itemCount={tree.length}
            selectedItemsCount={
              treeAllResourcesSelected ? 'All' : treeSelectedResources.length
            }
            onSelectionChange={treeHandleSelectionChange}
            headings={[
              { title: '商品SKU' },
              { title: '商城名称' },
              { title: '采购价' },
              { title: '币制' },
            ]}
            loading={treeLoading}
          >
            {treeMarkup}
          </IndexTable>

        </div>
      </Modal>

      <Modal
        large={false}
        open={activeImportModal}
        // open={true}
        onClose={() => { setFiles([]); handleChangeImportModal() }}
        title="导入采购商品"
        primaryAction={{
          content: "确认添加",
          onAction: handleConfirmAddExcelGoods,
          disabled: !excelResolveResult || !excelResolveResult.success || !excelResolveResult.data.length > 0,
        }}
        secondaryActions={ importModalSecondaryActions }
      >
        {
          (!excelResolveResult || !excelResolveResult.success)
            ?
            <Modal.Section>
              {errorBanner}
              {uploadTemplate}
            </Modal.Section>
            :
            null
        }
        {modalImportTable}
      </Modal>
    </Page>
  );
}
export { SourcingEdit }


