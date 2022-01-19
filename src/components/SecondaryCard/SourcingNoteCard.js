import { Card, TextField } from "@shopify/polaris";

/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:16:36
 * @LastEditTime: 2022-01-19 17:16:37
 * @LastEditors: lijunwei
 * @Description: 
 */
function SourcingNoteCard(props) {

  return (
    <Card title="备注">
      <Card.Section>
        <TextField
          value="123"
          onChange={() => { }}
        />

      </Card.Section>
    </Card>
  );
}
export { SourcingNoteCard }