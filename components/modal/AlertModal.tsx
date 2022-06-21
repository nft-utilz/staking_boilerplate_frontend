import React from "react";
import { Overlay, Window, Header, Body, Footer, Btn } from "./styles";

const AlertModal = () => {
  return (
    <Overlay isOpen={true}>
      <Window>
        <Header>
          caution
          {/* {isLoading && "ON PROGRESS"} */}
        </Header>
        <Body>body</Body>
        <Footer>
          <Btn isDark={true}>unstake now</Btn>
          <Btn isDark={false}>Next Time</Btn>
        </Footer>
      </Window>
    </Overlay>
  );
};

export default AlertModal;
