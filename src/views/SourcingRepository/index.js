/*
 * @Author: lijunwei
 * @Date: 2022-01-18 11:28:36
 * @LastEditTime: 2022-01-18 12:16:53
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Fragment } from "react"
import { Route } from "react-router-dom"
import { RepositoryList } from "./RepositoryList"

function SourcingRepository(props) {
  
  return(
    <Fragment>
      <Route index element={ <RepositoryList /> }></Route>
      <Route path="List" element={ <RepositoryList /> }></Route>
    </Fragment>
  )
}
export {SourcingRepository}