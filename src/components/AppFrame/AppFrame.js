/*
 * @Author: lijunwei
 * @Date: 2021-11-15 17:53:07
 * @LastEditTime: 2022-01-10 17:16:42
 * @LastEditors: lijunwei
 * @Description: Fame component
 */

import { Suspense } from "react";
import { Frame } from "@shopify/polaris";
import { Outlet, Route, Routes, useLocation, } from "react-router";
import { Header } from "./Header";
import { Menu } from "./Menu";

import { NotFound } from "../../views/404/NotFound";

import { User } from "../../views/User/User";
// import { FstlnLoading } from "../FstlnLoading";
import { RequireAuth } from "../RequireAuth";
import { FstlnSkeleton } from "../FstlnSkeleton";
// import { config, useTransition } from "@react-spring/core";
// import { animated } from "@react-spring/web";
import { ax } from "../../utils/FstlnAxios";
import { getToken } from "../../utils/Tools";

function AppFrame(props) {

  // const transitions = useTransition(location, {
  //   from: {
  //     opacity: 0,
  //     scale: 1,
  //     y: 20
  //   },
  //   enter: {
  //     opacity: 1,
  //     scale: 1,
  //     y: 0
  //   },
  //   leave: {
  //     opacity: 0.3,
  //     scale: 0.9,
  //     y: 0
  //   },
  //   config: {
  //     ...config.default,
  //     duration: 300,
  //   }
  // })

  ax.defaults.headers.common["x-fstln-token"] = getToken()

  return (
    // <RequireAuth>
      <Frame
        topBar={<Header />}
        navigation={<Menu />}
      >
          <div className="full-wid-hei">
            {/* {
              transitions((style, item) => {
                return ( */}
                  <Suspense fallback={<FstlnSkeleton />}>
                    {/* <animated.div style={{ ...style, position: "absolute", width: "100%" }}> */}

                      <Routes>
                        {/* <Route path="Home" element={<Home />}></Route> */}
                        <Route path="">
                        { User() }
                        </Route>
                        <Route path="users">
                          { User() }
                        </Route>
                       
                        <Route path="*" element={<NotFound />} />
                      </Routes>

                    {/* </animated.div> */}
                  </Suspense>
               
          </div>
          <Outlet />
      </Frame>
    // </RequireAuth>
  );
}
export { AppFrame }
