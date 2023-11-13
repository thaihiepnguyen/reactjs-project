import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number | null;
  email: string | null;
  avatar: string | null;
  fullname: string | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  avatar: null,
  fullname: null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.fullname = action.payload.fullname;
    },
  },
});

export const {
  setUser,
} = user.actions

export default user.reducer
