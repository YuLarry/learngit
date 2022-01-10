/*
 * @Author: lijunwei
 * @Date: 2021-11-16 17:20:54
 * @LastEditTime: 2021-12-31 19:08:53
 * @LastEditors: lijunwei
 * @Description: User page
 */

import { Card, Page, Tabs } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { execTempSegment, execTempSegmentCount } from "../../api/requests";
import { FstlnSkeleton } from "../../components/FstlnSkeleton";
import { SegmentIcon } from "../../icon/SegmentIcon";
import { UserTable } from "./pieces/UserTable";


function UserList(props) {

  const [tabSelected] = useState(0);
  const tabs = [{ id: "all", content: "All", panelID: "all" }];

  const [rows, setRows] = useState([]);
  const pageSize = 20;
  const [pageIndex, setPageIndex] = useState(1);
  const [total, setTotal] = useState(0);
  // const [hasNext, setHasNext] = useState(false);
  // const [hasPrevious, setHasPrevious] = useState(false);
  const [loadingTable, setLoadingTable] = useState(true);

  const pageStatus = useMemo(() => {
    const status = {
      hasNext: false,
      hasPrevious: false,
    }
    if (pageIndex > 1) {
      status.hasPrevious = true;
    }
    if (Math.ceil(total / pageSize) > pageIndex) {
      status.hasNext = true;
    }
    return status
  }, [pageIndex, total]);

  const getUserTable = useCallback(
    () => {
      setLoadingTable(true);

      execTempSegmentCount()
        .then((res) => {
          if (res.data) {
            const { count } = res.data;
            setTotal(count);
          }
        })

      execTempSegment(null, {
        pageIndex, pageSize
      })
        .then(res => {
          const { data } = res.data;
          const dataObj = JSON.parse(data);
          setRows(dataObj);
          setLoadingTable(false);
        })
        .finally(() => {
        })
    },
    [pageIndex],
  );

  const pageIndexChange = useCallback((action) => {
    switch (action) {
      case "nex":
        setPageIndex(pageIndex + 1);
        break;
      case "pre":
        setPageIndex(pageIndex - 1);
        break;
      default:
        return;
    }
  }, [pageIndex])

  useEffect(() => {
    getUserTable();
  }, [pageIndex])

  const tableMarkup = useMemo(() => {
    let elem;
    if (loadingTable) {
      elem = <FstlnSkeleton />
    } else {
      elem =
        <Card>
          <Tabs tabs={tabs} selected={tabSelected}>
            <UserTable rows={rows} pageIndexChange={pageIndexChange} pageStatus={pageStatus} />
          </Tabs>
        </Card>
    }
    return elem

  }, [loadingTable, pageIndexChange, pageStatus, rows, tabSelected, tabs]);

  return (
    <Page
      title="User"
    >
      {tableMarkup}
    </Page >

  );
}
export default UserList;
