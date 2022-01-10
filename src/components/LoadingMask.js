/*
 * @Author: lijunwei
 * @Date: 2021-11-29 18:26:36
 * @LastEditTime: 2021-11-29 18:42:32
 * @LastEditors: lijunwei
 * @Description: 
 */

import { FstlnLoading } from "./FstlnLoading";

function LoadingMask(props) {
  
  return (
    <div style={{
      position: "fixed", 
      top: "0", 
      right: "0", 
      bottom: "0", 
      left: "0", 
      display:"flex", 
      justifyContent:"center",
      alignItems: "center",
      zIndex: "1000",
      backgroundColor:"rgba(255,255,2555,0.7)"
      }}>
      <FstlnLoading />
    </div>
  );
}
export { LoadingMask }

