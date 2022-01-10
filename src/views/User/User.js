/*
 * @Author: lijunwei
 * @Date: 2021-11-23 12:18:22
 * @LastEditTime: 2022-01-04 14:31:18
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Fragment } from "react";
import { Route } from "react-router";

import UserList from "./UserList";

function User(props) {
  
  return(
    <Fragment>
      <Route index element={ <UserList /> }></Route>
      <Route path="list" element={ <UserList /> }></Route>
    </Fragment>
  )
}
export { User }
