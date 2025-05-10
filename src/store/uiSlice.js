import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tabs: ["Home"],
  currentTab: "Home",
  formMode: "modal", // 'modal' | 'split' | 'page'
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFormMode(state, action) {
      state.formMode = action.payload;
    },
    openTab(state, action) {
      const tab = action.payload;
      if (!state.tabs.includes(tab)) {
        if (state.tabs.length >= 7) state.tabs.shift();
        state.tabs.push(tab);
      }
      state.currentTab = tab;
    },
    closeTab(state, action) {
      const tab = action.payload;
      state.tabs = state.tabs.filter((t) => t !== tab);
      if (state.currentTab === tab) {
        state.currentTab = state.tabs.length
          ? state.tabs[state.tabs.length - 1]
          : "Home";
      }
    },
    setTab(state, action) {
      state.currentTab = action.payload;
    },
  },
});

export const { setFormMode, openTab, closeTab, setTab } = uiSlice.actions;
export default uiSlice.reducer;
