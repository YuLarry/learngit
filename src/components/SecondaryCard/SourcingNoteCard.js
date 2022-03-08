import { Card, TextField } from "@shopify/polaris";

/*
 * @Author: lijunwei
 * @Date: 2022-01-19 17:16:36
 * @LastEditTime: 2022-03-08 18:53:30
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
          <p style={{ wordBreak: "break-all" }} >{ remark }</p>
          :
          <TextField
          value={ remark }
          onChange={ (val)=>{onChange(val)} }
          maxLength={ 100 }
        />
        }
        

      </Card.Section>
    </Card>
  );
}
export { SourcingRemarkCard }