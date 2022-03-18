/*
 * @Author: lijunwei
 * @Date: 2022-01-19 14:30:33
 * @LastEditTime: 2022-03-18 11:49:00
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Checkbox, Scrollable } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./FstlnSelectTree.scss";

function FstlnSelectTree(props) {

  const { 
    identifier = item => item.sku, 
    treeData, 
    treeHeadRender, 
    treeRowRender, 
    onTreeSelectChange, 
    childrenResolver = (item) => item,
    selectValidtor = ()=> true,
  } = props;

  const _treeData = useMemo(() => {
    const obj = {};
    for (const key in treeData) {
      if( treeData[key] ){
        obj[key] = treeData[key]
      }
    }
    return obj;
  }
  ,[treeData])

  const [selectedItems, setSelectedItems] = useState(new Map());

  const changeSelectedItems = useCallback(
    (_tempSelected) => {
      const rlt = selectValidtor( _tempSelected );
      // console.log(rlt);
      if( selectValidtor( _tempSelected ) ) {
        setSelectedItems(_tempSelected);
      }
    },
    [selectValidtor],
  );

  const headChangeHandler = useCallback(
    (val, key) => {
      // console.log(key);
      const _tempSelected = new Map(selectedItems);
      const children = childrenResolver(_treeData[key])
      children.map((item) => {
        if (val) {
          _tempSelected.set(identifier(item), item);
        } else if (_tempSelected.has(identifier(item))) {
          _tempSelected.delete(identifier(item));
        }
      })
      changeSelectedItems( _tempSelected );
    },
    [changeSelectedItems, childrenResolver, identifier, selectedItems, _treeData],
  );
  const rowChangeHandler = useCallback(
    (val, item) => {
      const _tempSelected = new Map(selectedItems);
      if (val) {
        _tempSelected.set(identifier(item), item);
      } else if (_tempSelected.has(identifier(item))) {
        _tempSelected.delete(identifier(item));
      }
      changeSelectedItems( _tempSelected );
    },
    [changeSelectedItems, identifier, selectedItems],
  );

  const computeHeadsCheckedStatus = useMemo(() => {
    const rlt = {};
    const keyCount = {};
    Object.keys(_treeData).map((key) => {
      keyCount[key] = 0;
    })

    selectedItems.forEach((item, sku) => {
      keyCount[item["headKey"]] += 1
    })

    Object.keys(_treeData).map((key) => {
      const children = childrenResolver(_treeData[key])
      if (keyCount[key] === children.length) {
        rlt[key] = true;
      } else if (keyCount[key] > 0 && keyCount[key] < children.length) {
        rlt[key] = "indeterminate"
      } else {
        rlt[key] = false
      }
    })
    return rlt
  }, [childrenResolver, selectedItems, _treeData])

  const rowsTemp = useMemo(() =>
    Object.keys(_treeData).map((key) => {
      const children = childrenResolver(_treeData[key]);

      if( !treeHeadRender(key, _treeData[key], children) ) return null;

      const innerLis = children.map((item) => {
        // set headkey for compute counts
        item["headKey"] = key;
        if( !treeRowRender(item) ) return null;
        return (
          <li className="fcsl-li" key={identifier(item)}>
            <label className="fcsl-item">
              <Checkbox
                checked={selectedItems.has(identifier(item))}
                onChange={(v) => { rowChangeHandler(v, item) }}

              />
              <div className="fcsl-row">
                {treeRowRender(item)}
              </div>
            </label>
          </li>
        )
      })

      const checkedVal = computeHeadsCheckedStatus[key];

      return (
        <li className="fcsl-li" key={key}>
          <label className="fcsl-item">
            <Checkbox
              checked={checkedVal}
              onChange={(v) => { headChangeHandler(v, key) }}
            />
            <div className="fcsl-head">
              {treeHeadRender(key, _treeData[key], children)}
            </div>
          </label>
          <ul className="fcsl-ul">
            {innerLis}
          </ul>
        </li >)
    })
    ,
    [childrenResolver, computeHeadsCheckedStatus, headChangeHandler, treeHeadRender, treeRowRender, rowChangeHandler, selectedItems, _treeData]
  )

  useEffect(() => {
    onTreeSelectChange(selectedItems)
  }, [onTreeSelectChange, selectedItems]);

  return (
    <div className="f-collapsed-select-list">
      <Scrollable shadow style={{ maxHeight: "60vh", overflowX: "hidden" }}>

        <ul className="fcsl-ul">
          {rowsTemp}
          { /* <li className="fcsl-li">
          <div className="fcsl-item">
            <Checkbox
              checked={false}
              onChange={(v) => { console.log(v) }}

            />
            <div className="fcsl-head">
              head content
            </div>
          </div>
          <ul className="fcsl-ul">
            <li className="fcsl-item">
              <Checkbox
                checked={false}
                onChange={(v) => { console.log(v) }}

              />
              <div className="fcsl-row">
                <div> row content  </div>
              </div>
            </li>
            <li className="fcsl-item">
              <Checkbox
                checked={false}
                onChange={(v) => { console.log(v) }}

              />
              <div className="fcsl-row">
                <div> row content  </div>
              </div>
            </li>
            <li className="fcsl-item">
              <Checkbox
                checked={false}
                onChange={(v) => { console.log(v) }}

              />
              <div className="fcsl-row">
                <div> row content  </div>
              </div>
            </li>
          </ul>
        </li>

        <li className="fcsl-li">
          <div className="fcsl-item">
            <Checkbox
              checked={false}
              onChange={(v) => { console.log(v) }}

            />
            <div className="fcsl-head">
              head content
            </div>
          </div>
          <ul className="fcsl-ul">
            <li className="fcsl-item">
              <Checkbox
                checked={false}
                onChange={(v) => { console.log(v) }}

              />
              <div className="fcsl-row">
                <div> row content  </div>
              </div>
            </li>
            <li className="fcsl-item">
              <Checkbox
                checked={false}
                onChange={(v) => { console.log(v) }}

              />
              <div className="fcsl-row">
                <div> row content  </div>
              </div>
            </li>
            <li className="fcsl-item">
              <Checkbox
                checked={false}
                onChange={(v) => { console.log(v) }}

              />
              <div className="fcsl-row">
                <div> row content  </div>
              </div>
            </li>
          </ul>
        </li>


        <li className="fcsl-li">
          <div className="fcsl-item">
            <Checkbox
              checked={false}
              onChange={(v) => { console.log(v) }}

            />
            <div className="fcsl-head">
              head content
            </div>
          </div>
          <ul className="fcsl-ul">
            <li className="fcsl-item">
              <Checkbox
                checked={false}
                onChange={(v) => { console.log(v) }}

              />
              <div className="fcsl-row">
                <div> row content  </div>
              </div>
            </li>
            <li className="fcsl-item">
              <Checkbox
                checked={false}
                onChange={(v) => { console.log(v) }}

              />
              <div className="fcsl-row">
                <div> row content  </div>
              </div>
            </li>
            <li className="fcsl-item">
              <Checkbox
                checked={false}
                onChange={(v) => { console.log(v) }}

              />
              <div className="fcsl-row">
                <div> row content  </div>
              </div>
            </li>
          </ul>
        </li> */
          }

        </ul>
      </Scrollable>

    </div>
  );
}
export { FstlnSelectTree }



