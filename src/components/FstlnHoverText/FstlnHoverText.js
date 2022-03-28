/*
 * @Author: lijunwei
 * @Date: 2022-03-28 12:13:37
 * @LastEditTime: 2022-03-28 14:09:53
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Popover } from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import "./FstlnHoverText.scss";

function FstlnHoverText(props) {
  
  const { popoverNode, children } = props

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    ( val ) => setPopoverActive( val ),
    [],
  );


  const activator = useMemo(() => (
    <div
      className="prod-activator"
      onMouseEnter={(e) => {
        togglePopoverActive(true);
      }}
      onMouseLeave={(e) => {
        togglePopoverActive(false);
      }}
     
    >
      <div className="text">
        {children}
      </div>
    </div>

  ),
    [children, togglePopoverActive]
  );

  return (
    <Popover
      active={popoverNode ? popoverActive : false}
      activator={activator}
      onClose={()=>{ togglePopoverActive(false) }}
      ariaHaspopup={false}
      sectioned
      preferredAlignment="center"

    >
      {popoverNode}
    </Popover>
  );
}
export { FstlnHoverText }