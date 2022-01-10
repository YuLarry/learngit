/*
 * @Author: lijunwei
 * @Date: 2021-11-16 14:52:47
 * @LastEditTime: 2022-01-04 14:39:35
 * @LastEditors: lijunwei
 * @Description: AppFrame Header
 */

import { TopBar } from "@shopify/polaris";
import { ArrowLeftMinor } from "@shopify/polaris-icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getToken } from "../../utils/Tools";

function Header(props) {

  const [userName, setUserName] = useState("F");

  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    [],
  );
  const logoutUser = useCallback(
    ()=>{window.localStorage.removeItem("token"); navigate("/login")},
    []
  )

  useEffect(() => {
    const token = getToken();
    const { aud } =  token && JSON.parse( atob( token.split(".")[1] ) );
    const username = aud && aud.split("@")[0];
    setUserName(username);
  }, []);

  const userMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [{content: 'Logout', icon: ArrowLeftMinor,onAction: logoutUser}],
        },
        
      ]}
      name={ userName }
      // detail={ userName }
      initials={ userName[0].toUpperCase() }
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  );

  return (
    <TopBar 
      userMenu={ userMarkup }
    />
  );
}
export { Header }