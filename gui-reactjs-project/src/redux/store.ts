import {configureStore} from '@reduxjs/toolkit'
import counterReducer from "./reducers/counter"
import userReducer from "./reducers/user"
import loadingReducer from "./reducers/loading"
import logger from "redux-logger"

export const store = configureStore({
  reducer: {
    counterReducer,
    userReducer,
    loadingReducer
  },
  middleware: [logger],
  devTools: process.env.NODE_ENV != 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;