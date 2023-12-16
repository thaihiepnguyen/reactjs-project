import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import counterReducer from "./reducers/counter";
import userReducer from "./reducers/user";
import loadingReducer from "./reducers/loading";
import courseReducer from "./reducers/courses";
import logger from "redux-logger";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "./saga";

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: {
    counterReducer,
    userReducer,
    loadingReducer,
    courseReducer,
  },
  middleware: [logger, sagaMiddleware],
  devTools: process.env.NODE_ENV != "production",
});

sagaMiddleware.run(rootSaga)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
