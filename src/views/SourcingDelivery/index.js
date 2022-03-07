/*
 * @Author: lijunwei
 * @Date: 2022-01-18 11:28:26
 * @LastEditTime: 2022-03-04 17:10:49
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Fragment } from "react"
import { Route } from "react-router-dom"
import { DeliveryEdit } from "./DeliveryEdit"
import { DeliveryInbound } from "./DeliveryInbound"
import { DeliveryList } from "./DeliveryList"

function SourcingDelivery(props) {
  
  return(
    <Fragment>
      <Route index element={ <DeliveryList /> }></Route>
      <Route path="list" element={ <DeliveryList /> }></Route>
      <Route path="add" element={ <DeliveryEdit /> }></Route>
      <Route path="inbound" element={ <DeliveryInbound /> }></Route>
      <Route path="detail/:id" element={ <DeliveryEdit /> }></Route>
    </Fragment>
  )
}
export {SourcingDelivery}