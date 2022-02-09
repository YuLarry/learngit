/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:05:46
 * @LastEditTime: 2022-02-09 17:10:58
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Badge, Button, Card, DropZone, IndexTable, Layout, Page, ResourceItem, ResourceList, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import { DatePopover } from "../../components/DatePopover/DatePopover";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingCardSection } from "../../components/SecondaryCard/SourcingCardSection";
import { SourcingInfoCard } from "../../components/SecondaryCard/SourcingInfoCard";
import {
  DeleteMinor
} from '@shopify/polaris-icons';
import "./style/payRequest.scss";
import { commitPaymentRequest } from "../../api/requests";

function PayRequest(props) {

  const [invoice, setInvoice] = useState([{
    price: "",
    date: new Date(),
    file: null
  }]);

  const addHandler = useCallback(
    () => {
      const _invoice = [...invoice];
      _invoice.push({
        price: "",
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

      setInvoice([
        ...invoice.slice(0, idx),
        { ...invoice[idx], [name]: val },
        ...invoice.slice(idx + 1)
      ])

    },
    [invoice],
  );

  const [items, setItems] = useState([
    {
      sku: "6902176906084",
      purchase_num: 50,
      goods: [
        {
          cn_name: "NX659J/12G+128G/黑色/亚欧/亚欧",
          en_name: "RedMagic 5G Gaming Phone 12G+128G EU Black",
          image_url: "https://cdn.shopify.com/s/files/1/0570/8726/2882/products/1_eed05654-f77a-4d06-aed3-8fb83e567ba2.png?v=1624248656",
          price: "599.00",
          sku: "6902176906084",
        },
        {
          cn_name: "NX659J/12G+128G/黑色/亚欧/亚欧",
          en_name: "RedMagic 5G Gaming Phone 12G+128G EU Black",
          image_url: "https://cdn.shopify.com/s/files/1/0570/8726/2882/products/1_eed05654-f77a-4d06-aed3-8fb83e567ba2.png?v=1624248656",
          price: "599.00",
          sku: "690217690608123",
        }
      ]
    }
  ]);

  const productInfo = (products = []) => {
    return products.map(({ cn_name, en_name, image_url, price, sku }, index) => (
      <div key={sku} className="product-container" style={{ maxWidth: "400px", display: "flex", alignItems: "flex-start" }}>
        <Thumbnail
          source={image_url}
          alt={en_name}
          size="small"
        />
        <div style={{ flex: 1, marginLeft: "1em" }}>
          <h4>{en_name}</h4>
          <h4>{cn_name}</h4>
          <span>{price}</span>
        </div>
      </div>
    ))
  }

  // ====

  const { selectedResources } = useIndexResourceState(items);

  const rowMarkup = useMemo(() => {
    return items.map(
      ({ sku, purchase_num, goods }, index) => (
        <IndexTable.Row
          id={sku}
          key={sku}
        >
          <IndexTable.Cell>
            <ProductInfoPopover popoverNode={productInfo(goods)} tableCellText="custom text" />
          </IndexTable.Cell>
          {/* <IndexTable.Cell>{location}</IndexTable.Cell> */}
          <IndexTable.Cell>{purchase_num}</IndexTable.Cell>
          <IndexTable.Cell>{null}</IndexTable.Cell>
        </IndexTable.Row>
      ),
    )
  },
    [items]
  );

  // ===

  const commit = useCallback(
    () => {
      commitPaymentRequest()
      .then((res)=>{
        console.log(res);
      })
      .finally(()=>{

      })
    },
    [],
  );

  const invoiceItem = useMemo(() => {
    return invoice.map(
      ({ price, date, file }, index) => (
        <Card.Section key={index}>
          <div className="invoice-item">
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
            <div className="invoice-col">
              <p>发票日期</p>
              <DatePopover
                value={date}
                onChange={(val) => { invoiceChangeHandler(index, 'date', val) }}
              />
            </div>
            <div className="invoice-col">
              <p>发票文件</p>
              <div style={{ width: "50px", height: "50px" }}>
                <DropZone
                  id={`file-${index}`}
                  accept="image/*"
                  type="image"
                  allowMultiple={false}
                  onDropAccepted={(files) => { console.dir(files[0]); invoiceChangeHandler(index, 'file', files[0]) }}
                >
                  <DropZone.FileUpload
                  />
                </DropZone>
              </div>
            </div>
            <div className="invoice-col invoice-del">
              <span>
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
              </span>
            </div>
          </div>
        </Card.Section>
      ),
    )
  },
    [deleteHandler, invoice, invoiceChangeHandler]
  );



  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/sourcing' }]}
      title="申请付款"
      titleMetadata={<div><Badge status="attention">Verified</Badge> <Badge status="attention">Verified</Badge> <Badge status="attention">Verified</Badge></div>}
      subtitle="2021-12-25 10:05:00 由xxxxxxxxx创建"
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
                  { title: '金额' },
                ]}
              >
                {rowMarkup}
              </IndexTable>
            </div>


            <br />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <SourcingInfoCard />
        </Layout.Section>
      </Layout>



    </Page>
  );
}
export { PayRequest }

