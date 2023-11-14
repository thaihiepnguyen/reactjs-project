import { User } from "@/models/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
     state.user = action.payload;
    },
  },
});

export const {
  setUser,

} = user.actions

export default user.reducer
