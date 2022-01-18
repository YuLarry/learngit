/*
 * @Author: lijunwei
 * @Date: 2021-11-23 12:18:22
 * @LastEditTime: 2022-01-18 11:31:41
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Fragment } from "react";
import { Route } from "react-router";

import { SourcingList } from "./SourcingList";

function SourcingManage(props) {
  
  return(
    <Fragment>
      <Route index element={ <SourcingList /> }></Route>
      <Route path="list" element={ <SourcingList /> }></Route>
    </Fragment>
  )
}
export { SourcingManage }
