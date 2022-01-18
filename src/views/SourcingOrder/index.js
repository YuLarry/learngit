/*
 * @Author: lijunwei
 * @Date: 2021-11-23 12:18:22
 * @LastEditTime: 2022-01-18 16:13:31
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Fragment } from "react";
import { Route } from "react-router";
import { SourcingEdit } from "./SourcingEdit";

import { SourcingList } from "./SourcingList";

function SourcingOrder(props) {
  
  return(
    <Fragment>
      <Route index element={ <SourcingList /> }></Route>
      <Route path="list" element={ <SourcingList /> }></Route>
      <Route path="add" element={ <SourcingEdit /> }></Route>
    </Fragment>
  )
}
export { SourcingOrder }
