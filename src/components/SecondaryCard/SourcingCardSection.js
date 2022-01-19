import { Card, TextStyle } from "@shopify/polaris";

/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:19:36
 * @LastEditTime: 2022-01-19 17:20:41
 * @LastEditors: lijunwei
 * @Description: 
 */
function SourcingCardSection(props) {
  const { title, text } = props
  return (
    <Card.Section title={title}>
      <TextStyle variation="subdued">
        { text }
      </TextStyle>

    </Card.Section>
  );
}
export { SourcingCardSection }