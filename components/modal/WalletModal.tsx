import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import { MouseEvent, useEffect, useRef } from "react";
import styled from "styled-components";
import { SET_WALLET_MODAL_OPEN } from "../../reducers/common";
import { useTypedDispatch } from "../../store";
import { media } from "../../styles/theme";
import { connectors } from "../../utils/connectors";
import { Body, Overlay, Window } from "./styles";

interface CardComponentProps {
  imgSrc: string;
  name: string;
  desc: string;
  onClick: () => void;
}
const CardComponent = (props: CardComponentProps) => {
  return (
    <CardContainer onClick={props.onClick}>
      <Image src={props.imgSrc} width={50} height={50} alt={props.name} />
      <Name>{props.name}</Name>
      <Description>{props.desc}</Description>
    </CardContainer>
  );
};
// Connect to your MetaMask Wallet
export default function SelectWalletModal() {
  const { activate } = useWeb3React();
  const dispatch = useTypedDispatch();
  const closeModal = () => {
    dispatch(SET_WALLET_MODAL_OPEN(false));
    document.body.style.overflow = "";
  };
  const windowRef = useRef<HTMLDivElement>(null);
  const onClickOverlay = (e: any) => {
    if (windowRef?.current?.contains(e.target as Node)) return;
    closeModal();
  };

  const setProvider = (type: string) => {
    window.localStorage.setItem("provider", type);
  };
  const onClickMetaMask = () => {
    activate(connectors.injected);
    setProvider("injected");
    closeModal();
  };
  const onClickCoinbase = () => {
    activate(connectors.coinbaseWallet);
    setProvider("coinbaseWallet");
    closeModal();
  };
  const onClickWalletConnect = () => {
    activate(connectors.walletConnect);
    setProvider("walletConnect");
    closeModal();
  };

  //FIXME: useEffect
  useEffect(() => {
    // stop scroll
    document.body.style.overflow = "hidden";
    // return scroll
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <Overlay
      isOpen={true}
      onTap={onClickOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Window ref={windowRef}>
        <Body>
          <Grid>
            <CardComponent
              imgSrc="/images/mm.svg"
              name="Meta Mask"
              desc="Connect to your MetaMask Wallet"
              onClick={onClickMetaMask}
            />
            <CardComponent
              imgSrc="/images/cbw.svg"
              name="Coinbase Wallet"
              desc="Scan with Coinbase Wallet to connect"
              onClick={onClickCoinbase}
            />
            <CardComponent
              imgSrc="/images/wc.svg"
              name="WalletConnect"
              desc="Scan with WalletConnect to connect"
              onClick={onClickWalletConnect}
            />
          </Grid>
        </Body>
      </Window>
    </Overlay>
  );
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 1rem;
  padding: 1.4rem;
  transition: all 0.2s ease-in-out;
  background-color: ${(props) => props.theme.colors.white};

  :hover {
    background-color: ${(props) => props.theme.colors["gray-100"]};
  }
`;
const Name = styled.div`
  font-size: ${(props) => props.theme.fontSizes.fontxl};
  font-weight: 700;
`;
const Description = styled.div`
  font-size: ${(props) => props.theme.fontSizes.fontlg};
  color: ${(props) => props.theme.colors["gray-400"]};
  /* color: ${(props) => props.theme.colors["gray-500"]}; */
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  grid-gap: 1rem;
  grid-auto-rows: minmax(100px, auto);
  justify-content: center;
  align-items: center;
  ${media[768]} {
    grid-template-columns: repeat(1, minmax(300px, 1fr));
  }
`;
