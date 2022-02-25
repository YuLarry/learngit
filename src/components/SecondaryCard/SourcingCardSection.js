import { Card, TextStyle } from "@shopify/polaris";

/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:19:36
 * @LastEditTime: 2022-02-25 15:20:30
 * @LastEditors: lijunwei
 * @Description: 
 */
function SourcingCardSection(props) {
  const { title, text } = props
  return (
    <Card.Section title={title}>
      <TextStyle variation="subdued">
        <p style={{ wordBreak: "break-all" }} >{ text }</p>
      </TextStyle>

    </Card.Section>
  );
}
export { SourcingCardSection }