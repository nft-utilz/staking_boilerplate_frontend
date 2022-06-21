import React, { FC, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import toast from "react-hot-toast";
import {
  HOUR,
  MILLI_SECOND,
  RANDOM_BG_COLORS,
  REWARD_PER_HOUR,
} from "../../constants";
import { IStackingToken, IStakingCompletedStatus } from "../../interfaces";
import {
  Bar,
  CardButtons,
  CardContainer,
  CardEarn,
  CardName,
  Image,
  LoaderContainer,
  StackTime,
  StakingInfo,
} from "./styles";
import ApeCoin from "../../public/svg/ApeCoin.svg";
import { getEarn, getOrganizedTime, getTimePercent } from "../../utils/common";
import {
  getStakingTokenInfo,
  isWithdrawable,
  unstake,
} from "../../utils/StakeInteract";
import LoaderSvg from "../common/LoaderSvg";
import { useTypedDispatch, useTypedSelector } from "../../store";
import {
  ADD_UNSTAKED_TOKEN,
  DELETE_STAKED_TOKEN,
  DELETE_UNSTAKED_TOKEN,
  UPDATE_STAKED_TOKEN,
} from "../../reducers/tokens";
import { getTotalCardLoading } from "../../reducers/common";
interface IStackCard {
  name: string;
  token: IStackingToken;
  handleClickCollect: (tokenId: number) => Promise<{ status: boolean }>;
}
const CardComponent: FC<IStackCard> = (props) => {
  const isTotalCardLoading = useTypedSelector(getTotalCardLoading);
  const dispatch = useTypedDispatch();

  const [time, setTime] = useState<number>(0);
  const [earn, setEarn] = useState<number>(0);
  const [stakingTimeGap, setStakingTimeGap] = useState<number>(0);
  const progressBarRef = React.useRef<HTMLDivElement>(null);
  const [isStakingCompleted, setIsStakingCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //FIXME: functions
  const onClickUnstake = async () => {
    // FIXME: 여기서 에러 발생
    // 우선 안사라져
    //TODO: set withrawable status and unstake if status is true
    const _isWithdrawable = await isWithdrawable(props.token.tokenId);
    if (!_isWithdrawable)
      return toast.error((t) => (
        <div>
          <span style={{ fontWeight: 600 }}>
            Mystery Ape #{props.token.tokenId}
          </span>{" "}
          is not withdrawable
        </div>
      ));

    setIsLoading(true);
    try {
      const tx = await unstake(props.token.tokenId);
      if (tx.status) {
        await dispatch(ADD_UNSTAKED_TOKEN(props.token.tokenId));
        await dispatch(DELETE_STAKED_TOKEN(props.token.tokenId));
        await toast.success("Successfully Unstaked!");
      }
      !tx.status && toast.error("Something went wrong...");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong...");
    }
    setIsLoading(false);
  };

  const onClickCollect = async () => {
    setIsLoading(true);
    try {
      const tx = await props.handleClickCollect(props.token.tokenId);
      console.log(tx);
      if (tx.status) {
        await toast.success("Successfully Collected!");
        const newTokenInfo = await getStakingTokenInfo(props.token.tokenId);
        console.log(newTokenInfo);
        if (!newTokenInfo) return;
        dispatch(UPDATE_STAKED_TOKEN(newTokenInfo));
        setIsStakingCompleted(false);
        // get erc20 token balance
      }

      !tx.status && (await toast.error(`something went wrong...`));
    } catch (error) {
      console.error(error);
      toast.error("something went wrong...");
    }
    setIsLoading(false);
  };
  // FIXME: styles
  const styles = {
    bgColor: (): string => {
      if (props.token.isCompleted) return RANDOM_BG_COLORS[4];
      // if (isStakingCompleted) return RANDOM_BG_COLORS[4];
      return RANDOM_BG_COLORS[2];
    },
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
      // setIsStakingCompleted(true);
      // dispatch(UPDATE_STAKED_TOKEN({ ...props.token, isCompleted: true }));
    }
  }, [time]);

  const getWatingTime = (_time: number, stakingTimeGap: number): number =>
    Number((((_time / 100) * 60 * stakingTimeGap) / HOUR).toFixed(0));

  return (
    <CardContainerEl
      bgColor={styles.bgColor()}
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
        <button onClick={onClickUnstake}>unstack</button>
        <button onClick={onClickCollect}>collect</button>
      </CardButtons>
      {(isLoading || isTotalCardLoading) && (
        <LoaderContainer>
          <LoaderSvg />
        </LoaderContainer>
      )}
    </CardContainerEl>
  );
};

export default React.memo(CardComponent);

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
