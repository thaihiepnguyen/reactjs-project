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
    setUser: (state, action: PayloadAction<User | null>) => {
     state.user = action.payload;
     // if(state.user?.avatarUrl && !state.user.avatarUrl.includes('http')){
     //  state.user.avatarUrl = `${process.env.API_URL}\\${state.user.avatarUrl}`
     // }
    },
  },
});

export const {
  setUser,
} = user.actions

export default user.reducer
