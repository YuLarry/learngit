/*
 * @Author: lijunwei
 * @Date: 2022-01-20 17:38:43
 * @LastEditTime: 2022-01-20 19:17:43
 * @LastEditors: lijunwei
 * @Description: 
 */

import "./FstlnTimeline.scss"


function FstlnTimeline(props) {

  return (
    <div className="f-timeline">
      <ul className="f-timeline-ul">
        
        <li className="f-timeline-li">
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
        </li>
        



      </ul>
    </div>
  );
}
export { FstlnTimeline }