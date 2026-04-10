import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  current: null,
};

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    setPlan(state, action) {
      state.current = action.payload;
    },
    clearPlan(state) {
      state.current = null;
    },
  },
});

export const { setPlan, clearPlan } = planSlice.actions;
export default planSlice.reducer;
