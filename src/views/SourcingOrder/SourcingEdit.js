/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-01-19 15:51:58
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, Checkbox, Form, FormLayout, Icon, IndexTable, Layout, Modal, Page, Scrollable, Select, TextField, TextStyle, useIndexResourceState } from "@shopify/polaris";
import {
  SearchMinor
} from '@shopify/polaris-icons';
import { useCallback, useMemo, useState } from "react";
import { FstlnSelectTree } from "../../components/FstlnSelectTree/FstlnSelectTree";
import "./sourcingOrder.scss";



function SourcingEdit(props) {


  // = modal =
  const [active, setActive] = useState(true);

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
  const bulkActions = [
    // {
    //   content: 'Add tags',
    //   onAction: () => console.log('Todo: implement bulk add tags'),
    // },
    // {
    //   content: 'Remove tags',
    //   onAction: () => console.log('Todo: implement bulk remove tags'),
    // },
    // {
    //   content: 'Delete customers',
    //   onAction: () => console.log('Todo: implement bulk delete'),
    // },
  ];

  const goodsFormChangeHandler = useCallback(
    (idx, val, key) => {

      const a = [...customers];

      a[idx][key] = val
      setCustomers(a);
    },
    [customers],
  );


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
          <IndexTable.Cell>{location}</IndexTable.Cell>
          <IndexTable.Cell>
            <TextField
              type="number"
              value={orders}
              onChange={(v) => { goodsFormChangeHandler(index, v, "orders") }}
            />
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextField
              type="number"
              value={amountSpent}
              prefix="$"
              onChange={(v) => { goodsFormChangeHandler(index, v, "amountSpent") }}
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
      breadcrumbs={[{ content: '采购实施列表', url: '/sourcing' }]}
      title="这是编辑"
      subtitle="2021-12-25 10:05:00 由xxxxxxxxx创建"
    >
      <Layout>
        <Layout.Section>
          <Card title="采购单信息" sectioned>
            <Form>
              <FormLayout>
                <FormLayout.Group>
                  <Select
                    label="项目"
                    onChange={() => { }}
                  />
                  <Select
                    label="采购方"
                    onChange={() => { }}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="供应商"
                    onChange={() => { }}
                  />
                  <Select
                    label="收款账户"
                    onChange={() => { }}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="收货仓库"
                    onChange={() => { }}
                  />
                  <Select
                    label="事业部"
                    onChange={() => { }}
                  />
                </FormLayout.Group>
                <FormLayout.Group>
                  <Select
                    label="业务类型"
                    onChange={() => { }}
                  />
                  <Select
                    label="平台"
                    onChange={() => { }}
                  />
                </FormLayout.Group>

              </FormLayout>
            </Form>


          </Card>
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
              bulkActions={bulkActions}
              promotedBulkActions={promotedBulkActions}
              headings={[
                { title: 'Name' },
                { title: 'Location' },
                { title: 'Order count' },
                { title: 'Amount spent' },
              ]}
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
            <Card.Section title="金额">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
            <Card.Section title="币制">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
            <Card.Section title="采购数量">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
          </Card>
          <Card title="供应商">
            <Card.Section title="名称">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
            <Card.Section title="地址">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
            <Card.Section title="电话">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
            <Card.Section title="联系人">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
            <Card.Section title="收款账户">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
          </Card>
          <Card title="收货仓库">
            <Card.Section title="名称">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
            <Card.Section title="地址">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
            <Card.Section title="电话">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
            <Card.Section title="联系人">
              <TextStyle variation="subdued">
                text 文字
              </TextStyle>

            </Card.Section>
          </Card>
          <Card title="备注">
            <Card.Section>
              <TextField
                value="123"
                onChange={() => { }}
              />

            </Card.Section>
          </Card>
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
export { SourcingEdit }


