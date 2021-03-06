/*
 * @Author: lijunwei
 * @Date: 2021-11-15 17:24:19
 * @LastEditTime: 2022-02-21 10:59:13
 * @LastEditors: lijunwei
 * @Description: 
 */

import { AppProvider } from "@shopify/polaris";
import logo from "./asset/images/logo.svg"
import { FstlnLink } from "./utils/FstlnLink";
import { EntryRoute } from "./EntryRoute";
import { AppContext } from "./components/AppContext";
// import en from '@shopify/polaris/locales/en.json';
import zhCN from '@shopify/polaris/locales/zh-CN.json';
import { fstlnTool } from "./utils/Tools";
import { loginRequest } from "./api/requests";



function App() {

  const theme = {
    logo: {
      width: 120,
      topBarSource: logo,
      url: '/sourcing',
      accessibilityLabel: 'PMS',
      contextualSaveBarSource: logo,
    },
  };

  return (
    <AppProvider
      i18n={zhCN}
      theme={theme}
      linkComponent={FstlnLink}
    >
        <AppContext>
          <EntryRoute />
        </AppContext>
    </AppProvider>

  );
}

export default App;
