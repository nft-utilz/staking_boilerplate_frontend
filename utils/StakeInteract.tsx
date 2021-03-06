import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { HOUR } from "../constants";
import { IStackingToken } from "../interfaces";
import { STAKE } from "../web3Config";
import { getTimePercent } from "./common";

export const web3 = createAlchemyWeb3(
  process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || ""
);

const stakeContract = new web3.eth.Contract(
  STAKE.STAKE_ABI,
  STAKE.STAKE_CONTRACT_ADDRESS
);

export const stake = async (tokenId: number, stakingTime: number) => {
  try {
    // console.log(web3.eth.defaultAccount);
    const tx = await stakeContract.methods
      .stake(tokenId, stakingTime)
      .send({ from: window.ethereum.selectedAddress });
    return tx;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const stakedTokensOfOwner = async () => {
  try {
    const tokens = await stakeContract.methods
      .tokensOfOwner(window.ethereum.selectedAddress)
      .call();
    return tokens;
  } catch (error) {
    console.error(error);
    return;
  }
};
export const getStakingTokenInfo = async (tokenId: number) => {
  try {
    const token = await stakeContract.methods
      .getStakingTokenInfo(tokenId)
      .call();

    const [_, isCompleted] = getTimePercent(token, Number(new Date()));
    return {
      startTime: Number(token.startTime),
      finishingTime: Number(token.finishingTime),
      tokenId: Number(token.tokenId),
      isCompleted: isCompleted,
      period: Number(token.finishingTime - token.startTime) / HOUR,
    };
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getStakingTokenInfoBatch = async (): Promise<
  IStackingToken[] | []
> => {
  try {
    const tokens = await stakeContract.methods
      .getStakingTokenInfoBatch(window.ethereum.selectedAddress)
      .call();

    const processedTokens = tokens.map((token: IStackingToken) => {
      const [_, isCompleted] = getTimePercent(token, Number(new Date()));
      return {
        startTime: Number(token.startTime),
        finishingTime: Number(token.finishingTime),
        tokenId: Number(token.tokenId),
        isCompleted: isCompleted,
        period: Number(token.finishingTime - token.startTime) / HOUR,
      };
    });
    return processedTokens;
  } catch (error) {
    console.error(error);
    return [];
  }
};
//TODO: stake?????? 1??? 2??? 3??? 4????????? ????????? ????????? ??? ??? ????????? ???????????? ????????????
//   Approve to stack
// APPROVED
// ????????? 2?????? stake radio ???????????? ?????????
// radio?????? ?????????????????? ?????????
// ????????? ?????? ?????? ???????????? ?????? ??????
// ????????? ??? ????????? ???
export const unstake = async (tokenId: number) => {
  try {
    const tx = await stakeContract.methods
      .unstake(tokenId)
      .send({ from: window.ethereum.selectedAddress });
    console.log("unstake tx:", tx);
    return tx;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const emergencyUnstake = async (tokenId: number) => {
  try {
    const tx = await stakeContract.methods
      .emergencyUnstake(tokenId)
      .send({ from: window.ethereum.selectedAddress });
    return tx;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const isWithdrawable = async (tokenId: number): Promise<boolean> => {
  try {
    const isWithdrawable = await stakeContract.methods
      .isWithdrawable(tokenId)
      .call();
    console.log("isWithdrawable:", isWithdrawable);
    return isWithdrawable;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const claimToken = async (tokenId: number) => {
  try {
    const tx = await stakeContract.methods
      .claimToken(tokenId)
      .send({ from: window.ethereum.selectedAddress });
    return tx;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const claimTokenBatch = async (tokenIds: number[]) => {
  try {
    const tx = await stakeContract.methods
      .claimTokenBatch(tokenIds)
      .send({ from: window.ethereum.selectedAddress });
    return tx;
  } catch (error) {
    console.error(error);
    return;
  }
};
