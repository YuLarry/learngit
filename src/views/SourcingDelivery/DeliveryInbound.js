/*
 * @Author: lijunwei
 * @Date: 2022-01-21 15:28:14
 * @LastEditTime: 2022-01-21 19:29:00
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Autocomplete, Button, Card, Form, FormLayout, IndexTable, Modal, Page, Select, TextField, TextStyle, Thumbnail, useIndexResourceState } from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import { ProductInfoPopover } from "../../components/ProductInfoPopover/ProductInfoPopover";

function DeliveryInbound(props) {

  // =====

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
      content: '预报仓库',
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
            <ProductInfoPopover popoverNode={productInfo()} tableCellText={"商品信息"} />
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

  const inboundList = useMemo(() => {
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
            {/* <ProductInfoPopover popoverNode={productInfo()} tableCellText={"商品信息"} /> */}
            ZTE Watch Live Black<br />
            ZTE 手表 黑
          </IndexTable.Cell>
          <IndexTable.Cell>
            {orders}
          </IndexTable.Cell>

        </IndexTable.Row>
      ),
    )
  },
    [customers, goodsFormChangeHandler, selectedResources]
  );

  const skuList = useMemo(() => {
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
            {/* <ProductInfoPopover popoverNode={productInfo()} tableCellText={"商品信息"} /> */}
            ZTE Watch Live Black<br />
            ZTE 手表 黑
          </IndexTable.Cell>
          <IndexTable.Cell>
            {orders}
          </IndexTable.Cell>
          <IndexTable.Cell>
            {orders}
          </IndexTable.Cell>

        </IndexTable.Row>
      ),
    )
  },
    [customers, goodsFormChangeHandler, selectedResources]
  );

  // =====

  // modal ===

  const [active, setActive] = useState(true);

  const handleChange = useCallback(() => setActive(!active), [active]);

  // modal ===



  // autocomplete ===

  const deselectedOptions = [
    { value: 'rustic', label: 'Rustic' },
    { value: 'antique', label: 'Antique' },
    { value: 'vinyl', label: 'Vinyl' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'refurbished', label: 'Refurbished' },
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions],
  );


  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);
      setInputValue(selectedValue[0]);
    },
    [options],
  );
  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="货品SKU"
      value={inputValue}
      // prefix={<Icon source={SearchMinor} color="base" />}
      placeholder=""
    />
  );
  // autocomplete ===




  return (
    <Page
      breadcrumbs={[{ content: '采购实施列表', url: '/delivery' }]}
      title="预报仓库-xxx"
      narrowWidth
    >
      <Card title="仓库信息" sectioned>
        <Form>
          <FormLayout>
            <FormLayout.Group>
              <Select
                label="货主"
                onChange={() => { }}
              />
              <Select
                label="货区"
                onChange={() => { }}
              />

            </FormLayout.Group>

          </FormLayout>
        </Form>


      </Card>

      <Card title="发货明细"

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
            { title: '系统SKU' },
            { title: '商品信息' },
            { title: '本次发货数量' },
          ]}
        >
          {rowMarkup}
        </IndexTable>
        {/* <div style={{ textAlign: "center" }}>
          <Button onClick={() => { setActive(true) }}>添加商品</Button>
        </div> */}
        <br />
      </Card>

      <Card title="入库信息"

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
          selectable={false}
          headings={[
            { title: '系统SKU' },
            { title: '商品信息' },
            { title: '预报数量' },
          ]}
        >
          {inboundList}
        </IndexTable>
        {/* <div style={{ textAlign: "center" }}>
            <Button onClick={() => { setActive(true) }}>添加商品</Button>
          </div> */}
        <br />
      </Card>


      <Modal
        small
        // open={active}
        open={false}
        onClose={handleChange}
        title="按xxxx入库"
        primaryAction={{
          content: '确认',
          onAction: handleChange,
        }}
        secondaryActions={[
          {
            content: '取消',
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <Form>
            <FormLayout>
              <div style={{ maxHeight: '200px' }}>
                <Autocomplete
                  options={options}
                  selected={selectedOptions}
                  onSelect={updateSelection}
                  textField={textField}
                />
              </div>
              <TextField
                type="number"
                label="预报数量"
              />
            </FormLayout>

          </Form>

        </Modal.Section>


      </Modal>


      <Modal
        open={active}
        onClose={handleChange}
        title="查看货品SKU"
        primaryAction={{
          content: '确认',
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

          <IndexTable
            resourceName={resourceName}
            itemCount={customers.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            promotedBulkActions={promotedBulkActions}
            selectable={false}
            headings={[
              { title: '系统SKU' },
              { title: '商品信息' },
              { title: '本次发货数量' },
              { title: 'pcs/箱' },
            ]}
          >
            {skuList}
          </IndexTable>
        </div>



      </Modal>
    </Page>
  );
}
export { DeliveryInbound }

