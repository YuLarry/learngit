/*
 * @Author: lijunwei
 * @Date: 2022-01-21 15:28:14
 * @LastEditTime: 2022-03-29 19:32:51
 * @LastEditors: lijunwei
 * @Description: 
 */

import {
  DeleteMinor,
} from '@shopify/polaris-icons';
import { Autocomplete, Banner, Button, Card, Form, FormLayout, IndexTable, Layout, List, Modal, Page, Select, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkskus, getClientAccount, getShippingDetail, getSkuOptionsList, getWaitShippingList, getWarehouseArea, inboundCommit } from "../../api/requests";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { LoadingContext } from "../../context/LoadingContext";
import { ModalContext } from "../../context/ModalContext";
import { ToastContext } from "../../context/ToastContext";
import { UnsavedChangeContext } from "../../context/UnsavedChangeContext";
import { INBOUND_TYPE } from "../../utils/StaticData";
import { fstlnTool } from "../../utils/Tools";
import { v4 as uuidv4 } from 'uuid';

function DeliveryInbound(props) {
  const navigate = useNavigate();

  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);
  const modalContext = useContext(ModalContext);
  const unsavedChangeContext = useContext(UnsavedChangeContext);



  const [detail, setDetail] = useState({});

  const [querysMap, setQuerysMap] = useSearchParams();

  const [shipping_code, setShipping_code] = useState(querysMap.get("shipping_code"));
  const [type, setType] = useState(querysMap.get("type"));

  const [inboundModalOpen, setInboundModalOpen] = useState(false);
  const handleInboundModalOpenChange = useCallback(() => setInboundModalOpen(!inboundModalOpen), [inboundModalOpen]);

  const [skuDetailModalOpen, setSkuDetailModalOpen] = useState(false);
  const handleSkuDetailModalOpenChange = useCallback(() => setSkuDetailModalOpen(!skuDetailModalOpen), [skuDetailModalOpen]);

  const [clientList, setClientList] = useState(new Map());
  const [warehouseArea, setWarehouseArea] = useState(new Map());

  const [clientSelected, setClientSelected] = useState("");
  const [warehouseSelected, setWarehouseSelected] = useState("");
  // useEffect(() => {
  //   clientList.size > 0 && setClientSelected(clientList.keys().next().value)
  // }, [clientList])

  const clientsOptions = useMemo(() => {
    const arr = [];
    for (const [value, label] of clientList) {
      arr.push({ label, value });
    }
    return arr;
  },
    [clientList])

  const warehousesOptions = useMemo(() => {
    const arr = [];
    for (const [value, label] of warehouseArea) {
      arr.push({ label, value })
    }
    return arr;
  },
    [warehouseArea])
  // useEffect(() => {
  //   warehouseArea.size > 0 && setWarehouseSelected(warehouseArea.keys().next().value)
  // }, [warehouseArea])

  const [boxCardCount, setBoxCardCount] = useState("");

  // autocomplete ===
  const [selectSkuObj, setSelectSkuObj] = useState(null);
  const [selectedSku, setSelectedSku] = useState([]);

  const [inputSku, setInputSku] = useState('');
  const [skuOptions, setSkuOptions] = useState([]);
  const [skuOptionsBackup, setSkuOptionsBackup] = useState([]);
  const [skuOptionsMap, setSkuOptionsMap] = useState(new Map());

  useEffect(() => {
    if (!inboundModalOpen) return;
    setInputSku("");
    setSelectSkuObj(null);
    setSelectedSku([]);
    setBoxCardCount("");

  }, [inboundModalOpen]);

  const [goodsMap, setGoodsMap] = useState(new Map());
  const goodsList = useMemo(() => {
    const arr = [];
    for (const [key, item] of goodsMap) {
      arr.push({ ...item });
    }
    return arr;
  },
    [goodsMap]);

  const resourceName = {
    singular: '??????',
    plural: '??????',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(goodsList);

  const clearSelectedResources = useCallback(
    () => {
      handleSelectionChange("page", false);
    },
    [handleSelectionChange],
  );


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

  const [detailModalTableList, setDetailModalTableList] = useState([]);

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
            <ProductInfoPopover popoverNode={productInfo(goods)}>
              <div>{goods && goods.cn_name}</div>
              <div>{goods && goods.en_name}</div>
            </ProductInfoPopover>
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
  const [checkHasMap, setCheckHasMap] = useState(new Map());
  const inboundGoodsList = useMemo(() => {
    const arr = [];
    for (const [key, item] of inboundGoodsMap) {
      arr.push(item);
    }
    return arr;
  },
    [inboundGoodsMap]);

  const modalSkuInfo = useCallback(
    (info) => {
      setDetailModalTableList(info);
      setSkuDetailModalOpen(true);
    },
    [],
  );

  const revertGoodsMoved = useCallback(
    (item) => {
      if (!item) return;
      const _tempMap = new Map(goodsMap);
      const _tempMapMoved = new Map(inboundGoodsMap);

      _tempMap.set(item.id, { ...item });
      _tempMapMoved.delete(item.id)

      setGoodsMap(_tempMap);
      setInboundGoodsMap(_tempMapMoved);
    },
    [goodsMap, inboundGoodsMap],
  );

  const revertGoodsMovedBoxPallet = useCallback(
    (symb, obj) => {

      const _tempMap = new Map(goodsMap);
      const _tempMapMoved = new Map(inboundGoodsMap);

      const { itemMap } = obj;
      for (const [syl, item] of itemMap) {
        _tempMap.set(syl, { ...item });
        checkHasMap.delete(syl);
      }

      _tempMapMoved.delete(symb)

      setGoodsMap(_tempMap);
      setInboundGoodsMap(_tempMapMoved);
    },
    [checkHasMap, goodsMap, inboundGoodsMap],
  );

  const inboundListMarkup = useMemo(() => {
    if (type === INBOUND_TYPE.PCS) {
      return inboundGoodsList.map(
        (item, index) => {
          const { id, sku, po_no, shipping_num, plan_qty, goods, warehouse_sku } = item;
          return (
            <IndexTable.Row
              id={id}
              key={id}
              selected={selectedResources.includes(id)}
              position={index}
            >
              <IndexTable.Cell>
                <TextStyle variation="strong">{warehouse_sku}</TextStyle>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <ProductInfoPopover popoverNode={productInfo(goods)}>
                  <div>{goods && goods.cn_name}</div>
                  <div>{goods && goods.en_name}</div>
                </ProductInfoPopover>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <div style={{ width: "5em", textAlign: "right" }}>
                  {plan_qty || shipping_num}
                </div>
              </IndexTable.Cell>
              <IndexTable.Cell>
                <Button
                  icon={DeleteMinor}
                  onClick={() => { revertGoodsMoved(item) }}
                ></Button>
              </IndexTable.Cell>

            </IndexTable.Row>
          )
        }
      )
    }
    else {
      const nodes = [];
      inboundGoodsMap.forEach((val, symb) => {
        // console.log(val);
        // console.log(selectSkuObj);
        const { itemMap, count, wareSkuInfo } = val
        const { id, warehouse_sku, sku, po_no, shipping_num, goods, cn_name, en_name } = wareSkuInfo;
        const uid = uuidv4();
        nodes.push(
          <IndexTable.Row
            id={uid}
            key={uid}
            position={uid}
          >
            <IndexTable.Cell>
              <Button
                plain
                monochrome
                onClick={() => {
                  modalSkuInfo([...itemMap.values()]);
                }}
              >
                <TextStyle variation="strong">{warehouse_sku}</TextStyle>
              </Button>

            </IndexTable.Cell>
            <IndexTable.Cell>
              <ProductInfoPopover popoverNode={productInfo(goods)}>
                <div>{cn_name}</div>
                <div>{en_name}</div>
              </ProductInfoPopover>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <div style={{ width: "5em", textAlign: "left" }}>
                {count}
              </div>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Button
                icon={DeleteMinor}
                onClick={() => { revertGoodsMovedBoxPallet(symb, val) }}
              ></Button>
            </IndexTable.Cell>
          </IndexTable.Row>
        )
      })
      return nodes
    }
  },
    [inboundGoodsList, inboundGoodsMap, modalSkuInfo, revertGoodsMoved, revertGoodsMovedBoxPallet, selectedResources, type]
  );

  useEffect(() => {
    const _map = new Map(goodsMap);
    [...checkHasMap.keys()].map((key) => {
      if (goodsMap.has(key)) {
        _map.delete(key);
      }
    })
    setGoodsMap(_map);
  }, [checkHasMap])

  const skuList = useMemo(() => {
    return detailModalTableList.map(
      (item, index) => {
        const { id, sku, goods, plan_qty, shipping_num } = item;
        return (
          <IndexTable.Row
            id={id}
            key={id}
            position={index}
            selectable={false}
          >
            <IndexTable.Cell>
              <TextStyle variation="strong">{sku}</TextStyle>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <ProductInfoPopover popoverNode={productInfo(goods)}>
                <div>{goods && goods.cn_name}</div>
                <div>{goods && goods.en_name}</div>
              </ProductInfoPopover>
            </IndexTable.Cell>
            <IndexTable.Cell>
              {shipping_num}
            </IndexTable.Cell>
            {
              type === INBOUND_TYPE.BOX
              &&
              <IndexTable.Cell>
                {plan_qty && Number(shipping_num) / Number(plan_qty)}
              </IndexTable.Cell>
            }

          </IndexTable.Row>
        )
      },
    )
  },
    [detailModalTableList, type]
  );



  const updateSkuSelectText = useCallback(
    (value) => {
      setInputSku(value);
    },
    [],
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

      const obj = [...skuOptionsMap.values()].find(item => (item.warehouse_sku === selected[0]))
      setSelectSkuObj(obj);
      setInputSku(selectedValue[0]);
    },
    [setSelectSkuObj, skuOptions, skuOptionsMap],
  );
  const textField = (
    <Autocomplete.TextField
      id={ new Date().getTime() }
      onChange={updateSkuSelectText}
      label="??????SKU"
      value={inputSku}
      placeholder="???????????????SKU????????????"
    />
  );
  // autocomplete ===

  /* ---- ???????????? ---- */
  const [needValidation, setNeedValidation] = useState(false);

  const errclientSelected = useMemo(() => (!clientSelected ? "??????????????????" : null), [clientSelected]);
  const errwarehouseSelected = useMemo(() => (!warehouseSelected ? "??????????????????" : null), [warehouseSelected]);

  // ?????????????????????
  const formInvalid = useMemo(() => {
    const _map = new Map();

    errclientSelected ? _map.set("errclientSelected", false) : _map.delete("errclientSelected");
    errwarehouseSelected ? _map.set("errwarehouseSelected", false) : _map.delete("errwarehouseSelected");

    return _map;
  }
    , [errclientSelected, errwarehouseSelected])


  const invalidations = useMemo(() => {
    const errors = [];
    if (formInvalid.size > 0) {
      errors.push("???????????? ???????????????")
    }
    if( inboundGoodsList.length === 0 ){
      errors.push( "????????????????????????" )
    }
    return errors;
  }
    , [formInvalid, inboundGoodsList])


  /* ---- ???????????? ---- */


  const saveInbound = useCallback(() => {

    setNeedValidation(true);
    if (invalidations.length > 0) return;

    loadingContext.loading(true);
    let allArray = [];

    if (type !== INBOUND_TYPE.PCS) {
      inboundGoodsList.forEach((item) => {
        // console.log([...item.itemMap.values()]);
        allArray = [...allArray, ...item.itemMap.values()]
      })
    } else {
      allArray = inboundGoodsList;
    }
    const keyTransed = allArray.map((item) => {
      const {
        po_no,
        // shipping_num: plan_x_qty,
        sku,
        po_item_id,
        plan_qty,
        single_qty,
        warehouse_sku,
      } = item;
      let cardBoxInfo = {
        warehouse_sku,
        plan_qty,
        single_qty,
      }
      if (type === INBOUND_TYPE.PCS) {
        cardBoxInfo = {
          warehouse_sku
        }
      }

      return {
        po_item_id,
        po_no,
        shipping_no: atob(shipping_code),
        sku,
        ...cardBoxInfo
      }
    })
    const data = {
      client_account_code: clientSelected,
      warehouse_area: warehouseSelected,
      item_type: type,
      // plan_total_qty: totalCount,
      inbound_item: keyTransed,
    }
    // return;
    inboundCommit(data)
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
  }, [boxCardCount, clientSelected, inboundGoodsList, navigate, selectedSku, shipping_code, type, warehouseSelected])


  useEffect(() => {
    loadingContext.loading(true);
    Promise.all([
      getClientAccount(),
      getWarehouseArea(),
      getShippingDetail(atob(shipping_code)),
      getWaitShippingList(atob(shipping_code)),
    ])

      .then(([clientRes, warehouseRes, detailRes, waitRes]) => {
        const { data: clients } = clientRes;
        const clientsMap = new Map(Object.entries(clients));
        setClientList(clientsMap)

        const { data: warehouses } = warehouseRes;
        const warehousesMap = new Map(Object.entries(warehouses));
        setWarehouseArea(warehousesMap)

        const { data: detail } = detailRes;
        setDetail(detail);
        // const dataArrWidthKey = detail.item.map((goods) => [goods.id, goods])
        // setGoodsMap(new Map(dataArrWidthKey));

        const { data: { list } } = waitRes;
        const dataArrWidthKey = list.map((goods) => [goods.id, goods]);
        setGoodsMap(new Map(dataArrWidthKey));

      })
      .finally(() => {
        loadingContext.loading(false);

      })
  }, [shipping_code]);

  const [queryingSkus, setQueryingSkus] = useState(false);
  const querySku = useCallback(
    () => {
      if (queryingSkus) return;
      setQueryingSkus(true);
      getSkuOptionsList({
        warehouse_sku: inputSku,
        client_account_code: clientSelected,
      })
        .then((res) => {
          const { data: { list } } = res;

          const optionsArr = [];
          const skuMap = new Map();
          list.map((skuItem) => {
            const { id, sku, warehouse_sku, goods, service_provider_name, client_account_name } = skuItem;
            const { cn_name = "", en_name = "" } = goods || {};
            optionsArr.push({ id, value: warehouse_sku, label: `${warehouse_sku} | ${cn_name} ${service_provider_name} | ${client_account_name}` })
            skuMap.set(id, skuItem);
          })
          setSkuOptions(optionsArr);
          setSkuOptionsBackup(optionsArr);
          setSkuOptionsMap(skuMap);

        })
        .finally(() => {
          setQueryingSkus(false);

        })
    },
    [clientSelected, inputSku, queryingSkus],
  );

  useEffect(() => {
    if (!clientSelected || !inboundModalOpen) return;
    const timer = setTimeout(() => {
      querySku();
    }, 800);
    return () => {
      clearTimeout(timer)
    }
  }, [inputSku, inboundModalOpen]);

  const checkSkusOk = useCallback(() => {
    // const skuToId = new Map();
    const skus = selectedResources.map((id) => {
      const item = goodsMap.get(id);
      // skuToId.set(item.sku, id)
      return item.sku
    });

    // console.log(selectedResources);

    return checkskus({
      client_account_code: clientSelected,
      sku: [...skus],
    })
      .then(res => {
        const { data } = res;

        selectedResources.forEach((id) => {
          const item = goodsMap.get(id);
          const _sku = item.sku;
          const warehouse_sku = data[_sku];
          item["warehouse_sku"] = warehouse_sku;
        });

      })
  }
    , [clientSelected, goodsMap, selectedResources])


  const moveToInboundTablePCS = useCallback(
    async () => {
      if (selectedResources.length < 1) return;
      const _tempMap = new Map(inboundGoodsMap);
      try {
        loadingContext.loading(true)
        await checkSkusOk()
      } catch (error) {
        return
      } finally {
        loadingContext.loading(false)
      }

      selectedResources.map((id) => {
        const item = goodsMap.get(id);
        _tempMap.set(id, { ...item });
      })

      setInboundGoodsMap(_tempMap)
      setCheckHasMap(_tempMap)
      clearSelectedResources();
      setInboundModalOpen(false);
    },
    [checkSkusOk, clearSelectedResources, goodsMap, inboundGoodsMap, selectedResources]
  );

  const moveToInboundTableBoxPallet = useCallback(
    async () => {
      if (selectedResources.length < 1) return;
      if (type !== INBOUND_TYPE.PCS && !boxCardCount) {
        toastContext.toast({
          active: true,
          message: "??????????????????????????????????????????"
        })
        return;
      }
      if (type !== INBOUND_TYPE.PCS && selectedSku.length === 0) {
        toastContext.toast({
          active: true,
          message: "????????????????????????sku"
        })
        return;
      }
      const rltMap = new Map();
      const _tempMap = new Map();

      const numArr = [];
      let modValid = true;

      selectedResources.map((id) => {
        const item = goodsMap.get(id);
        const { shipping_num } = item;
        if (modValid && Number(shipping_num) % Number(boxCardCount) !== 0) {
          modValid = false;
        }
        numArr.push(shipping_num);
        let boxCardInfo = {};
        if (type !== INBOUND_TYPE.PCS) {
          boxCardInfo = {
            warehouse_sku: selectedSku[0],
            plan_qty: boxCardCount,
            single_qty: (item.shipping_num) / parseInt(boxCardCount)
          }
        }

        _tempMap.set(id, { ...item, ...boxCardInfo });

      })
      if (!modValid) {
        toastContext.toast({
          active: true,
          message: `?????????????????? ${numArr.join(',')} ??????????????????`
        })
        return;
      }
      const { id, warehouse_sku, sku, po_no, shipping_num, goods, cn_name, en_name } = selectSkuObj;
      rltMap.set(Symbol(), { itemMap: _tempMap, count: boxCardCount, wareSkuInfo: { id, warehouse_sku, sku, po_no, shipping_num, goods, cn_name, en_name } })


      setInboundGoodsMap(new Map([...inboundGoodsMap, ...rltMap]));
      setCheckHasMap(_tempMap)
      clearSelectedResources();
      setInboundModalOpen(false)

    }
    , [boxCardCount, clearSelectedResources, goodsMap, inboundGoodsMap, selectSkuObj, selectedResources, selectedSku, type])

  const moveToInboundTable = useCallback(
    () => {
      if (type === INBOUND_TYPE.PCS) {
        moveToInboundTablePCS();
      } else {
        moveToInboundTableBoxPallet()
      }
    },
    [moveToInboundTableBoxPallet, moveToInboundTablePCS, type],
  );

  useEffect(() => {
    unsavedChangeContext.remind({
      active: true,
      message: "????????????",
      actions: {
        saveAction: {
          content: "??????",
          onAction: () => {
            saveInbound();
          },
        },
        discardAction: {
          content: "??????",
          onAction: () => {
            modalContext.modal({
              active: true,
              title: "??????",
              message: "???????????????",
              primaryAction: {
                content: "??????",
                destructive: true,
                onAction: () => {
                  modalContext.modal({ active: false });
                  navigate(-1);
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
    [navigate, saveInbound])

  const tableInboundActionHandler = useCallback(
    () => {
      if (type === INBOUND_TYPE.PCS) {
        moveToInboundTablePCS();
      } else {
        setInboundModalOpen(true);
      }
    },
    [moveToInboundTablePCS, type],
  );

  const promotedBulkActions = useMemo(() => (
    [
      {
        content: '????????????',
        // onAction: () => setInboundModalOpen(true),
        onAction: () => {
          if (!clientSelected || !warehouseSelected) {
            toastContext.toast({
              active: true,
              message: "?????????????????? ????????????????????????",
              duration: "1000"
            })
            return;
          }
          tableInboundActionHandler()
        },
      },
    ]
  ),
    [clientSelected, tableInboundActionHandler, warehouseSelected]);
  const typeText = useMemo(() => {
    const obj = {
      [INBOUND_TYPE.PCS]: "pcs",
      [INBOUND_TYPE.BOX]: "???",
      [INBOUND_TYPE.PALLET]: "??????",
    }
    return obj[type]
  }, [type])

  const boxCountHandler = useCallback(
    (val) => {
      if (val === "" || fstlnTool.INT_MORE_THAN_ZERO_REG.test(val)) {
        setBoxCardCount(val)
      }
    },
  );

  return (
    <Page
      breadcrumbs={[{
        content: '??????????????????', onAction: () => {
          navigate(-1)
        }
      }]}
      title={`${atob(shipping_code)} - ???${typeText}????????????`}
      narrowWidth
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
                  invalidations.map((desc, idx) => (
                    <List.Item key={idx}>
                      {desc}
                    </List.Item>
                  ))
                }
              </List>
            </Banner>
          </Layout.Section>
        }
        <Layout.Section>

          <Card title="????????????" sectioned>
            <Form>
              <FormLayout>
                <FormLayout.Group>
                  <Select
                    label="??????"
                    options={clientsOptions}
                    value={clientSelected}
                    onChange={(val) => { setClientSelected(val) }}
                    placeholder="???????????????"
                    disabled={inboundGoodsMap.size > 0}
                    error={needValidation && errclientSelected}
                  />
                  <Select
                    label="??????"
                    options={warehousesOptions}
                    value={warehouseSelected}
                    onChange={(val) => { setWarehouseSelected(val) }}
                    placeholder="???????????????"
                    disabled={inboundGoodsMap.size > 0}
                    error={needValidation && errwarehouseSelected}

                  />

                </FormLayout.Group>

              </FormLayout>
            </Form>
          </Card>

          <Card title="????????????">
            <IndexTable
              resourceName={resourceName}
              itemCount={goodsList.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              promotedBulkActions={promotedBulkActions}
              headings={[
                { title: '??????SKU' },
                { title: '????????????' },
                { title: '??????????????????' },
              ]}
              emptyState={<TextStyle variation="subdued">????????????</TextStyle>}
            >
              {rowMarkup}
            </IndexTable>

            <br />
          </Card>

          <Card title="????????????">
            <IndexTable
              resourceName={resourceName}
              itemCount={inboundGoodsList.length}
              selectable={false}
              headings={[
                { title: '??????SKU' },
                { title: '????????????' },
                { title: '????????????' },
                { title: '' },
              ]}
              emptyState={<TextStyle variation="subdued">????????????</TextStyle>}
              lastColumnSticky={true}
            >
              {inboundListMarkup}
            </IndexTable>
            <br />
          </Card>
        </Layout.Section>

      </Layout>

      <Modal
        // small
        open={inboundModalOpen}
        // open={false}
        onClose={handleInboundModalOpenChange}
        title={`???${typeText}??????`}
        primaryAction={{
          content: '??????',
          onAction: moveToInboundTable,
        }}
        secondaryActions={[
          {
            content: '??????',
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
                loading={queryingSkus}
              />
              <TextField
                type="number"
                label="????????????"
                value={boxCardCount}
                onChange={boxCountHandler}
              />
            </FormLayout>

          </Form>
        </Modal.Section>
      </Modal>

      <Modal
        open={skuDetailModalOpen}
        onClose={handleSkuDetailModalOpenChange}
        title="????????????SKU"
        large={true}
      >
        <div>
          <IndexTable
            resourceName={resourceName}
            itemCount={detailModalTableList.length}
            selectable={false}
            headings={
              (type === INBOUND_TYPE.BOX
                ?
                [
                  { title: '??????SKU' },
                  { title: '????????????' },
                  { title: '??????????????????' },
                  { title: 'pcs/???' },
                ]
                : [
                  { title: '??????SKU' },
                  { title: '????????????' },
                  { title: '??????????????????' }
                ])
            }
          >
            {skuList}
          </IndexTable>
        </div>
      </Modal>
    </Page>
  );
}
export { DeliveryInbound }

