/*
 * @Author: lijunwei
 * @Date: 2021-11-23 12:18:22
 * @LastEditTime: 2022-02-11 17:11:56
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Fragment } from "react";
import { Route } from "react-router";
import { PayRequest } from "./PayRequest";
import { SourcingDetail } from "./SourcingDetail";
import { SourcingEdit } from "./SourcingEdit";

import { SourcingList } from "./SourcingList";

function SourcingOrder(props) {
  
  return(
    <Fragment>
      <Route index element={ <SourcingList /> }></Route>
      <Route path="list" element={ <SourcingList /> }></Route>
      <Route path="add" element={ <SourcingEdit /> }></Route>
      <Route path="detail/:id" element={ <SourcingDetail /> }></Route>
      <Route path="payRequest/:id" element={ <PayRequest /> }></Route>
      
    </Fragment>
  )
}
export { SourcingOrder }
