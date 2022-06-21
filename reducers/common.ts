import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICommon, ILoading, ISelector } from "../interfaces/redux";
import { setApprovalForAll } from "../utils/nftInteract";
const common: ICommon = {
  clickedTokenId: 0,
  isApprovedForAll: false,
  isTotalCardLoading: false,
  isModalCardLoading: false,
  availableClaim: 0,
  isWalletModalOpen: false,
  isClaimBtnDisabled: false,
};

interface IInitialState {
  entities: ICommon;
  loading: ILoading["loading"];
}
const initialState: IInitialState = {
  entities: common,
  loading: "idle",
};

export const APPROVE_FOR_ALL = createAsyncThunk(
  "common/APPROVE_FOR_ALL", // define the thunk name
  async () => {
    try {
      const isApprovedForAll = await setApprovalForAll();
      return isApprovedForAll;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
);
// ActionReducerMapBuilder<IInitialState>

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    SET_CLICKED_CARD: (state, action: PayloadAction<number>) => {
      console.log(action);
      state.entities.clickedTokenId = action.payload;
    },
    SET_APPROVAL_FOR_ALL: (state, action: PayloadAction<boolean>) => {
      state.entities.isApprovedForAll = action.payload;
    },
    SET_TOTAL_CARD_LOADING: (state, action: PayloadAction<boolean>) => {
      state.entities.isTotalCardLoading = action.payload;
    },
    SET_MODAL_CARD_LOADING: (state, action: PayloadAction<boolean>) => {
      state.entities.isModalCardLoading = action.payload;
    },
    SET_AVAILABLE_CLAIM: (state, action: PayloadAction<number>) => {
      state.entities.availableClaim = action.payload;
    },
    SET_WALLET_MODAL_OPEN: (state, action: PayloadAction<boolean>) => {
      state.entities.isWalletModalOpen = action.payload;
    },
    SET_IS_CLAIM_BTN_DISABLED: (state, action: PayloadAction<boolean>) => {
      state.entities.isClaimBtnDisabled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      APPROVE_FOR_ALL.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        state.entities.isApprovedForAll = action.payload;
        console.log(state.entities.isApprovedForAll);
      }
    );
  },
});

export default commonSlice.reducer;

export const {
  SET_CLICKED_CARD,
  SET_APPROVAL_FOR_ALL,
  SET_TOTAL_CARD_LOADING,
  SET_MODAL_CARD_LOADING,
  SET_AVAILABLE_CLAIM,
  SET_WALLET_MODAL_OPEN,
  SET_IS_CLAIM_BTN_DISABLED,
} = commonSlice.actions;

export const getClickedTokenId = (state: ISelector) =>
  state.common.entities.clickedTokenId;

export const getIsApprovedForAll = (state: ISelector) =>
  state.common.entities.isApprovedForAll;

export const getTotalCardLoading = (state: ISelector) =>
  state.common.entities.isTotalCardLoading;

export const getModalCardLoading = (state: ISelector) =>
  state.common.entities.isModalCardLoading;

export const getAvailableClaim = (state: ISelector) =>
  state.common.entities.availableClaim;

export const getIsWalletModalOpen = (state: ISelector) =>
  state.common.entities.isWalletModalOpen;

export const getIsClaimBtnDisabled = (state: ISelector) =>
  state.common.entities.isClaimBtnDisabled;
