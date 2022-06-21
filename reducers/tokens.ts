import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStackingToken, ITokens } from "../interfaces";
import { ILoading, ISelector } from "../interfaces/redux";
import { getIsApprovedBatch } from "../utils/getNftInteract";
import { rewardBalanceOf } from "../utils/rewardInteract";
import {
  getStakingTokenInfo,
  getStakingTokenInfoBatch,
} from "../utils/StakeInteract";

interface IInitialState {
  entities: ITokens;
  loading: ILoading["loading"];
}
const tokens: ITokens = {
  stakedTokens: [],
  unStakedTokens: [],
  rewardToken: 0,
};

const initialState: IInitialState = {
  entities: tokens,
  loading: "idle",
};

//
export const SET_UNSTAKED_TOKENS = createAsyncThunk(
  "tokens/SET_UNSTAKED_TOKENS", // define the thunk name
  async () => {
    try {
      const response = await getIsApprovedBatch();
      return response;
    } catch (error) {
      return [];
    }
  }
);

export const SET_STAKED_TOKENS = createAsyncThunk(
  "tokens/SET_STAKED_TOKENS", // define the thunk name
  async () => {
    try {
      const response = await getStakingTokenInfoBatch();
      return response;
    } catch (error) {
      return [];
    }
  }
);

export const SET_REWARD_TOKENS = createAsyncThunk(
  "tokens/SET_REWARD_TOKENS", // define the thunk name
  async () => {
    try {
      const response = await rewardBalanceOf();
      return response;
    } catch (error) {
      return 0;
    }
  }
);

export const ADD_STAKED_TOKEN = createAsyncThunk(
  "tokens/ADD_STAKED_TOKEN", // define the thunk name
  async (tokenId: number) => {
    try {
      const token = (await getStakingTokenInfo(tokenId)) as IStackingToken;
      return token;
    } catch (error) {
      console.error(error);
    }
  }
);

export const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    DELETE_STAKED_TOKEN: (state, action: PayloadAction<number>) => {
      console.log("DELETE_STAKED_TOKEN", action.payload);
      state.entities.stakedTokens = state.entities.stakedTokens.filter(
        (token) => Number(token.tokenId) !== Number(action.payload)
      );
    },

    UPDATE_STAKED_TOKEN: (state, action: PayloadAction<IStackingToken>) => {
      console.log("UPDATE_STAKED_TOKEN", action.payload);
      const index = state.entities.stakedTokens.findIndex(
        (token) => Number(token.tokenId) === Number(action.payload.tokenId)
      );
      state.entities.stakedTokens[index] = action.payload;
    },
    ADD_UNSTAKED_TOKEN: (state, action: PayloadAction<number>) => {
      console.log("ADD_UNSTAKED_TOKEN", action.payload);

      const newTokenArr = state.entities.unStakedTokens.concat({
        tokenId: Number(action.payload),
        isApproved: true,
      });
      const _organized = newTokenArr.sort((a, b) => a.tokenId - b.tokenId);
      state.entities.unStakedTokens = _organized;
    },
    DELETE_UNSTAKED_TOKEN: (state, action: PayloadAction<number>) => {
      console.log("DELETE_UNSTAKED_TOKEN:", action.payload);
      const newTokens = state.entities.unStakedTokens.filter(
        (token) => Number(token.tokenId) !== Number(action.payload)
      );
      state.entities.unStakedTokens = newTokens;
    },
    UPDATE_UNSTAKED_TOKEN: (state, action) => {},
    RESET_TOKENS: () => initialState,
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(SET_UNSTAKED_TOKENS.fulfilled, (state, action) => {
      state.entities.unStakedTokens = action.payload;
      console.log(state.entities.unStakedTokens);
    });
    builder.addCase(SET_UNSTAKED_TOKENS.rejected, (state, action) => {
      state.entities.unStakedTokens = [];
      console.log("❌error: SET_UNSTAKED_TOKENS ");
    });

    builder.addCase(SET_STAKED_TOKENS.fulfilled, (state, action) => {
      state.entities.stakedTokens = action.payload;
      console.log(state.entities.stakedTokens);
    });

    builder.addCase(SET_REWARD_TOKENS.fulfilled, (state, action) => {
      state.entities.rewardToken = action.payload;
      console.log(state.entities.stakedTokens);
    });

    builder.addCase(ADD_STAKED_TOKEN.fulfilled, (state, action) => {
      if (!action.payload) console.log("❌error: ADD_STAKED_TOKEN ");
      if (!action.payload) return;
      state.entities.stakedTokens.push(action.payload);
    });

    // SET_REWARD_TOKENS
  },
});

export const {
  DELETE_STAKED_TOKEN,
  UPDATE_STAKED_TOKEN,
  ADD_UNSTAKED_TOKEN,
  DELETE_UNSTAKED_TOKEN,
  UPDATE_UNSTAKED_TOKEN,
  RESET_TOKENS,
} = tokenSlice.actions;

export default tokenSlice.reducer;
// Selectors
// interface ISelector {
//   ercTokens: {
//     entities: ITokens;
//     loading: ILoading["loading"];
//   };
// }

export const getStakedToken = (state: ISelector) =>
  state.ercTokens.entities.stakedTokens;

export const getUnStakedToken = (state: ISelector) =>
  state.ercTokens.entities.unStakedTokens;

export const getRewardToken = (state: ISelector) =>
  state.ercTokens.entities.rewardToken;
