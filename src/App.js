/*
 * @Author: lijunwei
 * @Date: 2021-11-15 17:24:19
 * @LastEditTime: 2022-01-04 14:59:08
 * @LastEditors: lijunwei
 * @Description: 
 */

import { AppProvider, Frame } from "@shopify/polaris";
import logo from "./asset/images/logo.svg"
import { FstlnLink } from "./utils/FstlnLink";
import { EntryRoute } from "./EntryRoute";
import { AppContext } from "./components/AppContext";
import en from '@shopify/polaris/locales/en.json';



function App() {

  const theme = {
    logo: {
      width: 120,
      topBarSource: logo,
      url: '/users',
      accessibilityLabel: 'sCRM',
      contextualSaveBarSource: logo,
    },
  };

  return (
    <AppProvider
      i18n={en}
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
