import { HOUR, MILLI_SECOND, REWARD_PER_HOUR } from "../constants";
import { IStackingToken } from "../interfaces";
import { ethers } from "ethers";

export const cutWallet = (wallet: string) =>
  `${wallet.substring(0, 6)}...${wallet.substring(
    wallet.length - 4,
    wallet.length
  )}`;

export const getOrganizedTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes % 60;
  if (minutes < 60) return `${minutes}M`;
  if (minutes % 60 === 0) return `${hours}H`;
  return `${hours}H ${minutesLeft}M`;
};

//FIXME:  used in StakingCard
export const getTimePercent = (
  token: IStackingToken,
  nowTime: number
): [number, boolean] => {
  // [percent,isCompleted]
  const timeGap = token.finishingTime - token.startTime;
  const millisecond = Number(new Date(token.finishingTime * 1000)) - nowTime;
  const toSecond = millisecond / 1000;
  const fraction = (timeGap - toSecond) / timeGap;
  if (millisecond < 0) return [100, true];
  // console.log("fraction:", fraction);
  return [fraction * 100, false];
};

export const getEarn = (
  token: IStackingToken,
  nowTime: number
): [number, boolean] => {
  const timeGap = token.finishingTime - token.startTime;
  const toMillisecond =
    Number(new Date(token.finishingTime * MILLI_SECOND)) - nowTime;
  const toSecond = toMillisecond / MILLI_SECOND;
  const fraction = (timeGap - toSecond) / HOUR;
  if (toSecond < 0) return [(REWARD_PER_HOUR * timeGap) / HOUR, true];
  const earn = fraction * REWARD_PER_HOUR;
  // console.log(earn);
  return [Number(earn.toFixed(2)), false];
};

export const getWatingTime = (_time: number, stakingTimeGap: number): number =>
  Number((((_time / 100) * 60 * stakingTimeGap) / HOUR).toFixed(0));

export const truncateAddress = (address: string) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};

export const toHex = (num: number) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

export const getBalance = async (account: string): Promise<number> => {
  try {
    const network = "rinkeby"; // use rinkeby testnet
    const provider = ethers.getDefaultProvider(network);
    const balance = await provider.getBalance(account);
    // convert a currency unit from wei to ether
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log(`balance: ${balanceInEth} ETH`);
    return Number(Number(balanceInEth).toFixed(2));
  } catch (error) {
    console.error(error);
    return 0;
  }
};
