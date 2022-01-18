/*
 * @Author: lijunwei
 * @Date: 2022-01-18 11:28:26
 * @LastEditTime: 2022-01-18 12:10:52
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Fragment } from "react"
import { Route } from "react-router-dom"
import { DeliveryList } from "./DeliveryList"

function SourcingDelivery(props) {
  
  return(
    <Fragment>
      <Route index element={ <DeliveryList /> }></Route>
      <Route path="List" element={ <DeliveryList /> }></Route>
    </Fragment>
  )
}
export {SourcingDelivery}