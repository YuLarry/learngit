/*
 * @Author: lijunwei
 * @Date: 2021-12-02 18:53:16
 * @LastEditTime: 2021-12-27 11:48:40
 * @LastEditors: lijunwei
 * @Description: 
 */

import { Modal, TextContainer } from "@shopify/polaris";
import { useCallback } from "react";

function FstlnModal(props) {
  
  const { active, message, title, onClose, primaryAction, secondaryActions, section } = props.modalConfig;

  const handleClose = useCallback(()=>{
    onClose();
  },[props.modalConfig])

  
  return (
    <Modal
        // activator={activator}
        open={active}
        onClose={handleClose}
        title={ title }
        primaryAction={ primaryAction }
        secondaryActions={ secondaryActions }
      >

      {
        section
        ?
          <Modal.Section>
            { section }
          </Modal.Section>
        :
        <Modal.Section>
          <TextContainer>
            <p>
              { message }
            </p>
          </TextContainer>
        </Modal.Section>
      }
      </Modal>
  );
}
export { FstlnModal }
