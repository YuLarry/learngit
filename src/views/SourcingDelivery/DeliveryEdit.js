/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-01-21 15:41:51
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, Form, FormLayout, Icon, IndexTable, Layout, Modal, Page, Select, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import {
  SearchMinor
} from '@shopify/polaris-icons';
import { useCallback, useMemo, useState } from "react";
import { FstlnSelectTree } from "../../components/FstlnSelectTree/FstlnSelectTree";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";
import { SourcingCardSection } from "../../components/SecondaryCard/SourcingCardSection";
import { SourcingNoteCard } from "../../components/SecondaryCard/SourcingNoteCard";
import { SourcingProviCard } from "../../components/SecondaryCard/SourcingProviCard";
import { SourcingRepoCard } from "../../components/SecondaryCard/SourcingRepoCard";



function DeliveryEdit(props) {


  // = modal =
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  // = modal =

  // =======

  const [customers, setCustomers] = useState([
    {
      id: '3413',
      url: 'customers/341',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      orders: 20,
      amountSpent: 2400,
    },
    {
      id: '2563',
      url: 'customers/256',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      orders: 30,
      amountSpent: 140,
    },
  ]);
  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customers);

  const promotedBulkActions = [
    {
      content: '移除',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];

  const goodsFormChangeHandler = useCallback(
    (idx, val, key) => {

      const a = [...customers];

      a[idx][key] = val
      setCustomers(a);
    },
    [customers],
  );


  const productInfo = (product) => {
    return (
      <div className="product-container" style={{ maxWidth: "400px", display: "flex", alignItems: "flex-start" }}>

        <Thumbnail
          source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg"
          alt="Black choker necklace"
          size="small"
        />
        <div style={{ flex: 1, marginLeft: "1em" }}>
          <h4>ZTE Watch Live Black</h4>
          <h4>ZTE 手表 黑</h4>
          <span>$100</span>
        </div>
      </div>
    )
  }

  const rowMarkup = useMemo(() => {
    return customers.map(
      ({ id, name, location, orders, amountSpent }, index) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <TextStyle variation="strong">{name}</TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <ProductInfoPopover popoverNode={productInfo()} tableCellText={"商品信息"}  />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextField
              type="number"
              value={orders}
              onChange={(v) => { goodsFormChangeHandler(index, v, "orders") }}
            />
          </IndexTable.Cell>
          
        </IndexTable.Row>
      ),
    )
  },
    [customers, goodsFormChangeHandler, selectedResources]
  );
  // ======


  const tree = {
    "zte": [
      {
        "sku": "6902176907197",
        "cn_name": "红魔6/6Pro钢化玻璃屏幕保护膜",
        "en_name": "RedMagic 6/6Pro tempered glass",
        "qty": 111
      },
      {
        "sku": "6902176903731",
        "cn_name": "红魔战神手柄",
        "en_name": "RedMagic 5G E-Sports Handle",
        "qty": 111
      }
    ],
    "relx": [
      {
        "sku": "69021769071971",
        "cn_name": "红魔6/6Pro钢化玻璃屏幕保护膜1",
        "en_name": "RedMagic 6/6Pro tempered glass1",
        "qty": 111
      },
      {
        "sku": "69021769037311",
        "cn_name": "红魔战神手柄1",
        "en_name": "RedMagic 5G E-Sports Handle1",
        "qty": 111
      }
    ]
  }

  const treeHeadRender = (rowItem) => {

    return (
      <div>{rowItem}</div>
    )
  }

  const treeRowRender = (rowItem) => {

    return (
      <div>{rowItem}</div>
    )
  }


  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/delivery' }]}
      title="xxxxf发货单"
      subtitle="2021-12-25 10:05:00 由xxxxxxxxx创建"
    >
      <Layout>
        <Layout.Section>

        <Card title="商品明细"
            actions={[
              {
                content: "添加商品",
                onAction: () => setActive(true),
              }
            ]}
          >
            {/* <Card.Section>
              <TextField
                prefix={<Icon
                  source={SearchMinor}
                  color="subdued" />
                }
                connectedRight={<Button>浏览</Button>}
              />
            </Card.Section> */}

            <IndexTable
              resourceName={resourceName}
              itemCount={customers.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              promotedBulkActions={promotedBulkActions}
              headings={[
                { title: '采购单号' },
                { title: '系统SKU' },
                { title: '本次发货数量' },
              ]}
            >
              {rowMarkup}
            </IndexTable>
            <div style={{ textAlign: "center" }}>
              <Button onClick={() => { setActive(true) }}>添加商品</Button>
            </div>
            <br />
          </Card>


          <Card title="采购单信息" sectioned>
            <Form>
              <FormLayout>
                <FormLayout.Group>
                  <TextField 
                    label="发货日期"
                  />
                  <TextField 
                    label="发货单单号"
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                <TextField 
                    label="预计到货天数"
                  />
                  <TextField 
                    label="物流单号（选填）"
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                <TextField 
                    label="物流服务商"
                  />
                  <TextField 
                    label="运费（选填）"
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="运费币制（运费选了必填）"
                    onChange={() => { }}
                  />
                  <TextField 
                    label="入仓号"
                  />
                </FormLayout.Group>

              </FormLayout>
            </Form>


          </Card>
          
        </Layout.Section>
        <Layout.Section secondary>
          
          <SourcingProviCard />
          <SourcingRepoCard />
          <SourcingNoteCard />

        </Layout.Section>
      </Layout>


      <Modal
        large={false}
        open={active}
        onClose={handleChange}
        title="选择采购商品"
        primaryAction={{
          content: '添加',
          onAction: handleChange,
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
              onChange={() => { }}

              prefix={<Icon
                source={SearchMinor}
                color="subdued"
              />
              }
              connectedLeft={
                <Select
                  onChange={() => { }}

                  options={[
                    { label: "商品SKU ", value: "1" },
                    { label: "品牌", value: "2" },
                  ]}
                />
              }
            />
          </div>

          <FstlnSelectTree
            treeData={tree}
            headRender={treeHeadRender}
            itemRowRender={treeRowRender}
          />

        </div>
      </Modal>

    </Page>
  );
}
export { DeliveryEdit }


