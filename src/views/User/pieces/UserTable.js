/*
 * @Author: lijunwei
 * @Date: 2021-12-18 16:54:24
 * @LastEditTime: 2021-12-31 18:58:31
 * @LastEditors: lijunwei
 * @Description: 
 */

import {  DataTable, Pagination } from "@shopify/polaris";
import { useMemo, useState } from "react";
import "./UserTable.scss"

function UserTable(props) {
  const { rows, pageStatus, pageIndexChange } = props;
  const [tableOrder] = useState([
    "username",
    "email",
    "order_count",
    "order_spend_sum",
  ]);


  const formatData = (data) => {
    const rlt = [];
    data && data.map((item) => {
      const rw = [];
      tableOrder.map((orderItem) => {
        rw.push(
          item[orderItem]
        )
      })
      rlt.push(rw);
    })
    return rlt;
  }


  const dataFormat = useMemo(() => {
    return formatData(rows);
  }, [rows]);


  const rowsMarkup = useMemo(() => {
    return dataFormat.map((item) => {
      const email = item.splice(1, 1);
      // console.log(item);
      item[0] = (
        <div>
          <div className={"fstln-table-main-link"}>
            {item[0] || email}
          </div>
          {/* <div className={"fstln-table-main-link"}>
        {email}
        </div> */}
          <span>
            {item[0] ? email : ""}
          </span>
        </div>)
      item[1] = `${item[1]} orders`
      item[2] = `$${item[2]} spent`

      return item;
    })
  }, [dataFormat]);

  return (
    <div className="f-user-table">
      {
        (rows && rows.length > 0)
        ? <DataTable
          columnContentTypes={[
            'text',
            // 'text',
            'numeric',
            'numeric',
            'numeric',
          ]}
          // headings={["Name", "Mail", "Order Number", "Money Spent"]}
          headings={["Name", "Order Number", "Money Spent"]}
          rows={rowsMarkup}
        // totals={['', '', '', 255, '$155,830.00']}
        >
        </DataTable>
        : 
        <p style={{ lineHeight: "10em",textAlign: "center", color: "#6d7175" }}>
        There isn't anyone in this segment yet.
        </p>
      }
      {
        (rows && rows.length > 0)
        && <div className="f-list-footer">
          <Pagination
            // label="This is Results"
            hasPrevious={pageStatus.hasPrevious}
            onPrevious={() => {
              pageIndexChange("pre")
            }}
            hasNext={pageStatus.hasNext}
            onNext={() => {
              pageIndexChange("nex")

            }}
          />
        </div>
      }
    </div>


  );
}
export { UserTable }

