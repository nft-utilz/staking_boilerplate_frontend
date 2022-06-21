import { FC, useEffect, useState } from "react";
import ErrorSvg from "../common/ErrorSvg";
import LoaderSvg from "../common/LoaderSvg";
import {
  Body,
  Btn,
  Footer,
  Header,
  IconWrapper,
  Overlay,
  Window,
} from "./styles";
import { IoCloseOutline } from "react-icons/io5";
import CheckSvg from "../common/CheckSvg";
import Link from "next/link";
import styled from "styled-components";
import { BiCheckCircle, BiBadgeCheck } from "react-icons/bi";
import { RANDOM_BG_COLORS, STAKE_TIME_ARR } from "../../constants";
import { stake } from "../../utils/StakeInteract";
import { useTypedDispatch, useTypedSelector } from "../../store";
import { getClickedTokenId, SET_CLICKED_CARD } from "../../reducers/common";
import { IStakedInfo, IStakeTime } from "../../interfaces";
import { ADD_STAKED_TOKEN, DELETE_UNSTAKED_TOKEN } from "../../reducers/tokens";

const widthRatio = 724 / 350;
const heightRatio = 1.4;
const multiple = 180;

interface CheckIconComponentProps {
  time: string;
  isClicked: boolean;
  onClick: (time: string) => void;
  // tokenId: number;
}

const CheckIconComponent = (props: CheckIconComponentProps) => {
  return (
    <CheckIconWrapper
      isClicked={props.isClicked}
      onClick={() => props.onClick(props.time)}
    >
      <div className="icon__item__1">
        <BiBadgeCheck />
      </div>
      <div className="icon__item__2">
        <span>{props.time}</span>Hours
      </div>
    </CheckIconWrapper>
  );
};
interface StakeModalProps {
  handleClose?: () => void;
  isOpen: boolean;
}

const StakeModal: FC<StakeModalProps> = (props) => {
  const [isStakedInfo, setIsStakedInfo] = useState<IStakedInfo | null>({
    isStaked: false,
    status: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clickedTime, setClickedTime] = useState<string>("");
  const clickedTokenId = useTypedSelector(getClickedTokenId);
  const dispatch = useTypedDispatch();

  // FIXME: functions
  const onClickStakeTimeBtn = (time: string) => {
    clickedTime === time && setClickedTime("");
    clickedTime !== time && setClickedTime(time);
  };

  const onClickClose = () => {
    if (!props.handleClose) return;
    props.handleClose();
    setClickedTime("");
    setIsStakedInfo({ isStaked: false, status: false });
    dispatch(SET_CLICKED_CARD(0));
  };

  const onClickStake = async () => {
    setIsLoading(true);
    const stakeTimeObj = STAKE_TIME_ARR.find(
      (item) => item.time === clickedTime
    ) as IStakeTime;

    try {
      const tx = await stake(clickedTokenId, stakeTimeObj.contractIndex);
      console.log(tx);
      setIsLoading(false);
      if (tx.status) {
        await setIsStakedInfo({
          isStaked: true,
          status: tx.status,
        });
        // 여기에 리덕스로 상태변경
        // unstaked token에서 없애기
        // 일단 이거 작동 안했어
        dispatch(DELETE_UNSTAKED_TOKEN(clickedTokenId));
        // staked token에 추가하고 (함수 하나 만들기)
        await dispatch(ADD_STAKED_TOKEN(clickedTokenId));
      }

      if (!tx.status)
        await setIsStakedInfo({
          isStaked: true,
          status: tx.status,
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  //FIXME: useEffect
  useEffect(() => {
    // stop scroll
    if (props.isOpen) document.body.style.overflow = "hidden";
    // return scroll
    return () => {
      document.body.style.overflow = "";
    };
  }, [props.isOpen]);

  //FIXME: components

  const LoadingComponent = () => {
    return (
      <>
        <Header>ON PROGRESS</Header>
        <Body style={{ paddingTop: "1rem" }}>
          <LoaderSvg />
        </Body>
      </>
    );
  };

  const LandingComponent = () => {
    return (
      <>
        <Header>
          Select Time
          {/* {isLoading && "ON PROGRESS"} */}
        </Header>
        <Body style={{ flexDirection: "column" }}>
          <Description>
            <span className="item__1">
              During staking a nft, you couldn&apos;t trade the nft{" "}
            </span>
            <span className="item__2">
              <span>
                Mystery Token{" "}
                <span className="item__2__primary">#{clickedTokenId}</span>
              </span>
            </span>
          </Description>
          <CheckIconContainer>
            {STAKE_TIME_ARR.map((time) => (
              <CheckIconComponent
                time={time.time}
                isClicked={clickedTime === time.time}
                key={time.time}
                onClick={onClickStakeTimeBtn}
              />
            ))}
          </CheckIconContainer>
        </Body>
        <Footer>
          <Btn onClick={onClickStake} isDark={true}>
            STAKE
          </Btn>
          <Btn onClick={onClickClose} isDark={false}>
            Next time
          </Btn>
        </Footer>
      </>
    );
  };

  const SuccessComponent = () => {
    return (
      <>
        <Header>Successfully Staked!</Header>
        <IconWrapper onClick={onClickClose}>
          <IoCloseOutline />
        </IconWrapper>
        <Body>
          <CheckSvg />
        </Body>
        <Footer>
          {/* Mystery Ape #{clickedTokenId} */}
          {/* <Link href={"/my-collections"} passHref> */}
          <span style={{ cursor: "pointer", fontWeight: 600 }}>
            {/* &quot;My Collections&quot; */}
          </span>
          {/* </Link> */}
        </Footer>
      </>
    );
  };

  const ErrorComponent = () => {
    return (
      <>
        <Header style={{ color: "red" }}>Error</Header>
        <IconWrapper onClick={onClickClose}>
          <IoCloseOutline />
        </IconWrapper>
        <Body>
          <ErrorSvg />
        </Body>
        {/* 여기에 에러메세지 */}
        <Footer>something went wrong</Footer>
      </>
    );
  };
  return (
    <Overlay
      isOpen={props.isOpen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Window
        w={`${widthRatio * multiple}px`}
        h={`${heightRatio * multiple}px`}
      >
        {/* first landing modal */}
        {!isStakedInfo?.isStaked && !isLoading && LandingComponent()}
        {/* loading */}
        {isLoading && LoadingComponent()}
        {/* when minting successed */}
        {isStakedInfo?.isStaked && isStakedInfo?.status && SuccessComponent()}
        {/* when minting occured error */}
        {isStakedInfo?.isStaked && !isStakedInfo?.status && ErrorComponent()}
      </Window>
    </Overlay>
  );
};

export default StakeModal;

const CheckIconWrapper = styled.div<{ isClicked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 2px solid ${(props) => props.theme.colors.black};
  padding: 0.467rem;
  border-radius: 1.4rem;
  box-shadow: 0.25rem 0.25rem 0 rgba(0, 0, 0, 0.8);
  background: ${({ isClicked }) => (isClicked ? RANDOM_BG_COLORS[2] : "")};
  height: 100%;
  :active {
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.15rem 0.15rem 0 rgba(0, 0, 0, 0.8);
  }
  cursor: pointer;
  .icon__item__1 {
    /* font-size: 3em; */
    font-size: ${(props) => props.theme.fontSizes.fontxl};
    svg {
      path:last-child {
        /* {isClicked} */
        display: ${({ isClicked }) => (isClicked ? "block" : "none")};
      }
    }
  }

  .icon__item__2 {
    > span {
      font-size: ${(props) => props.theme.fontSizes.fontlg};
      font-weight: 700;
      padding-right: 0.2rem;
    }
  }
`;

const CheckIconContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 7rem);
  grid-auto-rows: 7rem;
  /* grid-template-rows: repeat(auto, 7rem); */
  align-items: center;
  justify-content: center;
  /* flex-wrap: wrap; */
  /* max-width: 70%; */

  gap: 1rem;
  padding: 1rem 0;
`;

const Description = styled.div`
  padding-top: 0.475rem;
  display: flex;
  flex-direction: column;
  .item__2 {
    padding-top: 0.475rem;
    /* font-weight: 700; */
    > span {
      background: yellow;
      padding: 0.2rem 0.5rem;
      border-radius: 0.275rem;
    }
  }
  .item__2__primary {
    font-weight: 700;
  }
`;
