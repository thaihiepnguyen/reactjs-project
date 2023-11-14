import {configureStore} from '@reduxjs/toolkit'
import counterReducer from "./reducers/counter"
import userReducer from "./reducers/user"

export const store = configureStore({
  reducer: {
    counterReducer,
    userReducer
  },
  devTools: process.env.NODE_ENV != 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;