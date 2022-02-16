/*
 * @Author: lijunwei
 * @Date: 2022-01-18 15:00:29
 * @LastEditTime: 2022-02-16 19:17:28
 * @LastEditors: lijunwei
 * @Description: s
 */

import { Checkbox, DatePicker, Filters, RadioButton, Stack } from "@shopify/polaris";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getClientAccount, getProviderList, getWarehouseArea, getWarehouseList } from "../../../api/requests";
import { ToastContext } from "../../../context/ToastContext";
import { REPO_STATUS } from "../../../utils/StaticData";


function RepositoryListFilter(props) {
  const toastContext = useContext(ToastContext);

  const {
    filter = {
      provider_id: "",
      warehouse_code: "",
      shipping_date: null,
      common_search: "",
      client_account_code: "",
      warehouse_area: "",
      // repo_status: new Set(),
    },
    onChange = () => { }
  } = props

  const [common_search, setCommon_search] = useState("");
  
  const [pointer, setPointer] = useState(0);
  useEffect(() => {
    // use pointer to remove init triger filter onchange
    setPointer( pointer + 1);
    if( pointer > 0 ){
      const timer = setTimeout(() => {
        onChange({
          ...filter,
          common_search
        })
      }, 1000);
      return () => {
        clearTimeout(timer)
      }
    }
  }, [common_search]);
  


  const [providerListMap, setProviderListMap] = useState(new Map());
  const [wareHouseListMap, setWareHouseListMap] = useState(new Map());
  const [clientListMap, setClientListMap] = useState(new Map());
  const [warehouseAreaMap, setWarehouseAreaMap] = useState(new Map());


  const providerList = useMemo(() => {
    const arr = [];
    for (const [key, item] of providerListMap) {
      arr.push(item);
    }
    return arr;
  },
    [providerListMap])

  const wareHouseList = useMemo(() => {
    const arr = [];
    for (const [key, item] of wareHouseListMap) {
      arr.push(item);
    }
    return arr;
  },
    [wareHouseListMap])

  const [filterData, setFilterData] = useState(filter);

  useEffect(() => {
    onChange(filterData)
  }, [filterData]);

  const filterChangeHandler = useCallback(
    (key, value, checked) => {
      let _value;

      if (checked !== undefined) {
        _value = filterData[key];
        checked ? _value.add(value) : _value.delete(value)
      } else {
        _value = value;
      }

      setFilterData({ ...filterData, [key]: _value })

      // console.log(filterData);
    },
    [filterData],
  );

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

  // soucingCom radio
  const clientRadios = useMemo(() => {
    const arr = [];
    for (const [code, name] of clientListMap) {
      arr.push(<RadioButton
        key={code}
        label={name}
        checked={filterData.client_account_code === code}
        id={code}
        name="client_account_code"
        onChange={(checked, id) => { filterChangeHandler("client_account_code", code) }}
      />)
    }
    return arr;
  }
    , [clientListMap, filterChangeHandler, filterData.client_account_code])


    const warehouseAreaRadios = useMemo(() => {
      const arr = [];
      for (const [code, name] of warehouseAreaMap) {
        arr.push(<RadioButton
          key={code}
          label={name}
          checked={filterData.warehouse_area === code}
          id={code}
          name="warehouse_area"
          onChange={(checked, id) => { filterChangeHandler("warehouse_area", code) }}
        />)
      }
      return arr;
    }
      , [warehouseAreaMap, filterChangeHandler, filterData.warehouse_area])


  const filterConfig = useMemo(() => {
    const config = new Map();
    config.set("provider_id", { label: "供应商", type: "radio", dataPool: providerListMap, textKey: "business_name" });
    config.set("warehouse_code", { label: "收货仓库", type: "radio", dataPool: wareHouseListMap, textKey: "name" });
    config.set("shipping_date", { label: "发货日期", type: "date" });
    config.set("client_account_code", { label: "货主", type: "radio", dataPool: clientListMap, textKey: null });
    config.set("warehouse_area", { label: "货区", type: "radio", dataPool: warehouseAreaMap, textKey: null });

    return config;
  }, [clientListMap, providerListMap, wareHouseListMap, warehouseAreaMap]);


  const clearAppliedFilter = useCallback(
    (filterKey) => {
      const { type } = filterConfig.get(filterKey);
      let clearObject;
      if (type === "radio" || type === "date") {
        clearObject = {
          [filterKey]: null
        }
      } else if (type === "checkbox") {
        clearObject = {
          [filterKey]: new Set()
        }
      }
      setFilterData(Object.assign({}, filterData, clearObject))
    },
    [filterConfig, filterData],
  );

  const appliedFilters = useMemo(() => {
    const filters = [];
    for (const key of filterConfig.keys()) {
      const { type, label, dataPool } = filterConfig.get(key);
      if (type === "date" && filterData[key]) {
        filters.push({
          key: key,
          label: `${label}: ${filterData[key]}`,
          onRemove: () => { clearAppliedFilter(key) }
        })
      }
      else if (type === "radio" && filterData[key]) {
        const { textKey } = filterConfig.get(key);

        const _temObj = dataPool.get(filterData[key]);

        const text = textKey === null ? _temObj : _temObj[textKey];
        filters.push({
          key: key,
          label: `${label}: ${text}`,
          onRemove: () => { clearAppliedFilter(key) }
        })
      } else if (type === "checkbox" && filterData[key].size > 0) {
        const text = [...filterData[key]].map((item) => dataPool.get(item)).join(",")
        filters.push({
          key: key,
          label: `${label}: ${text}`,
          onRemove: () => { clearAppliedFilter(key) }
        })
      }

    }
    return filters;
  }, [clearAppliedFilter, filterConfig, filterData])


  const clearFilterItem = useCallback((key) => {
    setFilterData({ ...filterData, [key]: filterConfig.get(key).type === "radio" ? null : new Set() })
  },
    [filterConfig, filterData]
  )

  const [{ month, year }, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    [],
  );

  const handleClearAll = useCallback(() => {
    setFilterData({
      provider_id: "",
      warehouse_code: "",
      shipping_date: null,
      // repo_status: new Set(),
    })
  }, []);

  const filters = useMemo(() =>
    [
      {
        key: "provider_id",
        label: "供应商",
        filter: (
          <Stack vertical>
            {providerRadios}
          </Stack>
        ),
        onClearAll: () => { clearFilterItem("provider_id") },
        shortcut: true,
      },

      {
        key: "warehouse_code",
        label: "收货仓库",
        filter: (
          <Stack vertical>
            {warehouseRadios}
          </Stack>
        ),
        onClearAll: () => { clearFilterItem("warehouse_code") },
        shortcut: true,
      },

      {
        key: "create_date",
        label: "创建时间",
        filter: (
          <div>
            <DatePicker
              id="filter-date"
              month={month}
              year={year}
              onChange={({ start }) => { filterChangeHandler("shipping_date", start) }}
              onMonthChange={handleMonthChange}
              selected={filterData.shipping_date}
              allowRange={false}
            />
          </div>

        ),
        onClearAll: () => { clearFilterItem("shipping_date") },
        shortcut: true,
      },


      {
        key: "client_account_code",
        label: "货主",
        filter: (
          <Stack vertical>
            {clientRadios}
          </Stack>
        ),
        onClearAll: () => { clearFilterItem("client_account_code") },
        shortcut: true,
      },
      {
        key: "warehouse_area",
        label: "货区",
        filter: (
          <Stack vertical>
            {warehouseAreaRadios}
          </Stack>
        ),
        onClearAll: () => { clearFilterItem("warehouse_area") },
        shortcut: true,
      },


    ]
    ,
    [providerRadios, warehouseRadios, month, year, handleMonthChange, filterData.shipping_date, clientRadios, warehouseAreaRadios, clearFilterItem, filterChangeHandler]
  )

  useEffect(() => {
    Promise.all([
      getProviderList(),
      getWarehouseList(),
      getClientAccount(),
      getWarehouseArea()
    ])
      .then(([provListRes, wareHouseRes, clientRes, warehouseRes]) => {
        const provMap = new Map();
        const warehMap = new Map();
        const clientMap = new Map(Object.entries(clientRes.data));
        const warehouseMap = new Map(Object.entries(warehouseRes.data));

        provListRes.data.map((val) => {
          provMap.set(val.id, val)
        })

        wareHouseRes.data.map((val) => {
          warehMap.set(val.code, val)
        })


        // setProviderList(provListRes.data);
        // setWareHouseList(wareHouseRes.data);

        setProviderListMap(provMap);
        setWareHouseListMap(warehMap);

        setClientListMap(clientMap);
        setWarehouseAreaMap(warehouseMap);

      })
      .catch(e => {
        toastContext.toast({ message: e.message })
      })
  },
    [])

  return (
    <Filters
      queryPlaceholder="入库单号/SKU/中英文名称搜索"
      queryValue={common_search}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={(val) => { setCommon_search(val) }}
      onQueryClear={() => { setCommon_search("") }}
      onClearAll={handleClearAll}
    />
  );
}
export { RepositoryListFilter }

