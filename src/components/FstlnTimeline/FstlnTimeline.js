/*
 * @Author: lijunwei
 * @Date: 2022-01-20 17:38:43
 * @LastEditTime: 2022-02-15 17:15:08
 * @LastEditors: lijunwei
 * @Description: 
 */

import { useMemo } from "react";
import "./FstlnTimeline.scss"


function FstlnTimeline(props) {
  const { timeline = [], contentKey = "content", dateKey = "date" } = props

  const liMarkUp = useMemo(() => {
    return timeline.map((item, idx) =>
      <li className="f-timeline-li" key={idx}>
        <div className="f-timeline-item">
          <div className="opt-item">
            {/* <span className="time">上午 04:12</span> */}
            <span className="date">{item[dateKey]}</span>
            <p className="desc">{item[contentKey]}</p>
          </div>
        </div>
      </li>)
  }, [contentKey, dateKey, timeline])

  return (
    <div className="f-timeline">
      <ul className="f-timeline-ul">
        {
          liMarkUp
        }
        {/* <li className="f-timeline-li">
          <div className="f-timeline-item">

            <div className="opt-item">
              <span className="time">上午 04:12</span>
              <span className="date">2020-12-12</span>
              <p className="desc">操作采购单</p>
            </div>

          </div>
        </li>

        <li className="f-timeline-li">
          <div className="f-timeline-item">
            <div className="opt-item">
              <span className="time">上午 04:12</span>
              <span className="date">2020-12-12</span>
              <p className="desc">操作采购单</p>
            </div>
          </div>
        </li> */}




      </ul>
    </div>
  );
}
export { FstlnTimeline }