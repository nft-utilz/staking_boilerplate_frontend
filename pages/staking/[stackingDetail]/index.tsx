import React, { ReactNode, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
// import {theme} from "../../../styles/theme";
import styled, { css } from "styled-components";
import { Button_1 } from "../../../components/common/styles/button";
import { Section, Wrapper } from "../../../components/common/styles/page";
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/router";
import { navNames, RANDOM_BG_COLORS } from "../../../constants";
import Link from "next/link";
import CardComponent from "../../../components/stack/StakingCard";
import UnStackedComponent from "../../../components/stack/UnStackedCard";

import {
  getRewardToken,
  getStakedToken,
  getUnStakedToken,
  RESET_TOKENS,
  SET_REWARD_TOKENS,
  SET_STAKED_TOKENS,
  SET_UNSTAKED_TOKENS,
} from "../../../reducers/tokens";
import StakeModal from "../../../components/modal/StakeModal";
import {
  AppDispatch,
  useTypedDispatch,
  useTypedSelector,
} from "../../../store";
import {
  getAvailableClaim,
  getClickedTokenId,
  getIsApprovedForAll,
  getTotalCardLoading,
  SET_APPROVAL_FOR_ALL,
  SET_AVAILABLE_CLAIM,
  SET_CLICKED_CARD,
  SET_TOTAL_CARD_LOADING,
} from "../../../reducers/common";
import {
  claimToken,
  claimTokenBatch,
  getStakingTokenInfoBatch,
  isWithdrawable,
  stakedTokensOfOwner,
  unstake,
} from "../../../utils/StakeInteract";
import { IStackingToken, IStakedInfo } from "../../../interfaces";
import ApeCoin from "../../../public/svg/ApeCoin.svg";
import { isApprovedForAll } from "../../../utils/nftInteract";
import { rewardBalanceOf } from "../../../utils/rewardInteract";
import { isWithdrawableBatch } from "../../../utils/getNftInteract";
import { theme } from "../../../styles/theme";
import EmergencyCard from "../../../components/stack/EmergencyCard";
import { AnimatePresence } from "framer-motion";
import { useWeb3React } from "@web3-react/core";
import ConnectWallet from "../../../components/common/WalletConnection";
import { getWallets } from "../../../api";

// const wallet = "0x45E3Ca56946e0ee4bf36e893CC4fbb96A1523212";
interface INavButton {
  name: string;
  href: string;
}
const NavButton = (props: INavButton) => {
  return (
    <Link href={`/staking/${props.href}`}>
      <NavButtonContainer>
        <div>{props.name}</div>
      </NavButtonContainer>
    </Link>
  );
};

const StatComponent = ({ name, value }: { name: string; value: ReactNode }) => {
  return (
    <Box>
      <span>{name}</span>
      <span>{value}</span>
    </Box>
  );
};

interface IStackCard {
  name: string;
  earn: number;
  stackTime: string;
}

// make navName array
const whitelistNavNames = Object.values(navNames);

const stackingPossibleList = [navNames.DASHBOARD, navNames.STACKING_APES];
const StakingDetail = () => {
  const router = useRouter();
  const currNavName = router.query?.stackingDetail as string;

  const { account } = useWeb3React();
  // const [{ wallet }] = useConnectWallet();
  // const [stakedTokenList, setStakedTokenList] = React.useState();
  const dispatch = useTypedDispatch();
  const unstakedTokens = useTypedSelector(getUnStakedToken);
  const stakedTokens = useTypedSelector(getStakedToken);
  const clickedCard = useTypedSelector(getClickedTokenId);
  const rewardTokens = useTypedSelector(getRewardToken);
  const isApproved = useTypedSelector(getIsApprovedForAll);
  const availableClaim = useTypedSelector(getAvailableClaim);
  const isTotalCardLoading = useTypedSelector(getTotalCardLoading);

  // console.log("clickedCard:", clickedCard);

  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isClaimBtnLoading, setIsClaimBtnLoading] =
    React.useState<boolean>(false);
  // const [isApproved, setIsApproved] = React.useState<boolean>(false);
  // const [availableClaim, setAvailableClaim] = React.useState<number>(0);

  //FIXME: functions
  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  const handleClickStackModalOn = (tokenId: number) => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    dispatch(SET_CLICKED_CARD(tokenId));
  };

  const handleClickCollect = async (
    tokenId: number
  ): Promise<{ status: boolean }> => {
    try {
      console.log("collect");
      const _isWithdrawable = await isWithdrawable(tokenId);
      console.log(_isWithdrawable);
      if (!_isWithdrawable) return { status: false };
      const tx = await claimToken(tokenId);
      console.log(tx);
      return tx;
    } catch (error) {
      console.error(error);
      return { status: false };
    }
  };

  const onClickClaimBatch = async () => {
    try {
      const withrawableTokens = stakedTokens
        .filter((token) => token.isCompleted)
        .map((token) => token.tokenId);
      // console.log(withrawableTokens);
      // console.log(withrawableTokens);
      if (withrawableTokens.length === 0)
        return toast.error("No tokens to claim");

      dispatch(SET_TOTAL_CARD_LOADING(true));
      const _isWithdrawable = await isWithdrawableBatch(withrawableTokens);
      console.log(_isWithdrawable);
      if (!_isWithdrawable) return toast.error("This didn't work.");
      const tx = await claimTokenBatch(withrawableTokens);
      console.log(tx);
      dispatch(SET_STAKED_TOKENS());
      // 상태관리 업데이트
      // console.log("_isWithdrawable:", _isWithdrawable);
    } catch (error) {
      console.error(error);
    }
    // setIsClaimBtnLoading(false);
    dispatch(SET_TOTAL_CARD_LOADING(false));
  };

  //FIXME: styles
  const styles = {
    addNFT: {
      visibility: isVisible ? "visible" : "hidden",
    } as React.CSSProperties,
  };

  //FIXME: useEffect

  useEffect(() => {
    setIsVisible(stackingPossibleList.includes(currNavName));
  }, [currNavName]);

  useEffect(() => {
    if (!account) return;
    const init = async () => {
      dispatch(SET_UNSTAKED_TOKENS());
      dispatch(SET_STAKED_TOKENS());
      dispatch(SET_REWARD_TOKENS());
      dispatch(SET_APPROVAL_FOR_ALL(await isApprovedForAll()));
    };
    init();
  }, [account]);

  //reset all states
  useEffect(() => {
    if (account) return;
    dispatch(RESET_TOKENS());
  }, [account]);

  useEffect(() => {
    const init = async () => {
      const res = await getWallets();
      console.log("🟥🟥getWallets🟥🟥", res);
    };
    init();
  }, []);

  // when token unstaked or collected, updated
  useEffect(() => {
    // done
    const availableCoins = stakedTokens.filter((token) => token.isCompleted);
    const availableCoinsSum = availableCoins.reduce(
      (acc, curr) => acc + curr.period * 50,
      0
    );
    dispatch(SET_AVAILABLE_CLAIM(availableCoinsSum));
    dispatch(SET_REWARD_TOKENS());
  }, [stakedTokens]);

  // FIXME: Components

  const DashboardComponent = () => {
    const newUnstakedTokens = unstakedTokens.map((token) => {
      return { ...token, isStaked: false };
    });
    const newStakedTokens = stakedTokens.map((token) => {
      return { ...token, isStaked: true };
    });

    const combinedList = [...newUnstakedTokens, ...newStakedTokens];
    const sortedById = combinedList.sort((a, b) => a.tokenId - b.tokenId);

    return (
      <>
        {sortedById.map((token, i) => {
          if (token.isStaked)
            return (
              <CardComponent
                name={`Mystery Ape #${token.tokenId}`}
                key={token.tokenId + "DashboardComponent_isStaked"}
                token={token as IStackingToken}
                handleClickCollect={handleClickCollect}
              />
            );
          if (!token.isStaked)
            return (
              <UnStackedComponent
                name={`Mystery Ape #${token.tokenId}`}
                key={token.tokenId + "DashboardComponent_notStaked"}
                bgColor={isApproved ? RANDOM_BG_COLORS[2] : "#fff"}
                isApproved={isApproved}
                tokenId={Number(token.tokenId)}
                handleClickStake={handleClickStackModalOn}
              />
            );
        })}
      </>
    );
  };
  const StakingApesComponent = () => {
    const _arr = [...stakedTokens];
    const _sortedById = _arr.sort((a, b) => a.tokenId - b.tokenId);
    // console.log("_sortedById", _sortedById);
    return _sortedById.map((token, i) => (
      <CardComponent
        name={`Mystery Ape #${token.tokenId}`}
        key={token.tokenId + "StakingApesComponent"}
        token={token as IStackingToken}
        handleClickCollect={handleClickCollect}
      />
    ));
  };

  const UnstakingApesComponent = () => {
    const _arr = [...unstakedTokens];
    const _sortedById = _arr.sort((a, b) => a.tokenId - b.tokenId);
    return _sortedById.map((token, i) => (
      <UnStackedComponent
        name={`Mystery Ape #${token.tokenId}`}
        key={token.tokenId + "UnstakingApesComponent"}
        bgColor={isApproved ? RANDOM_BG_COLORS[2] : "#fff"}
        isApproved={isApproved}
        tokenId={Number(token.tokenId)}
        handleClickStake={handleClickStackModalOn}
      />
    ));
  };

  const EmergencyUnstakeComponents = () => {
    const notCompletedTokens = stakedTokens.filter(
      (token) => !token.isCompleted
    );
    const _arr = [...notCompletedTokens];
    const _sortedById = _arr.sort((a, b) => a.tokenId - b.tokenId);
    return _sortedById.map((token, i) => (
      <EmergencyCard
        key={token.tokenId + "EmergencyUnstakeComponents"}
        name={`Mystery Ape #${token.tokenId}`}
        token={token}
      />
    ));
  };
  const ActivityComponent = () => {
    return (
      <span
        style={{
          fontSize: "3rem",
          fontWeight: 600,
          gridColumn: "span 4",
        }}
      >
        comming soon!
      </span>
    );
  };

  const AddNftComponent = () => {
    return currNavName !== navNames.EMERGENCY_UNSTAKE ? (
      <Link href="/mint">
        <div style={{ display: "flex" }}>
          <span>
            <IoMdAdd />
          </span>
          <span>Add NFT</span>
        </div>
      </Link>
    ) : (
      <div style={{ background: "yellow" }}>
        you couldn&apos;t get reward before the time passed you set
      </div>
    );
  };

  return (
    <Section style={{ flex: 1 }}>
      {!account ? (
        <div
          style={{
            // fontWeight: 400,
            fontSize: "1.2rem",
            background: "yellow",
            padding: ".375rem",
            color: theme.colors["gray-500"],
          }}
        >
          Please connect your wallet
        </div>
      ) : (
        <WrapperEl>
          <Header>
            <Title>
              <span>Staking </span>
              <span>#{currNavName}</span>
            </Title>
            <Navigator>
              <NavButton name="Dashboard" href={navNames.DASHBOARD} />
              <NavButton name="Staking Apes" href={navNames.STACKING_APES} />
              <NavButton
                name="Unstaking Apes"
                href={navNames.UNSTACKING_APES}
              />
              <NavButton name="Activity" href={navNames.ACTIVITY} />
            </Navigator>
          </Header>
          <Body>
            <Indicator isTotalCardLoading={isTotalCardLoading}>
              <div className="item__1">
                <StatComponent
                  name="Total Apes"
                  value={`${stakedTokens.length + unstakedTokens.length} apes`}
                />
                <StatComponent
                  name="Stacked Apes"
                  value={`${stakedTokens.length} apes`}
                />
                <StatComponent
                  name="You have earned"
                  value={`${rewardTokens} coin`}
                />
                <StatComponent
                  name="Available for claim"
                  value={`${availableClaim} coin`}
                />
                <div className="btn__container">
                  <Button_1 onClick={onClickClaimBatch}>claim</Button_1>

                  <Link href={`/staking/${navNames.EMERGENCY_UNSTAKE}`}>
                    <Button_1 bgColor="black" fontColor="white">
                      emergency unstake
                    </Button_1>
                  </Link>
                </div>
              </div>
              <div className="item__2">
                <StatComponent name="Paid Out" value="0" />
              </div>
            </Indicator>
            <Contents>
              {/* <div style={styles.addNFT}> */}
              <div>{AddNftComponent()}</div>
              <Container>
                {/* <AnimatePresence> */}
                {currNavName === navNames.DASHBOARD && DashboardComponent()}
                {currNavName === navNames.STACKING_APES &&
                  StakingApesComponent()}
                {currNavName === navNames.UNSTACKING_APES &&
                  UnstakingApesComponent()}

                {currNavName === navNames.EMERGENCY_UNSTAKE &&
                  EmergencyUnstakeComponents()}

                {currNavName === navNames.ACTIVITY && ActivityComponent()}
                {!whitelistNavNames.includes(currNavName) && "404"}
                {/* </AnimatePresence> */}
              </Container>
            </Contents>
          </Body>
          <AnimatePresence>
            {isOpen && <StakeModal isOpen={isOpen} handleClose={handleClose} />}
          </AnimatePresence>
        </WrapperEl>
      )}
      <Toaster />
    </Section>
  );
};

export default StakingDetail;

const WrapperEl = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  height: 100%;
  /* color: ${(props) => props.theme.colors.white}; */
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 2rem 0;
`;
const Title = styled.div`
  > span:nth-child(1) {
    font-weight: 800;
    font-size: ${(props) => props.theme.fontSizes.font2xl};
  }
  > span:nth-child(2) {
    font-weight: 600;
    font-size: ${(props) => props.theme.fontSizes.fontxl};

    /* font-size: ${(props) => props.theme.fontSizes.fontxl}; */
  }
`;

const Navigator = styled.nav`
  display: flex;
  gap: 2.25rem;
`;
const Body = styled.div`
  width: 100%;
`;

const disabledBtn = css`
  background: ${(props) => props.theme.colors.gray3};
  cursor: not-allowed;
  pointer-events: none;
  color: ${(props) => props.theme.colors.white};
`;
const Indicator = styled.div<{ isTotalCardLoading: boolean }>`
  display: flex;
  > div {
    display: flex;
  }
  .item__1 {
    gap: 2rem;
  }
  justify-content: space-between;
  .btn__container {
    align-self: flex-end;
    gap: 0.75rem;
    display: flex;

    > button {
      ${({ isTotalCardLoading }) => isTotalCardLoading && disabledBtn};
    }
  }
`;
const Contents = styled.div`
  padding: 2rem 1.8rem;
  > div:first-child {
    padding: 2rem 0;
    padding-bottom: 3rem;
    font-weight: 500;
    display: flex;
    /* font-size: ${(props) => props.theme.fontSizes.fontmd}; */
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    /* color: #04e1d6; */
  }
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  > span:nth-child(1) {
    font-weight: 500;
    color: ${(props) => props.theme.colors["w-gray1"]};
  }
  > span:nth-child(2) {
    font-weight: 700;
    font-size: 1.7em;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(17rem, 1fr));
  gap: 1rem;
  min-height: 30vh;
`;

const Image = styled.img`
  padding: 1rem;
`;
const NavButtonContainer = styled.div`
  font-weight: 500;
  > div {
    cursor: pointer;

    border-radius: 1.5rem;
    padding: 0.5rem 1rem;
    border: 2px solid ${(props) => props.theme.colors.black};
    box-shadow: 0.2rem 0.2rem 0 ${(props) => props.theme.colors.black};
    :active {
      transform: translate(0.1rem, 0.1rem);
      box-shadow: 0.1rem 0.1rem 0 ${(props) => props.theme.colors.black};
    }
  }
`;
