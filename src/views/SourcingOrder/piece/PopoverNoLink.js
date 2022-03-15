/*
 * @Author: lijunwei
 * @Date: 2022-03-15 11:54:30
 * @LastEditTime: 2022-03-15 12:14:36
 * @LastEditors: lijunwei
 * @Description: 
 */

import { ActionList, Button, Popover } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

function PopoverNoLink(props) {
  const { linkListOptions } = props
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const activator = (
    <Button 
      onClick={togglePopoverActive}
      plain
    >
      查看
    </Button>
  );

  const links = linkListOptions.map((item, index)=>{
    return <div style={{ lineHeight: "2em" }} key={index}><Link to={item.url}>{item.content}</Link></div>
  })


  return (
    <div>
      <Popover
        active={popoverActive}
        activator={activator}
        autofocusTarget="first-node"
        onClose={togglePopoverActive}
      >
        <div style={{ padding: "1em" }}>
          { links }
        </div>
        
      </Popover>
    </div>
  );
}
export { PopoverNoLink }