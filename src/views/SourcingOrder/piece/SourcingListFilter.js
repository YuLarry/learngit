/*
 * @Author: lijunwei
 * @Date: 2022-01-18 15:00:29
 * @LastEditTime: 2022-03-09 16:47:02
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Checkbox, Filters, RadioButton, Stack } from "@shopify/polaris";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProviderList, getSubjectList, getWarehouseList } from "../../../api/requests";
import { ToastContext } from "../../../context/ToastContext";
import { AUDIT_STATUS, DELIVERY_STATUS, PAYMENT_STATUS } from "../../../utils/StaticData";

function SourcingListFilter(props) {

  const { filter = {
    provider_id: "",
    subject_code: "",
    warehouse_code: "",
    po: "",
    common_search: "",
    audit_status: new Set(),
    payment_status: new Set(),
    delivery_status: new Set(),
  }, onChange = ()=>{} } = props
  const [common_search, setCommon_search] = useState(filter.common_search || "");

  const toastContext = useContext(ToastContext);
  const [providerList, setProviderList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);
  const [providerListMap, setProviderListMap] = useState(new Map());
  const [subjectListMap, setSubjectListMap] = useState(new Map());
  const [wareHouseListMap, setWareHouseListMap] = useState(new Map());

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
        key={`prov-${id}`}
        label={business_name}
        checked={filterData.provider_id === id}
        id={`prov-${id}`}
        name="provider"
        onChange={(checked) => { filterChangeHandler("provider_id", id) }}
      />)
    }
    ))
    , [filterChangeHandler, filterData.provider_id, providerList])

  // soucingCom radio
  const sourcingCompanyRadios = useMemo(() =>
    subjectList.map((compay => {
      const { key, name } = compay
      return (<RadioButton
        key={`comp-${key}`}
        label={name}
        checked={filterData.subject_code === key}
        id={`comp-${key}`}
        name="subject"
        onChange={(checked) => { filterChangeHandler("subject_code", key) }}
      />)
    }
    ))
    , [filterChangeHandler, filterData.subject_code, subjectList])

  // soucingCom radio
  const warehouseRadios = useMemo(() =>
    wareHouseList.map((warehouse => {
      const { code, name } = warehouse
      return (<RadioButton
        key={`ware-${code}`}
        label={name}
        checked={filterData.warehouse_code === code}
        id={`ware-${code}`}
        name="warehouse"
        onChange={(checked) => { filterChangeHandler("warehouse_code", code) }}
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
          key={`stat-${entry}`}
          label={statusLabel}
          checked={filterData.audit_status.has(entry)}
          id={`stat-${entry}`}
          name="paymentStatus"
          onChange={(checked) => { filterChangeHandler("audit_status", entry, checked) }}
        />)
      )
    })
    return checkBoxes
  }, [filterChangeHandler, filterData.audit_status]);

  // payment status
  const paymentStatusCheckboxMarkup = useMemo(() => {
    const checkBoxes = [];
    PAYMENT_STATUS.forEach((statusLabel, entry) => {
      checkBoxes.push(
        (<Checkbox
          key={`stat-pay-${entry}`}
          label={statusLabel}
          checked={filterData.payment_status.has(entry)}
          id={`stat-pay-${entry}`}
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
          key={`stat-dly-${entry}`}
          label={statusLabel}
          checked={filterData.delivery_status.has(entry)}
          id={`stat-dly-${entry}`}
          name="deliveryStatus"
          onChange={(checked) => { filterChangeHandler("delivery_status", entry, checked) }}
        />)
      )
    })
    return checkBoxes
  }, [filterChangeHandler, filterData.delivery_status]);


  const filterConfig = useMemo(() => {
    const config = new Map();
    config.set("provider_id", { label: "?????????", type: "radio", dataPool: providerListMap, textKey: "business_name" });
    config.set("subject_code", { label: "?????????", type: "radio", dataPool: subjectListMap, textKey: null });
    config.set("warehouse_code", { label: "????????????", type: "radio", dataPool: wareHouseListMap, textKey: "name" });
    // config.set("po"             , {label: "????????????", type:"textfield"});
    config.set("audit_status", { label: "????????????", type: "checkbox", dataPool: AUDIT_STATUS });
    config.set("payment_status", { label: "????????????", type: "checkbox", dataPool: PAYMENT_STATUS });
    config.set("delivery_status", { label: "????????????", type: "checkbox", dataPool: DELIVERY_STATUS });
    return config;
  }, [providerListMap, subjectListMap, wareHouseListMap]);


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
      }
      setFilterData(Object.assign({}, filterData, clearObject))
    },
    [filterConfig, filterData],
  );

  const appliedFilters = useMemo(() => {
    const filters = [];
    for (const key of filterConfig.keys()) {
      const { type, label, dataPool } = filterConfig.get(key);
      if( !dataPool || dataPool.size === 0 ) break;
      if (type === "radio" && filterData[key]) {
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
    [filterConfig, filterData])


  const handleClearAll = useCallback(() => {
    setFilterData({
      provider_id: "",
      subject_code: "",
      warehouse_code: "",
      audit_status: new Set(),
      payment_status: new Set(),
      delivery_status: new Set(),
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
        key: "subject_code",
        label: "?????????",
        filter: (
          <Stack vertical>
            {sourcingCompanyRadios}
          </Stack>
        ),
        onClearAll: () => { clearFilterItem("subject_code") },
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
        key: "audit_status",
        label: "????????????",
        filter: (
          <Stack vertical>
            {auditStatusCheckboxMarkup}
          </Stack>
        ),
        onClearAll: () => { clearFilterItem("audit_status") },
        shortcut: true,
      },

      {
        key: "payment_status",
        label: "????????????",
        filter: (
          <Stack vertical>
            {paymentStatusCheckboxMarkup}
          </Stack>
        ),
        onClearAll: () => { clearFilterItem("payment_status") },
        shortcut: true,
      },
      {
        key: "delivery_status",
        label: "????????????",
        filter: (
          <Stack vertical>
            {deliveryStatusCheckboxMarkup}
          </Stack>
        ),
        onClearAll: () => { clearAppliedFilter("delivery_status") },
        shortcut: true,
      },


    ]
    , [auditStatusCheckboxMarkup, clearAppliedFilter, clearFilterItem, deliveryStatusCheckboxMarkup, paymentStatusCheckboxMarkup, providerRadios, sourcingCompanyRadios, warehouseRadios]);

    
  useEffect(() => {
    Promise.all([
      getProviderList(),
      getWarehouseList(),
      getSubjectList(),
    ])
      .then(([provListRes, wareHouseRes, subjectRes]) => {
        const subjMap = new Map();
        const provMap = new Map();
        const warehMap = new Map();

        const formatedSubjectList = Object.keys(subjectRes.data).map((key) => {
          subjMap.set(key, subjectRes.data[key])
          return {
            key,
            name: subjectRes.data[key]
          }
        })

        provListRes.data.map((val) => {
          provMap.set(val.id, val)
        })

        wareHouseRes.data.map((val) => {
          warehMap.set(val.code, val)
        })

        setSubjectList(formatedSubjectList);
        setProviderList(provListRes.data);
        setWareHouseList(wareHouseRes.data);

        setSubjectListMap(subjMap);
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

  return (
    <Filters
      queryPlaceholder="????????????/??????SKU/???????????????????????????"
      queryValue={common_search}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={(val) => { setCommon_search(val) }}
      onQueryClear={() => { setCommon_search("") }}
      onClearAll={handleClearAll}
    />
  );
}
export { SourcingListFilter }

