/*
 * @Author: lijunwei
 * @Date: 2021-11-23 12:18:22
 * @LastEditTime: 2022-01-19 17:07:31
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Fragment } from "react";
import { Route } from "react-router";
import { PayRequest } from "./PayRequest";
import { SourcingEdit } from "./SourcingEdit";

import { SourcingList } from "./SourcingList";

function SourcingOrder(props) {
  
  return(
    <Fragment>
      <Route index element={ <SourcingList /> }></Route>
      <Route path="list" element={ <SourcingList /> }></Route>
      <Route path="add" element={ <SourcingEdit /> }></Route>
      <Route path="payRequest" element={ <PayRequest /> }></Route>
    </Fragment>
  )
}
export { SourcingOrder }
