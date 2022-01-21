/*
 * @Author: lijunwei
 * @Date: 2022-01-18 11:28:26
 * @LastEditTime: 2022-01-21 15:44:04
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
      <Route path="inbound/:type" element={ <DeliveryInbound /> }></Route>
    </Fragment>
  )
}
export {SourcingDelivery}