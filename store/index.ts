import {
  AnyAction,
  configureStore,
  ThunkAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import rootReducer from "../reducers";
import { createLogger } from "redux-logger";
import { createPromise } from "redux-promise-middleware";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const logger = createLogger();

const pm = createPromise({
  promiseTypeSuffixes: ["PENDING", "SUCCESS", "FAILURE"],
  promiseTypeDelimiter: "/",
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(pm)
      // prepend and concat calls can be chained
      .concat(logger),
});
//middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), logger, pm],
/* Types */
export type AppDispatch = typeof store.dispatch;
export type ReduxState = ReturnType<typeof rootReducer>;
export type TypedDispatch = ThunkDispatch<ReduxState, any, AnyAction>;
export type TypedThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  AnyAction
>;
export const useTypedDispatch = () => useDispatch<TypedDispatch>();
export const useTypedSelector: TypedUseSelectorHook<ReduxState> = useSelector;

export default store;
