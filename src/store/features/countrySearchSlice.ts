import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

// Define a type for the slice state
interface CountrySearchState {
  search: string;
}

// Define the initial state using that type
const initialState: CountrySearchState = {
  search: '',
};

export const countrySearchSlice = createSlice({
  name: 'countrySearch',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { setValue } = countrySearchSlice.actions;

// SELECTORS
export const selectCountrySearch = (state: RootState) =>
  state.countrySearch.search;

export default countrySearchSlice.reducer;
