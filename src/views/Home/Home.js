/*
 * @Author: lijunwei
 * @Date: 2021-11-15 17:50:39
 * @LastEditTime: 2021-11-25 16:22:30
 * @LastEditors: lijunwei
 * @Description: Home page
 */

import { useContext, useState } from "react";
import { ToastContext } from "../../context/ToastContext";
import { useSpring, animated, config} from "react-spring";


function Home(props) {
  const toastContext = useContext(ToastContext);
  const [flip, set] = useState(false);

  const {num} = useSpring({
    to: {num: 1}, 
    from: {num: 0},
    reset: true,
    reverse: flip,
    delay: 3000,
    config: {
      ...config,
      duration: 2000,
    },
    onRest: ()=>set(!flip)
  })

  return (
    <div>
      Home page
      <button onClick={ ()=>{ toastContext.toast()} }> button </button>
      <hr />
      {JSON.stringify(toastContext)}

      <animated.div>
        { num.to(n=>n.toFixed(2)) }
      </animated.div>
    </div>
  );
}
export { Home }