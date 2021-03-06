/*
 * @Author: lijunwei
 * @Date: 2022-01-18 11:28:36
 * @LastEditTime: 2022-02-11 11:56:05
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Fragment } from "react"
import { Route } from "react-router-dom"
import { RepositoryDetail } from "./RepositoryDetail"
import { RepositoryList } from "./RepositoryList"

function SourcingRepository(props) {
  
  return(
    <Fragment>
      <Route index element={ <RepositoryList /> }></Route>
      {/* <Route path="list" element={ <RepositoryList /> }></Route> */}
      <Route path="detail/:id" element={ <RepositoryDetail /> }></Route>
    </Fragment>
  )
}
export {SourcingRepository}