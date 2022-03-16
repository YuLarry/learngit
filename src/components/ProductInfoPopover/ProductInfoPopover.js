/*
 * @Author: lijunwei
 * @Date: 2022-01-20 14:31:27
 * @LastEditTime: 2022-03-16 16:15:16
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Icon, Popover } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./productInfoPopover.scss"
import {
  CaretDownMinor
} from '@shopify/polaris-icons';

function ProductInfoPopover(props) {

  const { popoverNode, children } = props

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );


  const activator = useMemo(() => (
    <div
      className="prod-activator"
      onClick={(e) => {
        togglePopoverActive();
        // e.stopPropagation()
      }}
    >
      <div className="text">
        {children}
      </div>
      <Icon
        source={CaretDownMinor}
        color="subdued"
      />
    </div>

  ),
    [children, togglePopoverActive]
  );

  return (
    <Popover
      active={popoverNode ? popoverActive : false}
      activator={activator}
      onClose={togglePopoverActive}
      ariaHaspopup={false}
      sectioned
      preferredAlignment="left"
    >
      {popoverNode}
    </Popover>
  );
}
export { ProductInfoPopover }


