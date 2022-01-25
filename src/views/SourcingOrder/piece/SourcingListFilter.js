/*
 * @Author: lijunwei
 * @Date: 2022-01-18 15:00:29
 * @LastEditTime: 2022-01-25 17:55:46
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Checkbox, Filters, RadioButton, Stack, TextField } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProviderList, getSubjectList, getWarehouseList } from "../../../api/requests";
import { AUDIT_STATUS, DELIVERY_STATUS, PAYMENT_STATUS } from "../../../utils/StaticData";

function SourcingListFilter(props) {

  const [providerList, setProviderList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);

  const [filterData, setFilterData] = useState({

    provider_id: "",
    subject_code: "",
    warehouse_code: "",
    po: "",
    good_search: "",
    audit: new Set(),
    payment_status: new Set(),
    delivery_status: new Set(),
  });


  const filterChangeHandler = useCallback(
    (key, value, checked) => {
      let _value;
      
      if (checked !== undefined) {
        _value = filterData[key];
        checked ? _value.add(value) : _value.delete(value)
      }else{
        _value = value;
      }

      setFilterData({ ...filterData, [key]: _value })

      // console.log(filterData);
    },
    [filterData],
  );


  const [appliedFilters, setAppliedFilters] = useState([]);



  const handleClearAll = useCallback(() => {
    console.log('clear all');
  }, []);

  // provider radio
  const providerRadios = useMemo(() =>
    providerList.map((provider => {
      const { id, business_name } = provider
      return (<RadioButton
        key={id}
        label={business_name}
        checked={filterData.provider_id === id}
        id={id}
        name="provider"
        onChange={(checked, id) => { filterChangeHandler("provider_id", id) }}
      />)
    }
    ))
    , [filterChangeHandler, filterData.provider_id, providerList])

  // soucingCom radio
  const sourcingCompanyRadios = useMemo(() =>
    subjectList.map((compay => {
      const { key, name } = compay
      return (<RadioButton
        key={key}
        label={name}
        checked={filterData.subject_code === key}
        id={key}
        name="subject"
        onChange={(checked, id) => { filterChangeHandler("subject_code", id) }}
      />)
    }
    ))
    , [filterChangeHandler, filterData.subject_code, subjectList])

  // soucingCom radio
  const warehouseRadios = useMemo(() =>
    wareHouseList.map((warehouse => {
      const { code, name } = warehouse
      return (<RadioButton
        key={code}
        label={name}
        checked={filterData.warehouse_code === code}
        id={code}
        name="warehouse"
        onChange={(checked, id) => { filterChangeHandler("warehouse_code", code) }}
      />)
    }
    ))
    , [filterChangeHandler, filterData.warehouse_code, wareHouseList])


  // audit status checkbox
  const auditStatusCheckboxMarkup = useMemo(() => {
    const checkBoxes = [];
    AUDIT_STATUS.forEach((statusLabel, entry) => {
      checkBoxes.push(
        (<Checkbox
          key={entry}
          label={statusLabel}
          checked={filterData.audit.has(entry)}
          id={entry}
          name="paymentStatus"
          onChange={(checked) => { filterChangeHandler("audit", entry, checked) }}
        />)
      )
    })
    return checkBoxes
  }, [filterChangeHandler, filterData.audit]);

  // payment status
  const paymentStatusCheckboxMarkup = useMemo(() => {
    const checkBoxes = [];
    PAYMENT_STATUS.forEach((statusLabel, entry) => {
      checkBoxes.push(
        (<Checkbox
          key={entry}
          label={statusLabel}
          checked={filterData.payment_status.has(entry)}
          id={entry}
          name="paymentStatus"
          onChange={(checked) => { filterChangeHandler("payment_status", entry, checked) }}
        />)
      )
    })
    return checkBoxes
  }, [filterChangeHandler, filterData.payment_status]);

  // delivery status
  const deliveryStatusCheckboxMarkup = useMemo(() => {
    const checkBoxes = [];
    DELIVERY_STATUS.forEach((statusLabel, entry) => {
      checkBoxes.push(
        (<Checkbox
          key={entry}
          label={statusLabel}
          checked={filterData.delivery_status.has(entry)}
          id={entry}
          name="deliveryStatus"
          onChange={(checked) => { filterChangeHandler("delivery_status", entry, checked) }}
        />)
      )
    })
    return checkBoxes
  }, [filterChangeHandler, filterData.delivery_status]);


  const filters = [
    {
      key: "provider",
      label: "供应商",
      filter: (
        <Stack vertical>
          {providerRadios}
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
          {sourcingCompanyRadios}
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
          {warehouseRadios}
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
          onChange={(val) => { filterChangeHandler("po", val) }}
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
          value={filterData.good_search}
          onChange={(val) => { filterChangeHandler("good_search", val) }}
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
          {auditStatusCheckboxMarkup}
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
          {paymentStatusCheckboxMarkup}
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
          {deliveryStatusCheckboxMarkup}
        </Stack>
      ),
      onClearAll: () => { console.log("cleared"); },
      shortcut: true,
    },


  ];

  useEffect(() => {

    Promise.all([
      getProviderList(),
      getWarehouseList(),
      getSubjectList(),
    ])
      .then(([provListRes, wareHouseRes, subjectRes]) => {
        setProviderList(provListRes.data);
        // setSubjectList(subjectRes.data);
        setWareHouseList(wareHouseRes.data);


        const formatedSubjectList = Object.keys(subjectRes.data).map((key) => {
          return {
            key,
            name: subjectRes.data[key]
          }
        })

        setSubjectList(formatedSubjectList);

      })
  },
    [])

  return (
    <Filters
      queryValue={filterData.good_search}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={(val) => { filterChangeHandler("good_search", val) }}
      onQueryClear={() => { filterChangeHandler("good_search", "") }}
      onClearAll={handleClearAll}
    />
  );
}
export { SourcingListFilter }

