import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import styled, { css } from "styled-components";
import { HOUR, MILLI_SECOND, RANDOM_BG_COLORS } from "../../constants";
import { IStackingToken } from "../../interfaces";
import { getTotalCardLoading } from "../../reducers/common";
import {
  DELETE_STAKED_TOKEN,
  UPDATE_STAKED_TOKEN,
  ADD_UNSTAKED_TOKEN,
} from "../../reducers/tokens";
import { useTypedDispatch, useTypedSelector } from "../../store";
import {
  getEarn,
  getOrganizedTime,
  getTimePercent,
  getWatingTime,
} from "../../utils/common";
import {
  emergencyUnstake,
  getStakingTokenInfo,
  isWithdrawable,
} from "../../utils/StakeInteract";
import LoaderSvg from "../common/LoaderSvg";
import {
  CardContainer,
  CardEarn,
  Image,
  StakingInfo,
  Bar,
  StackTime,
  CardButtons,
  LoaderContainer,
  CardName,
} from "./styles";

interface IEmergencyCard {
  name: string;
  token: IStackingToken;
}
const EmergencyCard: FC<IEmergencyCard> = (props) => {
  const [time, setTime] = useState<number>(0);
  const [earn, setEarn] = useState<number>(0);
  const [stakingTimeGap, setStakingTimeGap] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //   const [isStakingCompleted, setIsStakingCompleted] = useState<boolean>(false);

  const isTotalCardLoading = useTypedSelector(getTotalCardLoading);

  const progressBarRef = React.useRef<HTMLDivElement>(null);

  const dispatch = useTypedDispatch();

  const onClickEmergencyUnstake = async () => {
    setIsLoading(true);
    try {
      const _isWithdrawable = await isWithdrawable(props.token.tokenId);
      if (_isWithdrawable) return toast.error("this token is withdrawable");
      const tx = await emergencyUnstake(props.token.tokenId);
      // 삭제하고 unstakedToken 추가
      dispatch(DELETE_STAKED_TOKEN(props.token.tokenId));
      dispatch(ADD_UNSTAKED_TOKEN(props.token.tokenId));

      console.log(tx);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  // FIXME: useEffect
  // setting earn
  useEffect(() => {
    setStakingTimeGap(props.token.finishingTime - props.token.startTime);
    const timer = setInterval(() => {
      const [percent, isComplete] = getEarn(props.token, Number(Date.now()));
      setEarn(percent);
      if (isComplete) {
        clearTimeout(timer);
        return;
      }
      // 1time은 1분당 한번씩
    }, MILLI_SECOND);
    return () => clearTimeout(timer);
  }, [props.token.isCompleted]);

  // setting time
  useEffect(() => {
    const timer = setInterval(() => {
      const [timeFraction, isComplete] = getTimePercent(
        props.token,
        Number(new Date())
      );

      console.log("time timer");
      setTime(timeFraction);
      // TODO: dispatch해서 completed 된거 업데이트 해주기
      if (isComplete) {
        clearTimeout(timer);
        (async () => {
          const _newToken = await getStakingTokenInfo(props.token.tokenId);
          if (!_newToken) return;
          dispatch(UPDATE_STAKED_TOKEN(_newToken));
        })();
      }
    }, MILLI_SECOND * 60);
    return () => clearTimeout(timer);
  }, [props.token.isCompleted]);

  useEffect(() => {
    setTime(getTimePercent(props.token, Number(new Date()))[0]);
    setEarn(getEarn(props.token, Number(new Date()))[0]);
  }, [props.token.isCompleted]);

  // progress bar
  useEffect(() => {
    if (!progressBarRef || !progressBarRef.current) return;
    progressBarRef.current.style.setProperty("--progress--width", `${time}%`);
    console.log("time:", time);
    // if (time < 100) setIsStakingCompleted(false);
    if (time >= 100) {
      console.log("time is 100:", time);
      //   setIsStakingCompleted(true);
      dispatch(UPDATE_STAKED_TOKEN({ ...props.token, isCompleted: true }));
    }
  }, [time]);

  return (
    <CardContainerEl
      bgColor={RANDOM_BG_COLORS[0]}
      isLoading={isLoading || isTotalCardLoading}
    >
      <Image src="/images/mystery-ape.webp" alt="ape" />

      <CardName>{props.name}</CardName>
      <StakingInfo>
        <CardEarn>
          <span>Earned</span>
          <span>
            {" "}
            {earn} Ape Coin
            {/* <ApeCoin className="ape__coin__svg" /> */}
          </span>
        </CardEarn>
        <Bar percent={time} ref={progressBarRef}>
          {/* <Bar ref={progressBarRef}> */}
          <div />
        </Bar>
        <StackTime>
          <span>Time Stacked</span>
          <span>
            {getOrganizedTime(getWatingTime(time, stakingTimeGap))}/
            {stakingTimeGap / HOUR}H
          </span>
          {/* <span>{props.stackTime} days</span> */}
        </StackTime>
      </StakingInfo>
      <CardButtons>
        <button onClick={onClickEmergencyUnstake}>emergency unstake</button>
      </CardButtons>
      {(isLoading || isTotalCardLoading) && (
        <LoaderContainer>
          <LoaderSvg />
        </LoaderContainer>
      )}
    </CardContainerEl>
  );
};

export default EmergencyCard;
// const StakingInfo = styled.div``;

const CardContainerEl = styled(CardContainer)<{ isLoading: boolean }>`
  position: relative;
  ${({ isLoading }) =>
    isLoading &&
    css`
      ::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.375);
        z-index: 3;
      }
      background: ${(props) => props.theme.colors.gray3};
      /* background: ${(props) => props.theme.colors["w-gray2"]}; */
      pointer-events: none;
      ${Bar} > div::before {
        background: ${(props) => props.theme.colors["w-gray1"]};
      }
      button {
        cursor: not-allowed !important;
      }
    `}
`;
