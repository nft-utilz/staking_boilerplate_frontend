export interface IMintStatus {
  success: any;
  message: any;
}

export interface IStackingToken {
  startTime: number;
  finishingTime: number;
  tokenId: number;
  isCompleted: boolean;
  period: number;
}
export interface IUnStackedToken {
  isApproved: boolean;
  tokenId: number;
}

export interface ITokens {
  stakedTokens: IStackingToken[];
  unStakedTokens: IUnStackedToken[];
  rewardToken: number;
}

export interface IStakedInfo {
  isStaked: boolean;
  status: boolean;
}

export interface IStakeTime {
  time: string;
  contractIndex: number;
}

export interface IStakingCompletedStatus {
  isTimeDone: boolean;
  isEarnDone: boolean;
}

export type TProvider = "injected" | "walletConnect" | "coinbaseWallet";
export type TNetworkParam = "0x63564c40" | "0xa4ec";

export interface IUser {
  wallet: string;
  successedTokenNumber: number;
}
