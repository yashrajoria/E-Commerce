import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  totalPages: 0,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    nextPage: (state) => {
      if (state.page < state.totalPages) {
        state.page += 1;
      }
    },
    previousPage: (state) => {
      if (state.page > 1) {
        state.page -= 1;
      }
    },
    setPage: (state, action) => {
      const newPage = action.payload;
      if (newPage >= 1 && newPage <= state.totalPages) {
        state.page = newPage;
      }
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
  },
});

export const { nextPage, previousPage, setPage, setTotalPages } =
  paginationSlice.actions;
export default paginationSlice.reducer;
