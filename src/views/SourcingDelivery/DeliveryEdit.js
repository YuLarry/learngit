/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-03-29 19:38:58
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Banner, Button, Card, DatePicker, Form, FormLayout, Icon, IndexTable, Layout, List, Modal, Page, Popover, Select, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import {
  SearchMinor,
  DeleteMinor,
} from '@shopify/polaris-icons';
import { useCallback, useEffect, useMemo, useState } from "react";
import { editShippingOrder, getPoItemList, getShippingDetail } from "../../api/requests";
import { FstlnSelectTree } from "../../components/FstlnSelectTree/FstlnSelectTree";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingRemarkCard } from "../../components/SecondaryCard/SourcingNoteCard";
import { SourcingProviCard } from "../../components/SecondaryCard/SourcingProviCard";
import { SourcingRepoCard } from "../../components/SecondaryCard/SourcingRepoCard";
import {
  CalendarMajor
} from '@shopify/polaris-icons';
import "./style/deliveryEdit.scss"
import { useContext } from "react";
import { LoadingContext } from "../../context/LoadingContext";
import { UnsavedChangeContext } from "../../context/UnsavedChangeContext";
import { ModalContext } from "../../context/ModalContext";
import { ToastContext } from "../../context/ToastContext";
import moment from "moment";
import { FstlnLoading } from "../../components/FstlnLoading";
import { useNavigate, useParams } from "react-router-dom";
import { fstlnTool } from "../../utils/Tools";
import { BadgeAuditStatus } from "../../components/StatusBadges/BadgeAuditStatus";
import { BadgePaymentStatus } from "../../components/StatusBadges/BadgePaymentStatus";
import { BadgeDeliveryStatus } from "../../components/StatusBadges/BadgeDeliveryStatus";


function DeliveryEdit(props) {
  const { id } = useParams();
  const idDecode = id && atob(id);
  const idURIDecode = idDecode && decodeURIComponent(idDecode);

  const navigate = useNavigate();
  const loadingContext = useContext(LoadingContext);
  const unsavedChangeContext = useContext(UnsavedChangeContext);
  const modalContext = useContext(ModalContext);
  const toastContext = useContext(ToastContext);

  const [detail, setDetail] = useState(null);

  // = modal =
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);
  // = modal =

  const [tree, setTree] = useState(null);

  const [selectGoodsMapTemp, setSelectGoodsMapTemp] = useState(new Map());

  const [goodsTableDataMap, setGoodsTableDataMap] = useState(new Map());

  const selectedGoods = useMemo(() => {
    const arr = [];
    for (const [key, goods] of goodsTableDataMap) {
      arr.push({ ...goods, count: goods.count === undefined ? (goods.purchase_num - goods.shipping_num).toString() : goods.count, symb: key });
    }
    return arr;
  }, [goodsTableDataMap]);

  const resourceName = {
    singular: '??????',
    plural: '??????',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(selectedGoods, { resourceIDResolver: (goods) => goods.sku });

  const handleDeleteGoods = useCallback((id) => {
    const tempMap = new Map(goodsTableDataMap);
    tempMap.delete(id);
    setGoodsTableDataMap(tempMap);
  }
    , [goodsTableDataMap])

  const promotedBulkActions = useMemo(() => (
    [
      {
        content: '??????',
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
  )
    , [goodsTableDataMap, handleSelectionChange, selectedResources]);

  const goodsFormChangeHandler = useCallback(
    (symb, val, key) => {
      if (val !== "" && !fstlnTool.INT_MORE_THAN_ZERO_REG.test(val)) return;
      const _tempGoodItem = goodsTableDataMap.get(symb);
      _tempGoodItem[key] = val
      const tempMap = new Map(goodsTableDataMap);
      tempMap.set(symb, _tempGoodItem);
      setGoodsTableDataMap(tempMap);

    },
    [goodsTableDataMap],
  );

  const [formObject, setFormObject] = useState({
    shipping_date: new Date(),
    shipping_no: "",
    expected_days: "",
    tracking_no: "",
    tracking_service: "",
    shipping_price: "",
    shipping_currency: "",
    // currency: "USD",
    binning_no: "",
    remark: ""
  });

  const handleFormObjectChange = useCallback(
    (val, id) => {
      setFormObject({ ...formObject, [id]: val })
    },
    [formObject],
  );

  const [form_currency, setForm_currency] = useState("");

  const currenctyOpts = useMemo(() => {
    let arr = [
      { label: "CNY", value: "CNY" },
      { label: "CNH", value: "CNH" },
      { label: "USD", value: "USD" },
      { label: "HKD", value: "HKD" },
      { label: "EUR", value: "EUR" },
      { label: "GBP", value: "GBP" },
      { label: "JPY", value: "JPY" },
    ];
    if (!formObject.shipping_price) {
      arr = [
        { label: "", value: "" },
        ...arr
      ]
    }
    return arr;
  }
    , [formObject])

  useEffect(() => {
    if (!form_currency) {
      setForm_currency(currenctyOpts[0].value)
    }
  },
    [currenctyOpts]);

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

  const rowMarkup = useMemo(() =>
    selectedGoods.map(({ id, sku, count = "", shipping_num, goods, headKey, symb, po_no }, index) => {
      return (
        <IndexTable.Row
          id={id}
          key={index}
          position={index}
        >
          <IndexTable.Cell>
            {headKey || po_no}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <ProductInfoPopover
              popoverNode={productInfo(goods)}
            >{sku}</ProductInfoPopover>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div style={{ width: "8em" }}>
              {
                idURIDecode
                  ?
                  <div>{count}</div>
                  :
                  <TextField
                    type="number"
                    value={count}
                    prefix=""
                    onChange={(v) => { goodsFormChangeHandler(symb, v, "count") }}
                  />
              }

            </div>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {!idURIDecode &&
              <Button
                icon={DeleteMinor}
                onClick={() => { handleDeleteGoods(symb) }}
              ></Button>
            }
          </IndexTable.Cell>
        </IndexTable.Row>
      )
    })
    ,
    [goodsFormChangeHandler, handleDeleteGoods, selectedGoods]
  )

  const treeHeadRender = (rowItem, itemDetail, children) => {
    const { po_no, warehouse_name, purchase_qty, provider: { business_name }, item_list } = itemDetail
    let totalShiped = 0;
    item_list.forEach(val => {
      totalShiped += val.shipping_num;
    });
    if (totalShiped >= purchase_qty) return null;
    return (
      <div className="tree-row">
        <div>{po_no}</div>
        <div>{business_name}</div>
        <div>{warehouse_name}</div>
        <div>{purchase_qty}</div>
      </div>
    )
  }

  const treeRowRender = (child) => {
    const { sku, purchase_num, shipping_num, goods = {} } = child
    if (shipping_num >= purchase_num) return null;
    const { cn_name = "", en_name = "" } = goods;
    return (
      <div className="tree-row">
        {/* <div style={{width: "20%"}}></div> */}
        <div>{sku}</div>
        <div>{cn_name}</div>
        <div>{en_name}</div>
        <div>{purchase_num}</div>
      </div>
    )
  }

  const treeSelectChange = useCallback(
    (selectsMap) => {
      // console.log(selectsMap);
      setSelectGoodsMapTemp(selectsMap);
    },
    [],
  );

  const selectValidtor = useCallback((selectsMap) => {
    if (selectsMap.size === 0) {
      return true;
    } else if (selectsMap.size > 1) {
      const last = [...selectsMap.values()][selectsMap.size - 1];
      const second_last = [...selectsMap.values()][selectsMap.size - 2];
      if (second_last.provider.id !== last.provider.id || second_last.warehouse.id !== last.warehouse.id) {
        toastContext.toast({
          active: true,
          // message: `??????????????????????????????????????????${second_last.provider.business_name}??????????????????${second_last.warehouse.name}?????????`,
          message: `????????????????????????????????????/???????????????????????????????????????????????????/?????????????????????SKU???`,
          duration: 1000,
        })
        return false;
      }
    } else if (goodsTableDataMap.size > 0) {
      const last = selectsMap.values().next().value;
      const tableItem = goodsTableDataMap.values().next().value;
      if (tableItem.provider.id !== last.provider.id || tableItem.warehouse.id !== last.warehouse.id) {
        toastContext.toast({
          active: true,
          message: `??????????????????????????????????????????${tableItem.provider.business_name}??????????????????${tableItem.warehouse.name}?????????`,
          duration: 1000,
        })
        return false;
      }
    }
    return true;
  }
    , [goodsTableDataMap])

  const handleConfirmAddGoods = useCallback(
    () => {
      const arr = [];
      selectGoodsMapTemp.forEach((valueItem) => {
        arr.push([Symbol(valueItem.sku), { ...valueItem, count: (valueItem.purchase_num - valueItem.shipping_num).toString() }])
      })
      setGoodsTableDataMap(new Map([...goodsTableDataMap, ...arr]))
      setSelectGoodsMapTemp(new Map());
      setActive(false);
    },
    [goodsTableDataMap, selectGoodsMapTemp],
  );

  const selectedPoItemInfo = useMemo(() => {
    if (id) return null;
    if (goodsTableDataMap && goodsTableDataMap.size > 0) {
      const { headKey } = goodsTableDataMap.values().next().value;
      // console.log(tree[headKey])
      return tree[headKey];
    } else {
      return undefined
    }
  }, [goodsTableDataMap, tree])

  const provider = useMemo(() => (selectedPoItemInfo && selectedPoItemInfo.provider), [selectedPoItemInfo])
  const warehouse = useMemo(() => (selectedPoItemInfo && selectedPoItemInfo.warehouse), [selectedPoItemInfo])



  const [treeQueryForm, setTreeQueryForm] = useState({
    // searchKey: "provider_name",
    searchVal: ""
  });

  const treeQueryFormChangeHandler = useCallback(
    (val, id) => {
      setTreeQueryForm({ ...treeQueryForm, [id]: val })
    },
    [treeQueryForm],
  );

  useEffect(() => {
    if (!active) return;
    setTreeQueryForm({
      // searchKey: "provider_name",
      searchVal: ""
    })
  }, [active])

  // ???????????????tree data
  const treeFilted = useMemo(() => {
    if( !tree ) return {};
    const rlt = {};
    
    for (const key in tree) {
      if (Object.hasOwnProperty.call(tree, key)) {
        const { provider: { business_name }, warehouse_name, } = tree[key];
        const _v = treeQueryForm.searchVal.toUpperCase().trim();
        if( 
          key.toUpperCase().indexOf( _v ) !== -1 ||
          business_name.toUpperCase().indexOf( _v ) !== -1 ||
          warehouse_name.toUpperCase().indexOf( _v ) !== -1
        ){
          rlt[ key ] = tree[key];
        }
      }
    }
    return rlt;
    
  }
  ,[tree, treeQueryForm]);

  const [querying, setQuerying] = useState(false);

  const queryModalList = useCallback(
    () => {
      // const { searchKey, searchVal } = treeQueryForm;
      if (querying) return;
      setQuerying(true);
      getPoItemList({
        provider_name: "",
        warehouse_name: "",
        po_no: "",
        // [searchKey]: searchVal
      })
        .then(res => {
          const { data } = res;
          for (let key in data) {
            const { provider, warehouse, item_list, purchase_qty } = data[key];

            // remove shipped good item
            let totalShiped = 0;
            item_list.forEach(val => {
              totalShiped += val.shipping_num;
            });

            if (totalShiped >= purchase_qty){
              delete(data[key])
              // data[key] = null;
            }

            for (let i = item_list.length - 1; i >= 0; i --) {
              const item = item_list[i];
              item["provider"] = provider;
              item["warehouse"] = warehouse;
              if( item.shipping_num >= item.purchase_num ){
                item_list.splice( i, 1 )
              }
            }

            if (totalShiped >= purchase_qty){
              delete(data.key);
            }
          }
          setTree(data);

        })
        .finally(() => {
          setQuerying(false)
        })
    },
    [querying, treeQueryForm],
  );


  useEffect(() => {
    if (!active) return;
    // const timer = setTimeout(() => {
      queryModalList();
    // }, 1000);
    // return () => {
    //   clearTimeout(timer);
    // }
  }, [active]);


  /* ---- ???????????? ---- */
  const [needValidation, setNeedValidation] = useState(false);

  const errshipping_no = useMemo(() => ( !formObject.shipping_no ? "??????????????????" : null ), [formObject]);
  const errexpected_days = useMemo(() => ( !formObject.expected_days ? "??????????????????" : null ), [formObject]);
  const errbinning_no = useMemo(() => ( !formObject.binning_no ? "??????????????????" : null ), [formObject]);
  
  // ?????????????????????
  const formInvalid = useMemo(()=>{
    const _map = new Map();
    errshipping_no ? _map.set( "errshipping_no", false ) : _map.delete( "errshipping_no" );
    errexpected_days ? _map.set( "errexpected_days", false ) : _map.delete( "errexpected_days" );
    errbinning_no ? _map.set( "errbinning_no", false ) : _map.delete( "errbinning_no" );
    
    return _map;
  }
  ,[errbinning_no, errexpected_days, errshipping_no])

  const goodsValidation = useMemo(()=>{
    const _map = new Map();
    if( selectedGoods.length <= 0 ) {
      _map.set( "empty", "???????????? ????????????" );
    }
    selectedGoods.forEach((item)=>{
      const { count = 0 } = item;
      if( Number(count) <= 0 ){
        _map.set( "num", "????????? ??????????????????")
      }
    })
    return _map;
  },
  [selectedGoods])

  const invalidations = useMemo(() => {
    const errors = [];
    if( formInvalid.size > 0 ){
      errors.push( "???????????? ???????????????" )
    }
    if( goodsValidation.size > 0 ){
      errors.push( [...goodsValidation.values()].join("???") )
    }
    return errors;
  }
    , [formInvalid, goodsValidation])


  /* ---- ???????????? ---- */



  const saveDeliveryOrder = useCallback(() => {

    setNeedValidation(true);
    if( invalidations.length > 0 ) return;

    loadingContext.loading(true);
    const shipping_detail = [];
    goodsTableDataMap.forEach((item) => {
      const { headKey: po_no, sku, count: shipping_num, id: po_item_id } = item;
      shipping_detail.push({
        po_no,
        sku,
        po_item_id,
        shipping_num,
        shipping_currency: form_currency
      })
    })
    editShippingOrder({
      ...formObject,
      shipping_currency: form_currency,
      shipping_date: moment(formObject.shipping_date).format("YYYY-MM-DD"),
      shipping_detail,
      provider_id: provider.id,
      warehouse_code: warehouse.code,
    })
      .then(res => {
        toastContext.toast({
          active: true,
          message: "????????????",
          duration: 1000,
          onDismiss: () => {
            toastContext.toast({ active: false });
            navigate(-1)
          }
        })
      })
      .finally(() => {
        loadingContext.loading(false);
      })

  },
    [formObject, goodsTableDataMap, active])


  useEffect(() => {
    if (id) return;
    unsavedChangeContext.remind({
      active: true,
      message: "??????????????????",
      actions: {
        saveAction: {
          content: "??????",
          onAction: () => {
            saveDeliveryOrder()
          },
        },
        discardAction: {
          content: "??????",
          onAction: () => {
            modalContext.modal({
              active: true,
              title: "??????",
              message: "?????????????????????",
              primaryAction: {
                content: "??????",
                destructive: true,
                onAction: () => {
                  navigate(-1);
                  modalContext.modal({ active: false });
                },
              },
              secondaryActions: [
                {
                  content: "??????",
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
    [saveDeliveryOrder])

  const activator = useMemo(() => {
    const { shipping_date } = formObject;
    const str = `${shipping_date.getFullYear()}-${shipping_date.getMonth() + 1}-${shipping_date.getDate()}`
    return (
      <TextField
        label="????????????"
        prefix={
          <Icon
            source={CalendarMajor}
            color="subdued" />
        }
        value={str}
        onFocus={() => { setDatePopoverActive(true) }}
        disabled={id}
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
          onChange={({ start }) => { handleFormObjectChange(start, "shipping_date") }}
          onMonthChange={handleMonthChange}
          selected={formObject.shipping_date}
        />
      </Popover>
    )
  },
    [activator, datePopoverActive, formObject.shipping_date, handleFormObjectChange, handleMonthChange, month, year])

  useEffect(() => {
    if (!id) return;
    loadingContext.loading(true);
    getShippingDetail(idURIDecode)
      .then(res => {
        const { data } = res;
        // return;
        setFormObject({
          ...data,
          shipping_date: moment(data.shipping_date)._d,
        })

        const { item } = data;

        const arr = [];
        item.forEach((valueItem) => {
          arr.push([Symbol(valueItem.sku), { ...valueItem, count: valueItem.shipping_num.toString() }])
        })

        setGoodsTableDataMap(new Map(arr))

      })
      .finally(() => {
        loadingContext.loading(false);
      })
  }, []);


  const badgesMarkup = useMemo(() => {
    if (!detail) return null;
    const { audit_status, payment_status, delivery_status } = detail;
    return (
      <div>
        <BadgeAuditStatus status={audit_status} />
        <BadgePaymentStatus status={payment_status} />
        <BadgeDeliveryStatus status={delivery_status} />
      </div>
    )
  }, [detail])


  return (
    <Page
      breadcrumbs={[{
        content: '??????????????????',
        onAction: () => {
          navigate(-1);
        }
      }]}
      title={idURIDecode ? `???????????????-${idURIDecode}` : "???????????????"}
      titleMetadata={badgesMarkup}
      subtitle={detail && detail.create_message || ""}
    >
      <Layout>
      {
        needValidation && invalidations.length > 0 && 
          <Layout.Section>
            <Banner
              title="???????????????????????????????????????:"
              status="warning"
            >
              <List>
                {
                  invalidations.map((desc,idx) => (
                    <List.Item key={ idx }>
                      {desc}
                    </List.Item>
                  ))
                }
              </List>
            </Banner>
          </Layout.Section>
        }
        <Layout.Section>

          <Card title="????????????">

            <IndexTable
              resourceName={resourceName}
              itemCount={selectedGoods.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              promotedBulkActions={promotedBulkActions}
              emptyState={<TextStyle variation="subdued">{`???????????????????????????`}</TextStyle>}
              headings={[
                { title: '????????????' },
                { title: '??????SKU' },
                { title: '??????????????????' },
                { title: '' },
              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
            {!id &&
              <div style={{ textAlign: "center" }}>
                <Button onClick={() => { setActive(true) }}>????????????</Button>
              </div>
            }
            <br />
          </Card>


          <Card title="????????????" sectioned>
            <Form
              onSubmit={() => { }}
            >
              <FormLayout>
                <FormLayout.Group>
                  {datePop}
                  <TextField
                    label="???????????????"
                    value={formObject.shipping_no}
                    name="shipping_no"
                    id="shipping_no"
                    onChange={handleFormObjectChange}
                    maxLength={50}
                    placeholder="????????????????????????"
                    disabled={id}
                    error={  needValidation && errshipping_no}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField
                    label="??????????????????"
                    value={formObject.expected_days.toString()}
                    name="expected_days"
                    id="expected_days"
                    onChange={handleFormObjectChange}
                    placeholder="0"
                    disabled={id}
                    error={  needValidation && errexpected_days}

                  />
                  <TextField
                    label="????????????(??????)"
                    value={formObject.tracking_no}
                    name="tracking_no"
                    id="tracking_no"
                    onChange={handleFormObjectChange}
                    placeholder="?????????????????????"
                    disabled={id}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField
                    label="???????????????(??????)"
                    value={formObject.tracking_service}
                    name="tracking_service"
                    id="tracking_service"
                    onChange={handleFormObjectChange}
                    placeholder="????????????????????????"
                    disabled={id}
                  />
                  <TextField
                    label="??????(??????)"
                    value={formObject.shipping_price}
                    name="shipping_price"
                    id="shipping_price"
                    onChange={handleFormObjectChange}
                    placeholder="0"
                    disabled={id}

                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="????????????(??????????????????)"
                    value={form_currency}
                    name="shipping_currency"
                    id="shipping_currency"
                    onChange={(val) => { setForm_currency(val) }}
                    options={currenctyOpts}
                    // placeholder="?????????????????????"
                    disabled={id}

                  />
                  <TextField
                    label="?????????"
                    value={formObject.binning_no}
                    name="binning_no"
                    id="binning_no"
                    onChange={handleFormObjectChange}
                    placeholder="??????????????????"
                    disabled={id}
                    error={  needValidation && errbinning_no}
                  />
                </FormLayout.Group>

              </FormLayout>
            </Form>


          </Card>

        </Layout.Section>
        <Layout.Section secondary>

          <SourcingProviCard provInfo={id ? formObject.provider : provider} noCardNum={true} />
          <SourcingRepoCard wareInfo={id ? formObject.warehouse : warehouse} />
          <SourcingRemarkCard
            readOnly={id}
            remark={formObject.remark}
            onChange={(val) => { handleFormObjectChange(val, "remark") }}
          />

        </Layout.Section>
      </Layout>


      <Modal
        large={false}
        open={active}
        onClose={handleChange}
        title="??????????????????"
        primaryAction={{
          content: '??????',
          onAction: handleConfirmAddGoods,
          disabled: selectGoodsMapTemp.size === 0
        }}
        secondaryActions={[
          {
            content: '??????',
            onAction: handleChange,
          },
        ]}
      >
        <div>
          <div style={{ padding: "1em" }}>

            <TextField
              id="searchVal"
              type="text"
              placeholder="?????? ?????????/?????????/???????????? ????????????"
              value={treeQueryForm.searchVal}
              onChange={treeQueryFormChangeHandler}
              prefix={<Icon
                source={SearchMinor}
                color="subdued"
              />
              }
            />
          </div>

          {
            querying
              ?
              <FstlnLoading />
              :
              <FstlnSelectTree
                treeData={ treeFilted }
                treeHeadRender={treeHeadRender}
                treeRowRender={treeRowRender}
                onTreeSelectChange={treeSelectChange}
                childrenResolver={(item) => item.item_list}
                identifier={item => item.id}
                selectValidtor={selectValidtor}
              />
          }
        </div>
      </Modal>

    </Page>
  );
}
export { DeliveryEdit }


