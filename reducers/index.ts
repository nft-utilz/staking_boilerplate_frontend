import { combineReducers } from "@reduxjs/toolkit";
import ercTokens from "./tokens";
import common from "./common";

const rootReducer = combineReducers({
  ercTokens,
  common,
});

export default rootReducer;
