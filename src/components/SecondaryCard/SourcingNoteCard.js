import { Card, TextField } from "@shopify/polaris";

/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:16:36
 * @LastEditTime: 2022-02-11 15:48:36
 * @LastEditors: lijunwei
 * @Description: 
 */
function SourcingRemarkCard(props) {

  const { remark = "", onChange = ()=>{}, readOnly = false } = props;

  return (
    <Card title="备注">
      <Card.Section>
        {
          readOnly
          ?
          remark
          :
          <TextField
          value={ remark }
          onChange={ (val)=>{onChange(val)} }
        />
        }
        

      </Card.Section>
    </Card>
  );
}
export { SourcingRemarkCard }