/*
 * @Author: lijunwei
 * @Date: 2022-01-18 16:10:20
 * @LastEditTime: 2022-01-18 17:53:51
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Button, Card, Form, FormLayout, Icon, IndexTable, Layout, Modal, Page, Select, TextField, TextStyle, useIndexResourceState } from "@shopify/polaris";
import {
  SearchMinor
} from '@shopify/polaris-icons';
import { useCallback, useState } from "react";
function SourcingEdit(props) {


  // = modal =
  const [active, setActive] = useState(true);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const activator = <Button onClick={handleChange}>Open</Button>;
  // = modal =

  // =======

  const customers = [
    {
      id: '3413',
      url: 'customers/341',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      orders: 20,
      amountSpent: '$2,400',
    },
    {
      id: '2563',
      url: 'customers/256',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      orders: 30,
      amountSpent: '$140',
    },
  ];
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

  const rowMarkup = customers.map(
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
        <IndexTable.Cell>{orders}</IndexTable.Cell>
        <IndexTable.Cell>{amountSpent}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );
  // ======


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
          // actions={[
          //   {
          //     content: "添加",
          //     onAction: () => console.log('Todo: implement bulk add tags'),
          //   }
          // ]}
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
              <Button>添加商品</Button>
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
              <TextField />

            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>


      <Modal
        large={false}
        activator={activator}
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
            prefix={<Icon
              source={SearchMinor}
              color="subdued" />
            }
            connectedLeft={
              <Select 
                options={[
                  {label: "商品SKU ", value: "1"},
                  {label: "品牌", value: "2"},
                ]}
              />
            }
          />
          </div>


        </div>
      </Modal>

    </Page>
  );
}
export { SourcingEdit }


