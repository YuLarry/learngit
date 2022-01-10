/*
 * @Author: lijunwei
 * @Date: 2021-11-23 18:51:19
 * @LastEditTime: 2022-01-10 17:34:08
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Card, Layout, SkeletonBodyText, SkeletonDisplayText, TextContainer } from "@shopify/polaris";
import { FstlnLoading } from "./FstlnLoading";

function FstlnSkeleton(props) {

  return (
    // <SkeletonPage>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />

              <FstlnLoading />

            </TextContainer>
          </Card>
          
        </Layout.Section>

      </Layout>
    // </SkeletonPage>
  );
}
export { FstlnSkeleton }