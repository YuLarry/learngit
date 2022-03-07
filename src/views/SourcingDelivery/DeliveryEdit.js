/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-03-07 15:28:03
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, DatePicker, Form, FormLayout, Icon, IndexTable, Layout, Modal, Page, Popover, Select, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import {
  SearchMinor,
  DeleteMinor,
} from '@shopify/polaris-icons';
import { useCallback, useEffect, useMemo, useState } from "react";
import { editShippingOrder, getPoItemList } from "../../api/requests";
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
import { duration } from "moment";


function DeliveryEdit(props) {
  const { id } = useParams();
  const location = useLocation();
  

  const navigate = useNavigate();
  const loadingContext = useContext(LoadingContext);
  const unsavedChangeContext = useContext(UnsavedChangeContext);
  const modalContext = useContext(ModalContext);
  const toastContext = useContext(ToastContext);

  // = modal =
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);
  // = modal =

  const [tree, setTree] = useState({});
  const [selectGoodsMapTemp, setSelectGoodsMapTemp] = useState(new Map());

  const [goodsTableDataMap, setGoodsTableDataMap] = useState(new Map());

  const selectedGoods = useMemo(() => {
    const arr = [];
    for (const [key, goods] of goodsTableDataMap) {
      arr.push({...goods, count: (goods.purchase_num - goods.shipping_num).toString() });
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
    , []);

  const goodsFormChangeHandler = useCallback(
    (sku, val, key) => {
      if( val && !fstlnTool.INT_MORE_THAN_ZERO_REG.test(val) ) return;
      const _tempGoodItem = goodsTableDataMap.get(sku);
      _tempGoodItem[key] = val
      const tempMap = new Map(goodsTableDataMap);
      tempMap.set(sku, _tempGoodItem);
      setGoodsTableDataMap(tempMap);

    },
    [goodsTableDataMap],
  );


  const [detail, setDetail] = useState(null);

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

  const currenctyOpts = useMemo(()=>{
    let arr = [
      { label: "USD", value: "USD" },
      { label: "RMB", value: "RMB" },
    ];
    if( !formObject.shipping_price ){
      arr = [
        { label: "", value: "" },
        ...arr
      ]
    }
    return arr;
  }
  ,[formObject])


  const rowMarkup = useMemo(() =>
    selectedGoods.map(({ id, sku, purchase_num, shipping_num, count = "", goods_name, headKey, }, index) => (
      <IndexTable.Row
        id={id}
        key={sku}
        selected={selectedResources.includes(sku)}
        position={index}
      >
        <IndexTable.Cell>
          {headKey}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <ProductInfoPopover>{sku}</ProductInfoPopover>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <div style={{ width: "8em" }}>
            <TextField
              type="number"
              value={count}
              prefix=""
              onChange={(v) => { goodsFormChangeHandler(id, v, "count") }}
            />
          </div>
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
    [goodsFormChangeHandler, selectedGoods, selectedResources]
  )

  const treeHeadRender = (rowItem, itemDetail, children) => {
    const { po_no, warehouse_name, purchase_qty, provider: { business_name } } = itemDetail
    return (
      <div className="tree-row">
        <div>{po_no}</div>
        <div>{business_name}</div>
        <div>{warehouse_name}</div>
        <div></div>
      </div>
    )
  }

  const treeRowRender = (child) => {
    const { sku, purchase_num, goods_name, shipping_num } = child
    return (
      <div className="tree-row">
        {/* <div style={{width: "20%"}}></div> */}
        <div>{sku}</div>
        <div>{goods_name}</div>
        <div>{purchase_num - shipping_num}</div>
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

  const selectValidtor = useCallback(( selectsMap )=>{
    if( selectsMap.size === 0 ){
      return true;
    }else if( selectsMap.size > 1 ){
      const last = [...selectsMap.values()][selectsMap.size - 1];
      const second_last = [...selectsMap.values()][selectsMap.size - 2];
      if( second_last.provider.id !== last.provider.id || second_last.warehouse.id !== last.warehouse.id ){
        toastContext.toast({
          active: true,
          message: `选择的商品与已选择的供应商「${second_last.provider.business_name}」发货仓库「${second_last.warehouse.name}」不符`,
          duration: 1000,
        })
        return false;
      }
    }else if( goodsTableDataMap.size > 0 ){
      const last = selectsMap.values().next().value;
      const tableItem = goodsTableDataMap.values().next().value;
      if( tableItem.provider.id !== last.provider.id || tableItem.warehouse.id !== last.warehouse.id ){
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
  ,[goodsTableDataMap])

  const handleConfirmAddGoods = useCallback(
    () => {
      setGoodsTableDataMap(new Map([...goodsTableDataMap, ...selectGoodsMapTemp]))
      setSelectGoodsMapTemp( new Map() );
      setActive(false);
    },
    [goodsTableDataMap, selectGoodsMapTemp],
  );

  const selectedPoItemInfo = useMemo(() => {
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
  const [querying, setQuerying] = useState(false);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      setQuerying(true)
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
            item_list.map( item => {
              item["provider"] = provider;
              item["warehouse"] = warehouse;
            })
          }
          setTree(data);

        })
        .finally(() => {
          setQuerying(false)
        })
    }, 1000);
    return () => {
      clearTimeout(timer);
      setQuerying(false)
    }
  }, [searchKey, searchVal, active]);



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
      })
    })
    editShippingOrder({
      ...formObject,
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
                  modalContext.modal({active: false})
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




  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/delivery' }]}
      title={ id ? id : "新建发货单" }
      subtitle={ detail && detail.create_message || "" }
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
                { title: '' },
              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
            <div style={{ textAlign: "center" }}>
              <Button onClick={() => { setActive(true) }}>添加商品</Button>
            </div>
            <br />
          </Card>


          <Card title="采购单信息" sectioned>
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
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField
                    label="预计到货天数"
                    value={formObject.expected_days}
                    name="expected_days"
                    id="expected_days"
                    onChange={handleFormObjectChange}
                  />
                  <TextField
                    label="物流单号(选填)"
                    value={formObject.tracking_no}
                    name="tracking_no"
                    id="tracking_no"
                    onChange={handleFormObjectChange}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <TextField
                    label="物流服务商(选填)"
                    value={formObject.tracking_service}
                    name="tracking_service"
                    id="tracking_service"
                    onChange={handleFormObjectChange}
                  />
                  <TextField
                    label="运费(选填)"
                    value={formObject.shipping_price}
                    name="shipping_price"
                    id="shipping_price"
                    onChange={handleFormObjectChange}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="运费币制(运费选了必填)"
                    value={formObject.shipping_currency}
                    name="shipping_currency"
                    id="shipping_currency"
                    onChange={handleFormObjectChange}
                    options={ currenctyOpts }
                  />
                  <TextField
                    label="入仓号"
                    value={formObject.binning_no}
                    name="binning_no"
                    id="binning_no"
                    onChange={handleFormObjectChange}
                  />
                </FormLayout.Group>

              </FormLayout>
            </Form>


          </Card>

        </Layout.Section>
        <Layout.Section secondary>

          <SourcingProviCard provInfo={provider} />
          <SourcingRepoCard wareInfo={warehouse} />
          <SourcingRemarkCard
            remark={ formObject.remark }
            onChange={ (val)=>{ handleFormObjectChange(val, "remark") } }
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
              value={searchVal}
              onChange={(val) => { setSearchVal(val) }}
              prefix={<Icon
                source={SearchMinor}
                color="subdued"
              />
              }
              connectedLeft={
                <Select
                  value={searchKey}
                  onChange={(val) => { setSearchKey(val) }}
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
                treeData={tree}
                treeHeadRender={treeHeadRender}
                treeRowRender={treeRowRender}
                onTreeSelectChange={treeSelectChange}
                childrenResolver={(item) => item.item_list}
                identifier={item => item.id}
                selectValidtor={ selectValidtor }
              />
          }

        </div>
      </Modal>

    </Page>
  );
}
export { DeliveryEdit }


