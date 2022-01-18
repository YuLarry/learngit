/*
 * @Author: lijunwei
 * @Date: 2021-11-16 14:53:36
 * @LastEditTime: 2022-01-18 16:09:42
 * @LastEditors: lijunwei
 * @Description: AppFrame menu
 */

import { Navigation } from "@shopify/polaris";
import { CartDownMajor, ShipmentMajor,InventoryMajor } from "@shopify/polaris-icons";
import { useLocation } from "react-router";


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
            url: '/sourcing',
            label: '采购实施',
            icon: CartDownMajor,
            // exactMatch: true,
            // badge: '15',
          },
          {
            url: '/delivery',
            label: '采购发货',
            icon: ShipmentMajor,
            // exactMatch: true,
            // badge: '15',
          },
          {
            url: '/repository',
            label: '采购入库',
            icon: InventoryMajor,
            // exactMatch: true,
            // badge: '15',
          },
         
          
        ]}
      />
    </Navigation>
  );
}
export { Menu }

