import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../interfaces";
import { ILoading } from "../interfaces/redux";

const users: IUser[] = [];

interface IInitialState {
  entities: IUser[];
  loading: ILoading["loading"];
}

const initialState: IInitialState = {
  entities: users,
  loading: "idle",
};

export const SET_USER = createAsyncThunk(
  "users/SET_USER",
  async (wallets: string[]) => {
    try {
      // const res = await getUserInfoBatch(wallets)
      const res: string[] = [];
      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
);
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});
