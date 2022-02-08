/*
 * @Author: lijunwei
 * @Date: 2022-01-19 14:30:33
 * @LastEditTime: 2022-02-08 12:17:03
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Checkbox, Scrollable } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./FstlnSelectTree.scss";

function FstlnSelectTree(props) {

  const { treeData, headRender, itemRowRender, onTreeSelectChange } = props;

  const [selectedItems, setSelectedItems] = useState(new Map());



  const headChangeHandler = useCallback(
    (val, key) => {
      console.log(key);
      const _tempSelected = new Map(selectedItems);
      treeData[key].map((item) => {
        if (val) {
          _tempSelected.set(item.sku, item);
        } else if (_tempSelected.has(item.sku)) {
          _tempSelected.delete(item.sku);
        }
      })
      setSelectedItems(_tempSelected);
    },
    [selectedItems, treeData],
  );
  const rowChangeHandler = useCallback(
    (val, item) => {
      const _tempSelected = new Map(selectedItems);
      if (val) {
        _tempSelected.set(item.sku, item);
      } else if (_tempSelected.has(item.sku)) {
        _tempSelected.delete(item.sku);
      }
      setSelectedItems(_tempSelected);
    },
    [selectedItems],
  );

  const computeHeadsCheckedStatus = useMemo(() => {
    const rlt = {};
    const keyCount = {};
    Object.keys(treeData).map((key) => {
      keyCount[key] = 0;
    })

    selectedItems.forEach((item, sku) => {
      keyCount[item["headKey"]] += 1
    })
    
    Object.keys(treeData).map((key) => {
      if( keyCount[key] === treeData[key].length ){
        rlt[key] = true;
      }else if( keyCount[key] > 0 && keyCount[key] < treeData[key].length ){
        rlt[key] = "indeterminate"
      }else{
        rlt[key] = false
      }
    })
    return rlt
  }, [selectedItems, treeData])

  const rowsTemp = useMemo(() =>
    Object.keys(treeData).map((key) => {
      
      const innerLis = treeData[key].map((item) =>{
        // set headkey for compute counts
        item["headKey"] = key;
        return (
          <li className="fcsl-li" key={item.sku}>
          <label className="fcsl-item">
            <Checkbox
              checked={selectedItems.has(item.sku)}
              onChange={(v) => { rowChangeHandler(v, item) }}

            />
            <div className="fcsl-row">
              {itemRowRender(item.cn_name)}
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
              checked={ checkedVal }
              onChange={(v) => { headChangeHandler(v, key) }}
            />
            <div className="fcsl-head">
              {headRender(key)}
            </div>
          </label>
          <ul className="fcsl-ul">
            {innerLis}
          </ul>
        </li >)
    })
    ,
    [computeHeadsCheckedStatus, headChangeHandler, headRender, itemRowRender, rowChangeHandler, selectedItems, treeData]
  )

  useEffect(() => {
    onTreeSelectChange( selectedItems )
  }, [onTreeSelectChange, selectedItems]);

  return (
    <div className="f-collapsed-select-list">
      <Scrollable shadow style={{ maxHeight: "60vh", overflowX: "hidden" }}>

        <ul className="fcsl-ul">
          {rowsTemp}
          {/* <li className="fcsl-li">
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
        </li> */}



        </ul>
      </Scrollable>

    </div>
  );
}
export { FstlnSelectTree }



