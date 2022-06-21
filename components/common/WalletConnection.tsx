import React from "react";
import styled from "styled-components";
import { useAccount } from "../../contexts/AccountContext";
import ConnectWalletBtn from "./ConnectWalletBtn";
import { Button_1 } from "./styles/button";
// import Button from "./Button";
const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ConnectWallet = () => {
  const getAccount = useAccount()?.getAccount;
  return (
    <Section>
      <ConnectWalletBtn />
    </Section>
  );
};

export default ConnectWallet;
