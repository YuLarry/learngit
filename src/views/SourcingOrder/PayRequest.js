/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:05:46
 * @LastEditTime: 2022-03-16 16:29:02
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Button, Card, DropZone, IndexTable, Layout, Modal, Page, ResourceItem, ResourceList, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DatePopover } from "../../components/DatePopover/DatePopover";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingInfoCard } from "../../components/SecondaryCard/SourcingInfoCard";
import {
  DeleteMinor
} from '@shopify/polaris-icons';
import "./style/payRequest.scss";
import { commitPaymentRequest, getBusinessTypeList, getDepartmentList, getPlatformList, getSourcingOrderDetail } from "../../api/requests";
import { useContext } from "react";
import { LoadingContext } from "../../context/LoadingContext";
import { useNavigate, useParams } from "react-router-dom";
import { UnsavedChangeContext } from "../../context/UnsavedChangeContext";
import { ModalContext } from "../../context/ModalContext";
import moment from "moment"
import { ToastContext } from "../../context/ToastContext";
import { fstlnTool } from "../../utils/Tools";
import { BadgeAuditStatus } from "../../components/StatusBadges/BadgeAuditStatus";
import { BadgePaymentStatus } from "../../components/StatusBadges/BadgePaymentStatus";
import { BadgeDeliveryStatus } from "../../components/StatusBadges/BadgeDeliveryStatus";


function PayRequest(props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const idDecode = atob(id);
  const idURIEncode = encodeURIComponent(idDecode);
  const idURIDecode = idDecode && decodeURIComponent(idDecode);

  const loadingContext = useContext(LoadingContext);
  const unsavedChangeContext = useContext(UnsavedChangeContext)
  const toastContext = useContext(ToastContext)
  const modalContext = useContext(ModalContext);

  const [platformList, setPlatformList] = useState({});
  const [departmentList, setDepartmentList] = useState({});
  const [businessTypeList, setBusinessTypeList] = useState({});

  const [order, setOrder] = useState(null);

  const [invoice, setInvoice] = useState([{
    price: "0.00",
    date: new Date(),
    file: null
  }]);

  const addHandler = useCallback(
    () => {
      const _invoice = [...invoice];
      _invoice.push({
        price: "0.00",
        date: new Date(),
        file: null
      })
      setInvoice(_invoice);
    },
    [invoice]
  );

  const deleteHandler = useCallback(
    (index) => {
      const _invoice = [...invoice];
      _invoice.splice(index, 1);
      setInvoice(_invoice);
    },
    [invoice]
  );

  const invoiceChangeHandler = useCallback(
    (idx, name, val) => {
      if (val && name === "price" && !fstlnTool.FLOAT_MORE_THAN_ZERO_REG.test(val)) return;
      setInvoice([
        ...invoice.slice(0, idx),
        { ...invoice[idx], [name]: val },
        ...invoice.slice(idx + 1)
      ])

    },
    [invoice],
  );

  const items = useMemo(() => (order ? order.item : []), [order])

  const productInfo = useMemo(() => {
    if (!order) return null;
    return items.map((goodsItem) => {
      const { goods: { cn_name, en_name, image_url }, purchase_price, sku } = goodsItem;
      return (
        <div key={sku} className="product-container" style={{ maxWidth: "400px", display: "flex", alignItems: "flex-start" }}>
          <Thumbnail
            source={image_url || ""}
            alt={en_name}
            size="small"
          />
          <div style={{ flex: 1, marginLeft: "1em" }}>
            <h4>{en_name}</h4>
            <h4>{cn_name}</h4>
            <span>{purchase_price}</span>
          </div>
        </div>
      )
    })

  },
    [order])

  const { selectedResources } = useIndexResourceState(items);

  const rowMarkup = useMemo(() => {
    return items.map(
      (item, index) => {
        const { sku, purchase_num, goods, purchase_price } = item;
        return (
          <IndexTable.Row
            id={sku}
            key={sku}
          >
            <IndexTable.Cell>
              <ProductInfoPopover popoverNode={productInfo}>
                {sku}
              </ProductInfoPopover>
            </IndexTable.Cell>
            {/* <IndexTable.Cell>{location}</IndexTable.Cell> */}
            <IndexTable.Cell>{purchase_num}</IndexTable.Cell>
            <IndexTable.Cell>{purchase_price}</IndexTable.Cell>
          </IndexTable.Row>
        )
      }
    )
  },
    [items]
  );




  const invoiceItem = useMemo(() => {
    return invoice.map(
      ({ price, date, file }, index) => (
        <Card.Section key={index}>
          <div className="invoice-item">
            <div className="invoice-form-item">
              <div className="invoice-col">
                <p>发票金额</p>
                <div style={{ maxWidth: "8rem" }}>
                  <TextField
                    type="number"
                    value={price}
                    onChange={(val) => { invoiceChangeHandler(index, 'price', val) }}
                  />
                </div>

              </div>
              <div className="invoice-col" style={{ minWidth: "8em" }}>
                <p>发票日期</p>
                <DatePopover
                  value={date}
                  onChange={(val) => { invoiceChangeHandler(index, 'date', val) }}
                  disableDatesAfter={new Date()}
                />
              </div>
              <div className="invoice-col" style={{ display: (file ? "none" : "") }}>
                <p>发票文件</p>
                <div style={{ width: "50px", height: "50px" }}>
                  <DropZone
                    id={`file-${index}`}
                    // accept="image/*"
                    // type="image"
                    allowMultiple={false}
                    onDropAccepted={(files) => { console.dir(files[0]); invoiceChangeHandler(index, 'file', files[0]) }}
                  >
                    <DropZone.FileUpload
                    />
                  </DropZone>

                </div>
              </div>
              <div className="invoice-col" style={{ display: (file ? "" : "none") }}>
                <p>发票文件</p>
                <div style={{ minHeight: "2em", overflow:"hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}} >{file && file.name}</div>
              </div>
            </div>
            <div className="invoice-del">
              {
                invoice.length > 1
                  ?
                  <Button
                    icon={DeleteMinor}
                    onClick={() => { deleteHandler(index) }}
                  ></Button>
                  :
                  null
              }
            </div>
          </div>


        </Card.Section >
      ),
    )
  },
    [deleteHandler, invoice, invoiceChangeHandler]
  );


  useEffect(() => {
    if (!id) return;
    loadingContext.loading(true);
    Promise.all([
      getPlatformList(),
      getBusinessTypeList(),
      getDepartmentList(),
    ])
      .then(([resPlatform, resBusinessType, resDepartment]) => {
        setPlatformList(resPlatform.data);
        setBusinessTypeList(resBusinessType.data);
        setDepartmentList(resDepartment.data);
      })
    getSourcingOrderDetail(idURIEncode)
      .then(res => {
        // console.log(res);
        setOrder(res.data)
      })
      .finally(() => {
        loadingContext.loading(false);
      })
  }, []);



  const savePay = useCallback(
    () => {
      loadingContext.loading(true)
      const invoiceFormdata = new FormData();
      invoiceFormdata.append("po_id", order.id)
      invoice.map((invoiceItem, idx) => {
        const { date, file, price } = invoiceItem;
        invoiceFormdata.append(`invoice_info[${idx}][date]`, moment(date).format("YYYY-MM-DD"))
        invoiceFormdata.append(`invoice_info[${idx}][price]`, price)
        invoiceFormdata.append(`invoice_info[${idx}][image]`, file)
      })

      console.log(invoiceFormdata)
      commitPaymentRequest(invoiceFormdata)
        .then((res) => {
          toastContext.toast({
            active: true,
            message: "提交成功",
            duration: 1000,
            onDismiss: () => {
              toastContext.toast({active: false});
              navigate(-1)
            }
          })
        })
        .finally(() => {
          loadingContext.loading(false)
        })
    },
    [idDecode, invoice],
  );
  useEffect(() => {
    unsavedChangeContext.remind({
      active: true,
      message: "未提交的编辑",
      actions: {
        saveAction: {
          content: "提交",
          onAction: () => {
            savePay()
          },
        },
        discardAction: {
          content: "取消",
          onAction: () => {
            modalContext.modal({
              active: true,
              title: "取消",
              message: "确认放弃提交？",
              primaryAction: {
                content: "确认",
                destructive: true,
                onAction: () => {
                  modalContext.modal({ active: false });
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
    })
    return () => {
      unsavedChangeContext.remind({
        active: false,
      })
    }
  },
    [savePay])


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

  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', onAction: ()=>{ navigate(-1) } }]}
      title={ `申请付款${ (idURIDecode) ? ("-" + idURIDecode) : "" }` }
      titleMetadata={ badgesMarkup }
      subtitle={order && order.create_message || ""}
    >
      <Layout>
        <Layout.Section>
          <Card title="发票信息"
          >
            {invoiceItem}
            <div style={{ textAlign: "center", padding: "1em" }}>
              <Button onClick={addHandler}>添加发票</Button>
            </div>
          </Card>

          <Card
            title="采购明细"
          >
            <div>
              <IndexTable
                itemCount={items.length}
                selectable={false}
                headings={[
                  { title: '系统SKU' },
                  { title: '采购数量' },
                  { title: '采购价格' },
                ]}
              >
                {rowMarkup}
              </IndexTable>
            </div>

            <br />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <SourcingInfoCard
            poInfo={order ?
              {
                ...order,
                provider_name: order.provider.business_name,
                bank_card_number: order.provider_account.bank_card_number,
                warehouse_name: order.warehouse.name,
                purchase_qty: order.purchase_qty,
                purchase_total: order.purchase_total || undefined,

                division: departmentList && departmentList[order.division],
                business_type: businessTypeList && businessTypeList[order.business_type],
                platform: platformList && platformList[order.platform],
              }
              : {}}
            hasMore={true}
          />
        </Layout.Section>
      </Layout>



    </Page>
  );
}
export { PayRequest }

