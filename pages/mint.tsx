import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { Wrapper } from "../components/common/styles/page";
import { MdOutlineDoubleArrow } from "react-icons/md";
import Poligon from "../public/svg/polygon-matic-logo.svg";
import moment from "moment";
import { HACKR_DAO_MINT_EVENTS, RANDOM_BG_COLORS } from "../constants";
// import { useConnectWallet } from "@web3-onboard/react";
import { cutWallet, getBalance } from "../utils/common";
import { NFT } from "../web3Config";
import {
  getTotalMinted,
  isPublicSaleState,
  publicMint,
} from "../utils/nftInteract";
import { IMintStatus } from "../interfaces";
import { useWeb3React } from "@web3-react/core";
import { useTypedDispatch } from "../store";
import { SET_WALLET_MODAL_OPEN } from "../reducers/common";

// const wallet = "0x45E3Ca56946e0ee4bf36e893CC4fbb96A1523212";

const Mint = () => {
  // const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const dispatch = useTypedDispatch();
  const { account } = useWeb3React();

  const [currentTime, setCurrentTime] = useState<string>("Loading...");
  const [currentTime2, setCurrentTime2] = useState<string>("");
  const [mintAmount, setMintAmount] = useState<number>(1);

  const [maxSupply, setMaxSupply] = useState<number>(0);
  const [totalMinted, setTotalMinted] = useState<number>(0);

  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintStatus, setMintStatus] = useState<IMintStatus | null>(null);
  const [isPublicSale, setIsPublicSale] = useState<boolean>(false);

  const [balance, setBalance] = useState<number>(0);

  // const [maxMintAmount, setMaxMintAmount] = useState<number>(
  // NFT.MAX_MINT_AMOUNT
  // );

  const onClickMinus = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };
  const onClickAdd = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };

  const handlePublicMint = async () => {
    setMintStatus(null);
    // fot loading
    setIsMinting(true);
    // get status
    // await setChain({ chainId: "0x4" });
    const { success, status } = await publicMint(mintAmount);
    // set status

    setMintStatus({
      success,
      message: status,
    });

    setIsMinting(false);
    console.log(status);
  };

  useEffect(() => {
    mintAmount >= 3 && setMintAmount(3);
    mintAmount <= 1 && setMintAmount(1);
  }, [mintAmount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format(`MMMM Do YYYY,`));
      setCurrentTime2(moment().format(`h:mm:ss a`));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const init = async () => {
      setTotalMinted(await getTotalMinted());
      setMaxSupply(NFT.MAX_SUPPLY);
      setIsPublicSale(await isPublicSaleState());
    };
    init();
  }, []);

  useEffect(() => {
    if (!account) return;
    const init = async () => {
      setBalance(await getBalance(account));
    };
    init();
  }, [account, mintStatus?.success]);

  // realtime minted number update
  useEffect(() => {
    const web3 = createAlchemyWeb3(
      `wss://eth-rinkeby.ws.alchemyapi.io/ws/${process.env
        .NEXT_PUBLIC_ALCHEMY_API_KEY!}`
    );
    const subscribeTotalMinted = async () =>
      setTotalMinted(await getTotalMinted());

    const subscription = web3.eth
      .subscribe("logs", HACKR_DAO_MINT_EVENTS)
      .on("data", subscribeTotalMinted);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // const cutBalance = 123;

  // FIXME: components
  const ButtonComponent = () => {
    // const isNotValid = paused || (!isPreSale && !isPublicSale);
    const maxSupplyDone = totalMinted >= maxSupply;
    const isNotValid = maxSupplyDone || !isPublicSale;

    const onClickConnect = async () => dispatch(SET_WALLET_MODAL_OPEN(true));

    const onClickMint = () => {
      if (maxSupply === totalMinted) return;
      handlePublicMint();
    };

    if (isMinting) return <Button isNotValid={isMinting}>ON PROCESS</Button>;

    if (!account) return <Button onClick={onClickConnect}>Connect</Button>;
    if (account && isNotValid)
      return <Button isNotValid={isNotValid}>not abled</Button>;
    if (account) return <Button onClick={onClickMint}>PUBLIC MINTING</Button>;
  };

  const StatusComponent = () =>
    mintStatus && (
      <>
        <StatusWrapper>
          <div>{mintStatus?.message}</div>
        </StatusWrapper>
        <div />
      </>
    );

  return (
    <Section>
      <div className="background_overlay"></div>
      <div className="background"></div>
      <section className="information_wrapper">
        <Img className="nft_image" src="/images/mystery-ape.webp" alt="NFT" />

        <div className="information">
          <div className="balance">
            <div className="balance_title">
              Balance
              {account ? `(${cutWallet(account)})` : "(not connected)"}
            </div>

            {/* <div className="balance_title">Balance(not connected)</div> */}
            <div className="balance_description">
              {/* <Poligon /> */}
              <div className="balance_count">
                {account ? balance : "0"} Ether
              </div>
            </div>
          </div>

          <div className="minting_info">
            <div className="row_1">
              <div className="col_1">
                <div className="currentblock_title">Current Time</div>
                <div className="currentblock_description">
                  <div>{currentTime}</div>
                  <div>{currentTime2}</div>
                </div>
              </div>
              <div className="line_vertical"></div>
              <div className="col_2">
                <div className="mintingstart_title">Minting Start at</div>
                <div className="mintingstart_description">
                  <span className="highlight">
                    <div>June 5th 2022,</div>
                    <div>3:51:57 pm</div>
                  </span>
                </div>
              </div>
            </div>
            <div className="line_horizontal"></div>
            <div className="row_2">
              <div className="col_1">
                <div className="pertransaction_title">Per Transaction</div>
                <div className="pertransaction_description">
                  <span className="small">Max</span> {NFT.MAX_MINT_AMOUNT}
                </div>
              </div>
              <div className="line_vertical"></div>
              <div className="col_2">
                <div className="perwallet_title">Price</div>
                <div className="perwallet_description">
                  {NFT.PRICE} <span className="small"> Ether</span>
                </div>
              </div>
            </div>
            <div className="line_horizontal"></div>
            <div className="row_3">
              <div className="col_1">
                <div className="remaining_title">Total Supply</div>
                <div className="remaining_description">
                  <span className="highlight">{totalMinted}</span>
                  <span className="small"> / {NFT.MAX_SUPPLY}</span>
                </div>
              </div>
              <div className="line_vertical"></div>
              <div className="col_2">
                <div className="amount_title">Amount</div>
                <div className="amount_description">
                  <AmountBtn
                    className="btn_minus"
                    onClick={onClickMinus}
                    isClickable={mintAmount >= 2}
                  >
                    <MdOutlineDoubleArrow />
                  </AmountBtn>
                  <div className="amount">
                    <span className="highlight">{mintAmount}</span>
                  </div>
                  <AmountBtn
                    className="btn_plus"
                    onClick={onClickAdd}
                    isClickable={mintAmount <= 2}
                  >
                    <MdOutlineDoubleArrow />
                  </AmountBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="minting_wrapper">
        <div className="price">
          <div className="price_title">Total Price</div>
          <div className="price_description">
            {/* <Poligon /> */}
            <div className="price_count">{NFT.PRICE * mintAmount} Ether</div>
          </div>
        </div>
        {StatusComponent()}
        {ButtonComponent()}
      </section>
    </Section>
  );
};

export default Mint;

const Button = styled.button<{ isNotValid?: boolean }>`
  max-width: 620px;
  width: 100%;
  height: 80px;
  /* font-family: "Poppins", sans-serif; */
  font-size: var(--font-size-description);
  font-weight: 800;
  letter-spacing: var(--letter-spacing-description);
  color: var(--color-white);
  /* background: linear-gradient(135deg, #ac53fb, #6713b1); */
  background: linear-gradient(135deg, #f0f08f, #bcbc24);
  border-radius: 16px;
  border: none;
  /* cursor: pointer; */
  cursor: ${({ isNotValid }) => (isNotValid ? "not-allowed" : "pointer")};

  transition: 0.25s;

  :hover {
    box-shadow: 0 0px 24px 0px ${(props) => props.theme.colors.highlight};
  }
  ${({ isNotValid }) =>
    isNotValid &&
    css`
      background: ${(props) => props.theme.colors["w-gray2"]};
      :hover {
        box-shadow: none;
      }
    `}
`;

const StatusWrapper = styled.div`
  padding: 1rem;
  border: 2px solid ${(props) => props.theme.colors.black};
  /* box-shadow: 0 0px 24px 0px ${(props) => props.theme.colors.highlight}; */
  box-shadow: 0.3rem 0.3rem 0 ${(props) => props.theme.colors.black};

  > div {
    background: var(--clr-selection-bg);
    color: ${(props) => props.theme.colors.black};
    font-size: ${(props) => props.theme.fontSizes.fontsm};
    word-break: break-word;
    /* border-radius: 1.25rem; */
  }
`;

const AmountBtn = styled.button<{ isClickable: boolean }>`
  cursor: pointer;
  color: ${(props) => props.theme.colors.black};

  :hover {
    color: ${(props) => props.theme.colors.highlight};
    /* background: ${(props) => props.theme.colors.highlight}; */
    /* background: #d8abff; */
    background: #ffffba;
    /* border: 1px solid ${(props) =>
      props.theme.colors.highlight} !important; */
  }
  ${({ isClickable }) =>
    !isClickable &&
    css`
      cursor: default;
      color: ${(props) => props.theme.colors.white};
      :hover {
        background: none;
        color: ${(props) => props.theme.colors.white};
      }
    `}
`;

const Img = styled.img``;
const Section = styled.section`
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: ${(props) => props.theme.colors.black};
  .background_overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    /* background: linear-gradient(135deg, #101010, #10101000); */
    z-index: -1;
  }

  .background {
    position: fixed;
    width: 100%;
    height: 100%;
    background-image: url("sprites/background.png");
    background-repeat: no-repeat;
    background-position: top;
    background-size: cover;
    z-index: -2;
  }

  header {
    width: 100%;
    height: 90px;
    display: flex;
    justify-content: center;
  }

  .header_wrapper {
    text-transform: capitalize;
    max-width: 1320px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
  }

  .logo {
    display: flex;
  }
  .logo > a {
    /* font-family: "Poppins", sans-serif; */
    /* font-size: 20px; */
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: -0.4px;
    color: ${(props) => props.theme.colors.black};
  }

  .connect_wallet {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    border: 1px solid var(--color-white);
    border-radius: 20px;
    padding-left: 20px;
    padding-right: 20px;
    cursor: pointer;
    transition: 0.25s;
    > svg {
      width: 20px;
      path {
        transition: 0.25s;
        fill: var(--color-white) !important;
      }
    }
  }

  .connect_wallet > div:nth-child(1) {
    /* background-image: url("sprites/klaytn_white.png"); */
    background-repeat: no-repeat;
    background-position: top;
    background-size: cover;
    width: 16px;
    height: 16px;
    transition: 0.25s;
  }

  .connect_wallet > div:nth-child(2) {
    /* font-family: "Poppins", sans-serif; */
    font-size: 16px;
    font-weight: 600;
    color: var(--color-white);
    letter-spacing: -0.32px;
    margin-bottom: 0.5px;
    margin-left: 8px;
    transition: 0.25s;
  }

  .connect_wallet:hover {
    background: var(--color-white);
  }

  .connect_wallet:hover.connect_wallet > div:nth-child(1) {
    /* background-image: url("sprites/klaytn_black.png"); */
  }
  .connect_wallet:hover {
    svg {
      path {
        fill: ${(props) => props.theme.colors.black} !important;
      }
    }
  }

  .connect_wallet:hover.connect_wallet > div:nth-child(2) {
    color: var(--color-black);
  }

  .information_wrapper {
    max-width: 1320px;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    place-items: center;
    gap: var(--gap);
    margin-top: 80px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .nft_image {
    max-width: 620px;
    max-height: 620px;
    width: 100%;
    height: 100%;
    border-radius: 16px;

    /* border: 3.5px solid ${(props) => props.theme.colors.black}; */
    /* box-shadow: 0.5rem 0.5rem 0 ${(props) => props.theme.colors.black}; */
    /* padding: 0.2rem; */
    /* border-radius: 0.4rem; */
  }

  .information {
    max-width: 620px;
    max-height: 620px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .balance {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--gap);
  }

  .balance_title {
    /* font-family: "Poppins", sans-serif; */
    font-size: var(--font-size-title);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-title);
    /* color: var(--color-gray); */
    color: ${(props) => props.theme.colors["w-gray1"]};
  }

  .balance_description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    svg {
      width: 32px;
      path {
        fill: ${(props) => props.theme.colors.white} !important;
      }
    }
  }

  .balance_description > img {
    width: var(--font-size-description);
    height: var(--font-size-description);
  }

  .balance_description > div {
    /* font-family: "Poppins", sans-serif; */
    font-size: var(--font-size-description);
    font-weight: 800;
    letter-spacing: var(--letter-spacing-description);
    margin-left: 16px;
    /* color: var(--color-white); */
    /* color: ${(props) => props.theme.colors["w-gray1"]}; */
    /* color: ${(props) => props.theme.colors.highlight}; */
    color: ${(props) => props.theme.colors.black};
  }

  .minting_info {
    width: 100%;
    height: 100%;
    /* background: ${RANDOM_BG_COLORS[5]}; */
    /* background: #ffbf00; */
    /* background: linear-gradient(135deg, #303030cc, #202020cc); */
    border: 3px solid ${(props) => props.theme.colors.black};
    box-shadow: 0.5rem 0.5rem 0 ${(props) => props.theme.colors.black};
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    /* border: 3.5px solid ${(props) => props.theme.colors.black}; */
    /* box-shadow: 0.5rem 0.5rem 0 ${(props) => props.theme.colors.black}; */
    padding: 0.2rem;
    border-radius: 0.4rem;

    .currentblock_description {
      div {
        font-size: 1rem;
      }
      > div:nth-child(2) {
        font-size: ${(props) => props.theme.fontSizes.fontmd};
      }
    }
    .mintingstart_description {
      div {
        font-size: 1rem;
      }
      div:nth-child(2) {
        font-size: ${(props) => props.theme.fontSizes.fontmd};
      }
    }
  }

  .line_horizontal {
    width: calc(100% - 80px);
    height: 1px;
    background-color: var(--color-charcoal);
  }

  .line_vertical {
    width: 1px;
    height: calc(100% - 40px);
    background-color: var(--color-charcoal);
  }

  .row_1,
  .row_2,
  .row_3 {
    width: 100%;
    height: calc(100% / 3);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: var(--gap);
    padding-bottom: var(--gap);
  }

  .col_1,
  .col_2 {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: var(--gap);
    padding-right: var(--gap);
  }

  .col_1 > div:nth-child(1),
  .col_2 > div:nth-child(1) {
    /* font-family: "Poppins", sans-serif; */
    font-size: var(--font-size-title);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-title);
    /* color: var(--color-gray); */
    color: ${(props) => props.theme.colors["w-gray1"]};
  }

  .col_1 > div:nth-child(2),
  .col_2 > div:nth-child(2) {
    /* font-family: "Poppins", sans-serif; */
    font-size: var(--font-size-description);
    font-weight: 800;
    letter-spacing: var(--letter-spacing-description);
    color: var(--color-black);
  }

  .amount_description {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .amount_description .btn_minus {
    transform: rotate(180deg);
  }

  .amount_description > button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--gap);
    height: var(--gap);
    /* font-family: "Poppins", sans-serif; */
    font-size: var(--font-size-title);
    font-weight: 600;
    /* color: var(--color-white); */
    /* background: none; */
    border: 1px solid var(--color-black);
    border-radius: 4px;
    transition: 0.25s;
  }

  .highlight {
    color: ${(props) => props.theme.colors.highlight};
  }

  .small {
    /* font-family: "Poppins", sans-serif; */
    font-size: var(--font-size-title);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-title);
  }

  .minting_wrapper {
    max-width: 1320px;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    place-items: center;
    gap: var(--gap);
    margin-top: var(--gap);
    margin-bottom: 80px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .price {
    max-width: 620px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price_title {
    /* font-family: "Poppins", sans-serif; */
    font-size: var(--font-size-title);
    font-weight: 600;
    letter-spacing: var(--letter-spacing-title);
    /* color: var(--color-gray); */
    color: ${(props) => props.theme.colors.black};
  }

  .price_description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    svg {
      width: 32px;
    }
  }

  .price_description > img {
    width: var(--font-size-description);
    height: var(--font-size-description);
  }

  .price_description > div {
    /* font-family: "Poppins", sans-serif; */
    font-size: var(--font-size-description);
    font-weight: 800;
    letter-spacing: var(--letter-spacing-description);
    margin-left: 16px;
    color: ${(props) => props.theme.colors.highlight};
  }

  .btn_minting {
    max-width: 620px;
    width: 100%;
    height: 80px;
    /* font-family: "Poppins", sans-serif; */
    font-size: var(--font-size-description);
    font-weight: 800;
    letter-spacing: var(--letter-spacing-description);
    color: var(--color-white);
    /* background: linear-gradient(135deg, #ac53fb, #6713b1); */
    background: linear-gradient(135deg, #f0f08f, #bcbc24);
    border-radius: 16px;
    border: none;
    cursor: pointer;
    transition: 0.25s;
  }

  .btn_minting:hover {
    box-shadow: 0 0px 24px 0px ${(props) => props.theme.colors.highlight};
  }

  @media screen and (max-width: 1320px) {
    .information_wrapper {
      grid-template-columns: none;
      grid-template-rows: 1fr 1fr;
    }

    .minting_wrapper {
      grid-template-columns: none;
      grid-template-rows: 1fr 1fr;
    }
  }

  @media screen and (max-width: 660px) {
    :root {
      --font-size-title: 20px;
      --letter-spacing-title: 0.4px;

      --font-size-description: 28px;
      --letter-spacing-description: 0.56px;
    }
  }

  @media screen and (max-width: 600px) {
    :root {
      --font-size-title: 16px;
      --letter-spacing-title: 0.32px;

      --font-size-description: 24px;
      --letter-spacing-description: 0.48px;

      --gap: 32px;
    }

    .information_wrapper {
      margin-top: 64px;
    }

    .btn_minting {
      height: 64px;
    }

    .btn_minting:hover {
      box-shadow: 0 0px 20px 0px ${(props) => props.theme.colors.highlight};
    }
  }

  @media screen and (max-width: 520px) {
    :root {
      --font-size-title: 14px;
      --letter-spacing-title: 0.28px;

      --font-size-description: 20px;
      --letter-spacing-description: 0.4px;

      --gap: 28px;
    }

    .information_wrapper {
      margin-top: 56px;
    }

    .btn_minting {
      height: 56px;
    }

    .btn_minting:hover {
      box-shadow: 0 0px 16px 0px ${(props) => props.theme.colors.highlight};
    }
  }

  @media screen and (max-width: 460px) {
    :root {
      --font-size-title: 12px;
      --letter-spacing-title: 0.24px;

      --font-size-description: 16px;
      --letter-spacing-description: 0.32px;

      --gap: 24px;
    }

    .information_wrapper {
      margin-top: 48px;
    }

    .logo {
      font-size: 18px;
      letter-spacing: -0.36px;
    }

    .connect_wallet {
      height: 36px;
      padding-left: 16px;
      padding-right: 16px;
    }

    .connect_wallet > div:nth-child(1) {
      width: 14px;
      height: 14px;
    }

    .connect_wallet > div:nth-child(2) {
      font-size: 14px;
      letter-spacing: -0.28px;
    }
  }

  @media screen and (max-width: 400px) {
    :root {
      --gap: 20px;
    }

    .information_wrapper {
      margin-top: 40px;
    }
  }
`;
