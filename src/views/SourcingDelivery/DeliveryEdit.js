/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-03-17 11:24:03
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, DatePicker, Form, FormLayout, Icon, IndexTable, Layout, Modal, Page, Popover, Select, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
    singular: '商品',
    plural: '商品',
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
        { label: "请选择运费币制", value: "" },
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
    const { po_no, warehouse_name, purchase_qty, provider: { business_name } } = itemDetail
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
          // message: `选择的商品与已选择的供应商「${second_last.provider.business_name}」发货仓库「${second_last.warehouse.name}」不符`,
          message: `该操作与发货单已选供应商/收货仓库冲突，请重新选择已有供应商/收货仓库对应的SKU！`,
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
          message: `选择的商品与已选择的供应商「${tableItem.provider.business_name}」发货仓库「${tableItem.warehouse.name}」不符`,
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


  const [searchKey, setSearchKey] = useState("provider_name");
  const [searchVal, setSearchVal] = useState("");


  const [treeQueryForm, setTreeQueryForm] = useState({
    searchKey: "provider_name",
    searchVal: ""
  });

  const treeQueryFormChangeHandler = useCallback(
    (val, id) => {
      setTreeQueryForm({ ...treeQueryForm, [id]: val })
    },
    [treeQueryForm],
  );

  useEffect(()=>{
    if( !active )return;
    setTreeQueryForm({
      searchKey: "provider_name",
      searchVal: ""
    })
  },[active])
  const [querying, setQuerying] = useState(false);

  const queryModalList = useCallback(
    () => {
      const { searchKey, searchVal } = treeQueryForm;
      if( querying ) return;
      setQuerying( true );
      getPoItemList({
        provider_name: "",
        warehouse_name: "",
        po_no: "",
        [searchKey]: searchVal
      })
        .then(res => {
          // console.log(res);
          const { data } = res;
          for (let key in data) {
            const { provider, warehouse, item_list } = data[key];
            item_list.map(item => {
              item["provider"] = provider;
              item["warehouse"] = warehouse;
            })
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
    const timer = setTimeout(() => {
      queryModalList();
    }, 1000);
    return () => {
      clearTimeout(timer);
    }
  }, [treeQueryForm]);


  const saveDeliveryOrder = useCallback(() => {
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
          message: "保存成功",
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
    unsavedChangeContext.remind({
      active: true,
      message: "未保存的修改",
      actions: {
        saveAction: {
          content: "保存",
          onAction: () => {
            saveDeliveryOrder()
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
                  navigate(-1);
                  modalContext.modal({ active: false });
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
    [saveDeliveryOrder])

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
        content: '采购实施列表',
        onAction: () => {
          navigate(-1);
        }
      }]}
      title={idURIDecode ? `发货单详情-${idURIDecode}` : "新建发货单"}
      titleMetadata={ badgesMarkup }
      subtitle={detail && detail.create_message || ""}
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
              emptyState={<TextStyle variation="subdued">{`请选择发货单信息！`}</TextStyle>}
              headings={[
                { title: '采购单号' },
                { title: '系统SKU' },
                { title: '本次发货数量' },
                { title: '' },
              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
            {!id &&
              <div style={{ textAlign: "center" }}>
                <Button onClick={() => { setActive(true) }}>添加商品</Button>
              </div>
            }
            <br />
          </Card>


          <Card title="物流信息" sectioned>
            <Form
              onSubmit={() => { }}
            >
              <FormLayout>
                <FormLayout.Group>
                  {datePop}
                  <TextField
                    label="发货单单号"
                    value={formObject.shipping_no}
                    name="shipping_no"
                    id="shipping_no"
                    onChange={handleFormObjectChange}
                    maxLength={50}
                    placeholder="请输入发货单单号"
                    disabled={id}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField
                    label="预计到货天数"
                    value={formObject.expected_days.toString()}
                    name="expected_days"
                    id="expected_days"
                    onChange={handleFormObjectChange}
                    placeholder="0"
                    disabled={id}
                  />
                  <TextField
                    label="物流单号(选填)"
                    value={formObject.tracking_no}
                    name="tracking_no"
                    id="tracking_no"
                    onChange={handleFormObjectChange}
                    placeholder="请输入物流单号"
                    disabled={id}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField
                    label="物流服务商(选填)"
                    value={formObject.tracking_service}
                    name="tracking_service"
                    id="tracking_service"
                    onChange={handleFormObjectChange}
                    placeholder="请输入物流服务商"
                    disabled={id}
                  />
                  <TextField
                    label="运费(选填)"
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
                    label="运费币制(运费选了必填)"
                    value={form_currency}
                    name="shipping_currency"
                    id="shipping_currency"
                    onChange={(val) => { setForm_currency(val) }}
                    options={currenctyOpts}
                    // placeholder="请选择运费币制"
                    disabled={id}

                  />
                  <TextField
                    label="入仓号"
                    value={formObject.binning_no}
                    name="binning_no"
                    id="binning_no"
                    onChange={handleFormObjectChange}
                    placeholder="请输入入仓号"
                    disabled={ id }

                  />
                </FormLayout.Group>

              </FormLayout>
            </Form>


          </Card>

        </Layout.Section>
        <Layout.Section secondary>

          <SourcingProviCard provInfo={id ? formObject.provider : provider} noCardNum={ true } />
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
        title="选择采购商品"
        primaryAction={{
          content: '添加',
          onAction: handleConfirmAddGoods,
          disabled: selectGoodsMapTemp.size === 0
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
              id="searchVal"
              type="text"
              placeholder="搜索商品"
              value={treeQueryForm.searchVal}
              onChange={treeQueryFormChangeHandler}
              prefix={<Icon
                source={SearchMinor}
                color="subdued"
              />
              }
              connectedLeft={
                <Select
                  id="searchKey"
                  value={treeQueryForm.searchKey}
                  onChange={ treeQueryFormChangeHandler }
                  options={[
                    { label: "供应商", value: "provider_name" },
                    { label: "采购单 ", value: "po_no" },
                    { label: "收货仓库", value: "warehouse_name" },
                  ]}
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
                treeData={tree || {}}
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


