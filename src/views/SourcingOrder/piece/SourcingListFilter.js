/*
 * @Author: lijunwei
 * @Date: 2022-01-18 15:00:29
 * @LastEditTime: 2022-01-25 12:27:59
 * @LastEditors: lijunwei
 * @Description: s
 */

import { Checkbox, Filters, RadioButton, Stack, TextField } from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import { AUDIT_STATUS, DELIVERY_STATUS, PAYMENT_STATUS } from "../../../utils/StaticData";

function SourcingListFilter(props) {

  const [filterData, setFilterData] = useState({
    
    provider_id: "",
    subject_code: "",
    warehouse_code: "",
    po: "",
    good_search: "",
    audit: [],
    payment_status: [],
    delivery_status:[],
  });

  
  const filterChangeHandler = useCallback(
    (v, name) => {
      console.log(v);
      console.log(name);
    },
    [],
  );



  const [searchText, setSearchText] = useState("");
  const handleSearchTextRemove = useCallback(() => setSearchText(""), []);

  
  const [appliedFilters, setAppliedFilters] = useState([]);

  

  const handleClearAll = useCallback(() => {
    console.log('clear all');
  }, []);
  

  // audit status checkbox
  const auditStatusCheckboxMarkup = useMemo(() => {
    const checkBoxes = [];
    AUDIT_STATUS.forEach((statusVal, enty)=>{
      checkBoxes.push(
        (<Checkbox
          key={enty}
          label={statusVal}
          checked={false}
          id={enty}
          name="paymentStatus"
          onChange={(v,name) => { filterChangeHandler(v,name) }}
        />)
      )
    })
    return checkBoxes
  }, [filterChangeHandler]);

  // payment status
  const paymentStatusCheckboxMarkup = useMemo(() => {
    const checkBoxes = [];
    PAYMENT_STATUS.forEach((statusVal, enty)=>{
      checkBoxes.push(
        (<Checkbox
          key={enty}
          label={statusVal}
          checked={false}
          id={enty}
          name="paymentStatus"
          onChange={(v,name) => { filterChangeHandler(v,name) }}
        />)
      )
    })
    return checkBoxes
  }, [filterChangeHandler]);

  // delivery status
  const deliveryStatusCheckboxMarkup = useMemo(() => {
    const checkBoxes = [];
    DELIVERY_STATUS.forEach((statusVal, enty)=>{
      checkBoxes.push(
        (<Checkbox
          key={enty}
          label={statusVal}
          checked={false}
          id={enty}
          name="deliveryStatus"
          onChange={(v,name) => { filterChangeHandler(v,name) }}
        />)
      )
    })
    return checkBoxes
  }, [filterChangeHandler]);


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
          label="采购单号"
          value={filterData.po}
          onChange={filterChangeHandler}
          autoComplete="off"
          labelHidden
          id="po"
        />
      ),
      shortcut: true,
    },
    {
      key: "goodsInfo",
      label: "商品信息",
      filter: (
        <TextField
          label="Tagged with"
          value={ filterData.good_search }
          onChange={filterChangeHandler}
          autoComplete="off"
          labelHidden
          id="good_search"
        />
      ),
      shortcut: true,
    },

    {
      key: "dealStatus",
      label: "审批状态",
      filter: (
        <Stack vertical>
          { auditStatusCheckboxMarkup }
        </Stack>
      ),
      onClearAll: () => { console.log("cleared"); },
      shortcut: true,
    },

    {
      key: "payStatus",
      label: "付款状态",
      filter: (
        <Stack vertical>
          { paymentStatusCheckboxMarkup }
        </Stack>
      ),
      onClearAll: () => { console.log("cleared"); },
      shortcut: true,
    },
    {
      key: "deliveryStatus",
      label: "发货状态",
      filter: (
        <Stack vertical>
          { deliveryStatusCheckboxMarkup }
        </Stack>
      ),
      onClearAll: () => { console.log("cleared"); },
      shortcut: true,
    },


  ];


  return (
    <Filters
      queryValue={searchText}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={setSearchText}
      onQueryClear={handleSearchTextRemove}
      onClearAll={handleClearAll}
    />
  );
}
export { SourcingListFilter }

