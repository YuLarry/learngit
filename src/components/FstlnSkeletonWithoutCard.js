/*
 * @Author: lijunwei
 * @Date: 2021-11-23 18:51:19
 * @LastEditTime: 2021-12-21 12:37:20
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Card, Layout, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, TextContainer } from "@shopify/polaris";
import { FstlnLoading } from "./FstlnLoading";

function FstlnSkeletonWithoutCard(props) {

  return (
    <SkeletonPage>
      {/* <Layout> */}
        {/* <Layout.Section> */}
          {/* <Card sectioned> */}
            <TextContainer>
              {/* <SkeletonDisplayText size="small" /> */}
              <SkeletonBodyText lines={4} />

              <FstlnLoading />

            </TextContainer>
          {/* </Card> */}
          
        {/* </Layout.Section> */}

      {/* </Layout> */}
    </SkeletonPage>
  );
}
export { FstlnSkeletonWithoutCard }