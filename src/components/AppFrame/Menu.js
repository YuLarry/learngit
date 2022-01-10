/*
 * @Author: lijunwei
 * @Date: 2021-11-16 14:53:36
 * @LastEditTime: 2022-01-10 17:33:16
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
            url: '/users',
            label: 'Users',
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

