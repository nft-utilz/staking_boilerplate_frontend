import { ITokens } from ".";

export interface ILoading {
  loading: "idle" | "pending" | "succeeded" | "failed";
}

export interface ICommon {
  clickedTokenId: number;
  isApprovedForAll: boolean;
  isTotalCardLoading: boolean;
  isModalCardLoading: boolean;
  availableClaim: number;
  isWalletModalOpen: boolean;
  isClaimBtnDisabled: boolean;
}

export interface ISelector {
  ercTokens: {
    entities: ITokens;
    loading: ILoading["loading"];
  };
  common: {
    entities: ICommon;
    loading: ILoading["loading"];
  };
}
