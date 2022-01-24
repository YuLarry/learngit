/*
 * @Author: lijunwei
 * @Date: 2022-01-20 14:31:27
 * @LastEditTime: 2022-01-24 14:15:21
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Icon, Popover } from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import "./productInfoPopover.scss"
import {
  CaretDownMinor
} from '@shopify/polaris-icons';

function ProductInfoPopover(props) {

  const { popoverNode, tableCellText } = props

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );


  const activator = useMemo(() => (
    <div
      className="prod-activator"
      onClick={(e)=>{
        togglePopoverActive();
        e.stopPropagation()
      }}
    >
      <div className="text">

        <div>{tableCellText}</div>

      </div>
      <Icon 
        source={CaretDownMinor}
        color="subdued"
        />
    </div>
    
  ),
  [togglePopoverActive]
  );



  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
      ariaHaspopup={false}
      sectioned
      preferredAlignment="left"
    >

      { popoverNode }

    </Popover>
  );
}
export { ProductInfoPopover }


