import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counter = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<number>) => {
     state.value += 1;
    },
    decrease: (state, action: PayloadAction<number>) => {
      state.value -= action.payload;
    }
  },
});

export const {
  increment,
  decrease
} = counter.actions

export default counter.reducer
