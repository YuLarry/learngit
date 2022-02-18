/*
 * @Author: lijunwei
 * @Date: 2022-01-18 15:00:29
 * @LastEditTime: 2022-02-18 12:12:13
 * @LastEditors: lijunwei
 * @Description: s
 */

import { Checkbox, DatePicker, Filters, RadioButton, Stack } from "@shopify/polaris";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProviderList, getWarehouseList } from "../../../api/requests";
import { ToastContext } from "../../../context/ToastContext";
import { REPO_STATUS } from "../../../utils/StaticData";
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
      repo_status: new Set(),

    },
    onChange = () => { }
  } = props

  const toastContext = useContext(ToastContext);
  const [providerList, setProviderList] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);
  const [providerListMap, setProviderListMap] = useState(new Map());
  const [wareHouseListMap, setWareHouseListMap] = useState(new Map());

  const [filterData, setFilterData] = useState(filter);

  const [common_search, setCommon_search] = useState("");


  useEffect(() => {
    onChange(filterData)
  }, [filterData, onChange]);

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


  // repo status checkbox
  const repoStatusCheckboxMarkup = useMemo(() => {
    const checkBoxes = [];
    REPO_STATUS.forEach((statusLabel, entry) => {
      checkBoxes.push(
        (<Checkbox
          key={entry}
          label={statusLabel}
          checked={filterData.repo_status.has(entry)}
          id={entry}
          name="paymentStatus"
          onChange={(checked) => { filterChangeHandler("repo_status", entry, checked) }}
        />)
      )
    })
    return checkBoxes
  }, [filterChangeHandler, filterData.repo_status]);




  const filterConfig = useMemo(() => {
    const config = new Map();
    config.set("provider_id", { label: "供应商", type: "radio", dataPool: providerListMap, textKey: "business_name" });
    config.set("warehouse_code", { label: "收货仓库", type: "radio", dataPool: wareHouseListMap, textKey: "name" });
    config.set("shipping_date", { label: "发货日期", type: "date" });
    config.set("repo_status", { label: "预报状态", type: "checkbox", dataPool: REPO_STATUS });
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
      }else if (type === "date") {
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
        // console.log(filterData[key])
        const data = filterData[key];
        if (data.start && data.end) {
          filters.push({
            key: key,
            label: `${label}: ${moment(filterData[key].start).format("YYYY-MM-DD")}-${moment(filterData[key].end).format("YYYY-MM-DD")}`,
            onRemove: () => { clearAppliedFilter(key) }
          })
        }

      }else if (type === "radio" && filterData[key]) {
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
        key: "shipping_date",
        label: "发货日期",
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
      //   label: "预报状态",
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

  return (
    <Filters
      queryPlaceholder="发货单号/SKU/中英文名称搜索"
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

