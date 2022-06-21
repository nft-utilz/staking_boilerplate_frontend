import { IStakeTime } from "../interfaces";
import { NFT } from "../web3Config";

const DASHBOARD = "dashboard";
const STACKING_APES = "stacking-apes";
const UNSTACKING_APES = "unstacking-apes";
const ACTIVITY = "activity";
const EMERGENCY_UNSTAKE = "emergency";

export const navNames = {
  DASHBOARD,
  STACKING_APES,
  UNSTACKING_APES,
  ACTIVITY,
  EMERGENCY_UNSTAKE,
};

export const RANDOM_BG_COLORS = [
  "#ffb3ba", //빨
  "#ffdfba", //주
  "#ffffba", // 노
  "#baffc9", //초
  "#bae1ff", //파
];

const MINT_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
const ZERO_TOPIC =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
// Create the log options object.

export const HACKR_DAO_MINT_EVENTS = {
  address: NFT.NFT_CONTRACT_ADDRESS,
  topics: [MINT_TOPIC, ZERO_TOPIC],
};

export const STAKE_TIME_ARR: IStakeTime[] = [
  { time: "1", contractIndex: 0 },
  { time: "2", contractIndex: 1 },
  { time: "3", contractIndex: 2 },
  { time: "4", contractIndex: 3 },
  { time: "5", contractIndex: 4 },
];

export const DECIMAL = 18;

export const MILLI_SECOND = 1000;

export const HOUR = 3600;
export const REWARD_PER_HOUR = 50;
