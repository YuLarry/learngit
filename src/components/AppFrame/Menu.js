/*
 * @Author: lijunwei
 * @Date: 2021-11-16 14:53:36
 * @LastEditTime: 2022-01-18 11:24:15
 * @LastEditors: lijunwei
 * @Description: AppFrame menu
 */

import { Navigation } from "@shopify/polaris";
import { CustomersMajor } from "@shopify/polaris-icons";
import { useLocation } from "react-router";
import { SegmentIcon } from "../../icon/SegmentIcon";


function Menu(props) {
  
  const { pathname } = useLocation()
  
  return (
    <Navigation location={ pathname }>
      <Navigation.Section
        items={[
          // {
          //   url: '/Home',
          //   label: 'Home',
          //   icon: HomeMajor,
          //   matchPaths:[
          //     "/Home",
          //   ]
          //   // exactMatch: true,
          // },
          
          {
            url: '/SourcingManage',
            label: '采购实施',
            icon: CustomersMajor,
            // exactMatch: true,
            // badge: '15',
          },
         
          
        ]}
      />
    </Navigation>
  );
}
export { Menu }

