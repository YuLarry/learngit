/*
 * @Author: lijunwei
 * @Date: 2021-11-23 12:28:39
 * @LastEditTime: 2021-12-20 17:24:01
 * @LastEditors: lijunwei
 * @Description: loading fallback component
 */

import { Card, Spinner } from "@shopify/polaris";

function FstlnLoading(props) {
  
  return (
    !props.square
    ? (
      <div className="full-wid-hei" style={{display: "flex", justifyContent: "center", alignItems: "center", padding: "2em"}}>
        {/* <Card> */}
          {/* <Card.Section> */}
            <Spinner />
          {/* </Card.Section> */}
        {/* </Card> */}
     </div>
    )
    : (<div className="full-wid-hei" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Spinner />
     </div>)
  );
}
export { FstlnLoading }

