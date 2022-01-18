/*
 * @Author: lijunwei
 * @Date: 2022-01-18 15:00:29
 * @LastEditTime: 2022-01-18 15:50:17
 * @LastEditors: lijunwei
 * @Description: s
 */

import { Checkbox, Filters, RadioButton, Stack, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";

function SourcingListFilter(props) {



  function disambiguateLabel(key, value) {
    switch (key) {
      case 'taggedWith':
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }


  const [val, setVal] = useState("");


  const [taggedWith, setTaggedWith] = useState('VIP');
  const [queryValue, setQueryValue] = useState(null);

  const handleTaggedWithChange = useCallback(
    (value) => setTaggedWith(value),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(null), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);



  const appliedFilters = !isEmpty(taggedWith)
    ? [
      {
        key: 'taggedWith',
        label: disambiguateLabel('taggedWith', taggedWith),
        onRemove: handleTaggedWithRemove,
      },
    ]
    : [];


  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);


  const filters = [
    {
      key: "provider",
      label: "供应商",
      filter: (
        <Stack vertical>
          <RadioButton
            label="Accounts are disabled"
            checked={true}
            id="1"
            name="accounts"
            onChange={() => { }}
          />
          <RadioButton
            label="Accounts are disabled"
            checked={false}
            id="2"
            name="accounts2"
            onChange={() => { }}
          />

        </Stack>
      ),
      onClearAll: () => { console.log("cleared"); },
      shortcut: true,
    },

    {
      key: "subject",
      label: "采购方",
      filter: (
        <Stack vertical>
          <RadioButton
            label="Accounts are disabled"
            checked={true}
            id="1"
            name="accounts"
            onChange={() => { }}
          />
          <RadioButton
            label="Accounts are disabled"
            checked={false}
            id="2"
            name="accounts2"
            onChange={() => { }}
          />

        </Stack>
      ),
      onClearAll: () => { console.log("cleared"); },
      shortcut: true,
    },

    {
      key: "warehouse",
      label: "收货仓库",
      filter: (
        <Stack vertical>
          <RadioButton
            label="Accounts are disabled"
            checked={true}
            id="1"
            name="accounts"
            onChange={() => { }}
          />
          <RadioButton
            label="Accounts are disabled"
            checked={false}
            id="2"
            name="accounts2"
            onChange={() => { }}
          />

        </Stack>
      ),
      onClearAll: () => { console.log("cleared"); },
      shortcut: true,
    },
    {
      key: "sourcingCode",
      label: "采购单号",
      filter: (
        <TextField
          label="Tagged with"
          value={val}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: false,
    },
    {
      key: "goodsInfo",
      label: "商品信息",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: false,
    },

    {
      key: "dealStatus",
      label: "审批状态",
      filter: (
        <Stack vertical>
          <Checkbox
            label="Accounts are disabled"
            checked={true}
            id="1"
            name="accounts"
            onChange={() => { }}
          />
          <Checkbox
            label="Accounts are disabled"
            checked={false}
            id="2"
            name="accounts2"
            onChange={() => { }}
          />

        </Stack>
      ),
      onClearAll: () => { console.log("cleared"); },
      shortcut: false,
    },

    {
      key: "payStatus",
      label: "付款状态",
      filter: (
        <Stack vertical>
          <Checkbox
            label="Accounts are disabled"
            checked={true}
            id="1"
            name="accounts"
            onChange={() => { }}
          />
          <Checkbox
            label="Accounts are disabled"
            checked={false}
            id="2"
            name="accounts2"
            onChange={() => { }}
          />

        </Stack>
      ),
      onClearAll: () => { console.log("cleared"); },
      shortcut: false,
    },
    {
      key: "deliveryStatus",
      label: "发货状态",
      filter: (
        <Stack vertical>
          <Checkbox
            label="Accounts are disabled"
            checked={true}
            id="1"
            name="accounts"
            onChange={() => { }}
          />
          <Checkbox
            label="Accounts are disabled"
            checked={false}
            id="2"
            name="accounts2"
            onChange={() => { }}
          />

        </Stack>
      ),
      onClearAll: () => { console.log("cleared"); },
      shortcut: false,
    },


  ];




  return (
    <Filters
      queryValue={val}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={setQueryValue}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    />
  );
}
export { SourcingListFilter }

