/*
 * @Author: lijunwei
 * @Date: 2022-01-21 15:28:14
 * @LastEditTime: 2022-03-17 19:08:26
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Autocomplete, Button, Card, Form, FormLayout, IndexTable, Modal, Page, Select, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
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
    singular: '商品',
    plural: '商品',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(goodsList);

  const clearSelectedResources = useCallback(
    () => {
      selectedResources.map((id) => {
        handleSelectionChange("single", false, id)
      })
    },
    [handleSelectionChange, selectedResources],
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

  const inboundListMarkup = useMemo(() => {
    if (type === INBOUND_TYPE.PCS) {
      return inboundGoodsList.map(
        ({ id, sku, po_no, shipping_num, box_qty, pallet_qty, goods, box_no, pallet_no }, index) => (
          <IndexTable.Row
            id={id}
            key={id}
            selected={selectedResources.includes(id)}
            position={index}
          >
            <IndexTable.Cell>
              <TextStyle variation="strong">{box_no || pallet_no}</TextStyle>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <ProductInfoPopover popoverNode={productInfo(goods)}>
                <div>{goods && goods.cn_name}</div>
                <div>{goods && goods.en_name}</div>
              </ProductInfoPopover>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <div style={{ width: "5em", textAlign: "right" }}>
                {box_qty || pallet_qty || shipping_num}
              </div>
            </IndexTable.Cell>

          </IndexTable.Row>
        ),
      )
    }
    else {
      const nodes = [];
      inboundGoodsMap.forEach((val, wareSku) => {
        // console.log(selectSkuObj);
        const { itemMap, count } = val
        const { id,sku, po_no, shipping_num, goods } = selectSkuObj;
        nodes.push(
          <IndexTable.Row
            id={id || sku}
            key={id || sku}
            position={id || sku}
          >
            <IndexTable.Cell>
              <Button
                plain
                monochrome
                onClick={() => {
                  modalSkuInfo([...itemMap.values()]);
                }}
              >
                <TextStyle variation="strong">{sku}</TextStyle>
              </Button>

            </IndexTable.Cell>
            <IndexTable.Cell>
              <ProductInfoPopover popoverNode={productInfo(goods)}>
                <div>{goods && goods.cn_name}</div>
                <div>{goods && goods.en_name}</div>
              </ProductInfoPopover>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <div style={{ width: "5em", textAlign: "left" }}>
                {count}
              </div>
            </IndexTable.Cell>

          </IndexTable.Row>
        )
      })
      return nodes
    }
  },
    [inboundGoodsList, inboundGoodsMap, modalSkuInfo, selectSkuObj, selectedResources, type]
  );

  useEffect(() => {
    [...checkHasMap.keys()].map((key) => {
      // console.log(key);
      if (goodsMap.has(key)) {
        const _map = new Map(goodsMap);
        _map.delete(key);
        setGoodsMap(_map);
      }
    })
  }, [goodsMap, checkHasMap])

  const skuList = useMemo(() => {
    return detailModalTableList.map(
      (item, index) => {
        const { id, sku, goods, box_qty, pallet_qty, shipping_num } = item;
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
                {box_qty && Number(shipping_num) / Number(box_qty)}
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
      // const valTrim = value.trim();
      // if (valTrim === '') {
      //   setSkuOptions(skuOptionsBackup);
      //   return;
      // }

      // const resultOptions = skuOptionsBackup.filter((option) =>
      //   option.label.indexOf(valTrim) > -1,
      // );
      // setSkuOptions(resultOptions);
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
      // console.log([...skuOptionsMap.values()]);
      const obj = [...skuOptionsMap.values()].find(item=> (item.warehouse_sku === selected[0]) )
      setSelectSkuObj( obj );
      setInputSku(selectedValue[0]);
    },
    [setSelectSkuObj, skuOptions, skuOptionsMap],
  );
  const textField = (
    <Autocomplete.TextField
      onChange={updateSkuSelectText}
      label="货品SKU"
      value={inputSku}
      placeholder="请输入仓库SKU进行搜索"
    />
  );
  // autocomplete ===

  const saveInbound = useCallback(() => {
    loadingContext.loading(true);
    let totalCount = 0;
    let allArray = [];
    if (type === INBOUND_TYPE.PALLET) {
      inboundGoodsList.forEach((item) => {
        // console.log([...item.itemMap.values()]);
        allArray = [...allArray, ...item.itemMap.values()]
      })
    } else {
      allArray = inboundGoodsList;
    }
    // console.log(allArray);
    const keyTransed = allArray.map((item) => {
      totalCount += item.shipping_num;
      const {
        po_no,
        shipping_num: plan_qty,
        sku,
        po_item_id,

        box_no,
        box_qty,
        single_box_qty,

        pallet_no,
        pallet_qty,
        single_pallet_qty,
      } = item;
      let cardBoxInfo;
      if (type === INBOUND_TYPE.BOX) {
        cardBoxInfo = {
          box_no,
          box_qty,
          single_box_qty,
        }
      } else if (type === INBOUND_TYPE.PALLET) {
        cardBoxInfo = {
          pallet_no,
          pallet_qty,
          single_pallet_qty,
        }
      }
      return {
        po_item_id,
        po_no,
        shipping_no: atob(shipping_code),
        sku,
        plan_qty,
        ...cardBoxInfo
      }
    })
    const data = {
      client_account_code: clientSelected,
      warehouse_area: warehouseSelected,
      // service_provider_code: "wingsing",
      item_type: type,
      plan_total_qty: totalCount,
      inbound_item: keyTransed,

    }
    // console.log(selectedSku);
    inboundCommit(data)
      .then(res => {
        toastContext.toast({
          active: true,
          message: "预报成功",
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
            skuMap.set(sku, skuItem);
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
    const skuToId = new Map();
    const skus = selectedResources.map((id) => {
      const item = goodsMap.get(id);
      skuToId.set(item.sku, id)
      return item.sku
    });

    return checkskus({
      client_account_code: clientSelected,
      sku: [...skus],
    })
      .then(res => {
        // console.log(res);
        const { data } = res;
        Object.keys(data).map((sku) => {
          const box_no = data[sku];
          const id = skuToId.get(sku);
          const _item = goodsMap.get(id)
          // const _tMap = new Map( goodsMap );
          // _tMap.set( id, _item );
          _item["box_no"] = box_no

        })
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
          message: "请输入所选商品可整除的数量！"
        })
        return;
      }
      if (type !== INBOUND_TYPE.PCS && selectedSku.length === 0) {
        toastContext.toast({
          active: true,
          message: "请输入选择正确的sku"
        })
        return;
      }
      const rltMap = new Map();
      const _tempMap = new Map(inboundGoodsMap);

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
        switch (type) {
          case INBOUND_TYPE.BOX:
            boxCardInfo = {
              box_no: selectedSku[0],
              box_qty: boxCardCount,
              single_box_qty: (item.shipping_num) / parseInt(boxCardCount)
            }
            break;
          case INBOUND_TYPE.PALLET:
            boxCardInfo = {
              pallet_no: selectedSku[0],
              pallet_qty: boxCardCount,
              single_pallet_qty: (item.shipping_num) / parseInt(boxCardCount)
            }
            break;

          default:
            break;
        }
        _tempMap.set(id, { ...item, ...boxCardInfo });

      })
      if (!modValid) {
        toastContext.toast({
          active: true,
          message: `请输入可以被 ${numArr.join(',')} 整除的数量！`
        })
        return;
      }
      rltMap.set(selectedSku[0], { itemMap: _tempMap, count: boxCardCount })

      setInboundGoodsMap(rltMap)
      setCheckHasMap(_tempMap)
      clearSelectedResources();
      setInboundModalOpen(false)

    }
    , [boxCardCount, clearSelectedResources, goodsMap, inboundGoodsMap, selectedResources, selectedSku, type])

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
      message: "预报仓库",
      actions: {
        saveAction: {
          content: "预报",
          onAction: () => {
            saveInbound();
          },
        },
        discardAction: {
          content: "取消",
          onAction: () => {
            modalContext.modal({
              active: true,
              title: "取消",
              message: "确认放弃？",
              primaryAction: {
                content: "确认",
                destructive: true,
                onAction: () => {
                  modalContext.modal({ active: false });
                  navigate(-1);
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
        content: '预报仓库',
        // onAction: () => setInboundModalOpen(true),
        onAction: () => {
          if (!clientSelected || !warehouseSelected) {
            toastContext.toast({
              active: true,
              message: "请先选择货主 货区，再进行预报",
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
      [INBOUND_TYPE.BOX]: "箱",
      [INBOUND_TYPE.PALLET]: "卡板",
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
        content: '采购实施列表', onAction: () => {
          navigate(-1)
        }
      }]}
      title={`${atob(shipping_code)} - 按${typeText}预报仓库`}
      narrowWidth
    >
      <Card title="仓库信息" sectioned>
        <Form>
          <FormLayout>
            <FormLayout.Group>
              <Select
                label="货主"
                options={clientsOptions}
                value={clientSelected}
                onChange={(val) => { setClientSelected(val) }}
                placeholder="请选择货主"
              />
              <Select
                label="货区"
                options={warehousesOptions}
                value={warehouseSelected}
                onChange={(val) => { setWarehouseSelected(val) }}
                placeholder="请选择货区"
              />

            </FormLayout.Group>

          </FormLayout>
        </Form>
      </Card>

      <Card title="发货明细">
        <IndexTable
          resourceName={resourceName}
          itemCount={goodsList.length}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          promotedBulkActions={promotedBulkActions}
          headings={[
            { title: '系统SKU' },
            { title: '商品信息' },
            { title: '本次发货数量' },
          ]}
          emptyState={<TextStyle variation="subdued">没有商品</TextStyle>}
        >
          {rowMarkup}
        </IndexTable>

        <br />
      </Card>

      <Card title="入库信息">
        <IndexTable
          resourceName={resourceName}
          itemCount={inboundGoodsList.length}
          selectable={false}
          headings={[
            { title: '货品SKU' },
            { title: '商品信息' },
            { title: '预报数量' },
          ]}
          emptyState={<TextStyle variation="subdued">没有商品</TextStyle>}

        >
          {inboundListMarkup}
        </IndexTable>
        <br />
      </Card>

      <Modal
        // small
        open={inboundModalOpen}
        // open={false}
        onClose={handleInboundModalOpenChange}
        title={`按${typeText}入库`}
        primaryAction={{
          content: '确认',
          onAction: moveToInboundTable,
        }}
        secondaryActions={[
          {
            content: '取消',
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
                label="预报数量"
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
        title="查看货品SKU"
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
                  { title: '系统SKU' },
                  { title: '商品信息' },
                  { title: '本次发货数量' },
                  { title: 'pcs/箱' },
                ]
                : [
                  { title: '系统SKU' },
                  { title: '商品信息' },
                  { title: '本次发货数量' }
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

