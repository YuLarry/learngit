/*
 * @Author: lijunwei
 * @Date: 2022-01-18 15:00:29
 * @LastEditTime: 2022-03-15 14:22:12
 * @LastEditors: lijunwei
 * @Description: 
 */

import { DatePicker, Filters, RadioButton, Stack } from "@shopify/polaris";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProviderList, getWarehouseList } from "../../../api/requests";
import { ToastContext } from "../../../context/ToastContext";
import moment from "moment";

function DeliveryListFilter(props) {

  const {
    filter = {
      provider_id: "",
      warehouse_code: "",
      shipping_date: {
        start: new Date(),
        end: new Date(),
      },
      dateOn: false,
      common_search: "",
    },
    onChange = () => { }
  } = props
  const [common_search, setCommon_search] = useState(filter.common_search || "");
  const [pointer, setPointer] = useState(0);
  useEffect(() => {
    // use pointer to remove init triger filter onchange
    setPointer(pointer + 1);
    if (pointer > 0) {
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

  const toastContext = useContext(ToastContext);
  const [providerList, setProviderList] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);
  const [providerListMap, setProviderListMap] = useState(new Map());
  const [wareHouseListMap, setWareHouseListMap] = useState(new Map());

  const [filterData, setFilterData] = useState(filter);


  useEffect(() => {
    onChange(filterData);
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
    },
    [filterData],
  );

  // provider radio
  const providerRadios = useMemo(() =>
    providerList.map((provider => {
      const { id, business_name } = provider;
      return (
        <RadioButton
          key={`prov-${id}`}
          label={business_name}
          checked={filterData.provider_id === id}
          id={`prov-${id}`}
          name="provider"
          onChange={(checked, _id) => { filterChangeHandler("provider_id", id) }}
        />)
    }
    ))
    , [filterChangeHandler, filterData, providerList])


  // soucingCom radio
  const warehouseRadios = useMemo(() =>
    wareHouseList.map((warehouse => {
      const { code, name } = warehouse;
      return (<RadioButton
        key={`ware-${code}`}
        label={name}
        checked={filterData.warehouse_code === code}
        id={`ware-${code}`}
        name="warehouse"
        onChange={(checked, id) => { filterChangeHandler("warehouse_code", code) }}
      />)
    }
    ))
    , [filterChangeHandler, filterData.warehouse_code, wareHouseList])


  const filterConfig = useMemo(() => {
    const config = new Map();
    config.set("provider_id", { label: "?????????", type: "radio", dataPool: providerListMap, textKey: "business_name" });
    config.set("warehouse_code", { label: "????????????", type: "radio", dataPool: wareHouseListMap, textKey: "name" });
    config.set("shipping_date", { label: "????????????", type: "date" });
    return config;
  }, [providerListMap, wareHouseListMap]);


  const clearAppliedFilter = useCallback(
    (filterKey) => {
      const { type } = filterConfig.get(filterKey);
      let clearObject;
      if (type === "radio") {
        clearObject = {
          [filterKey]: null
        }
      } else if (type === "checkbox") {
        clearObject = {
          [filterKey]: new Set()
        }
      } else if (type === "date") {
        clearObject = {
          [filterKey]: {
            start: new Date(),
            end: new Date(),
          },
          dateOn: false,
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
      if (type === "date" && filterData.dateOn && filterData[key]) {
        const data = filterData[key];
        if (data.start && data.end) {
          filters.push({
            key: key,
            label: `${label}: ${moment(filterData[key].start).format("YYYY-MM-DD")}-${moment(filterData[key].end).format("YYYY-MM-DD")}`,
            onRemove: () => { clearAppliedFilter(key) }
          })
        }

      } else if (type === "radio" && filterData[key]) {
        if (!dataPool || dataPool.size === 0) break;
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
      shipping_date: {
        start: new Date(),
        end: new Date(),
      },
      dateOn: false,
      repo_status: new Set(),
    })
  }, []);

  const filters = useMemo(() =>
    [
      {
        key: "provider_id",
        label: "?????????",
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
        label: "????????????",
        filter: (
          <Stack vertical>
            {warehouseRadios}
          </Stack>
        ),
        onClearAll: () => { clearFilterItem("warehouse_code") },
        shortcut: true,
      },

      {
        key: "shipping_date",
        label: "????????????",
        filter: (
          <div>
            <DatePicker
              id="filter-date"
              month={month}
              year={year}
              onChange={
                (date) => {
                  setFilterData({
                    ...filterData,
                    shipping_date: date,
                    dateOn: true,
                  })
                }
              }
              onMonthChange={handleMonthChange}
              selected={filterData.shipping_date}
              allowRange
            />
          </div>

        ),
        onClearAll: () => { clearFilterItem("shipping_date") },
        shortcut: true,
      },


      // {
      //   key: "repo_status",
      //   label: "????????????",
      //   filter: (
      //     <Stack vertical>
      //       {repoStatusCheckboxMarkup}
      //     </Stack>
      //   ),
      //   onClearAll: () => { clearAppliedFilter("repo_status") },
      //   shortcut: true,
      // },
    ]
    ,
    [providerRadios, warehouseRadios, month, year, handleMonthChange, filterData, clearFilterItem]
  )

  useEffect(() => {
    Promise.all([
      getProviderList(),
      getWarehouseList(),
    ])
      .then(([provListRes, wareHouseRes, subjectRes]) => {
        const provMap = new Map();
        const warehMap = new Map();

        provListRes.data.map((val) => {
          provMap.set(val.id, val)
        })

        wareHouseRes.data.map((val) => {
          warehMap.set(val.code, val)
        })

        setProviderList(provListRes.data);
        setWareHouseList(wareHouseRes.data);

        setProviderListMap(provMap);
        setWareHouseListMap(warehMap);

      })
      .catch(e => {
        toastContext.toast({ message: e.message })
      })
  },
    [])



  return (
    <Filters
      queryPlaceholder="????????????/SKU/?????????????????????"
      queryValue={common_search}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={(val) => { setCommon_search(val) }}
      onQueryClear={() => { setCommon_search("") }}
      onClearAll={handleClearAll}
    />
  );
}
export { DeliveryListFilter }

