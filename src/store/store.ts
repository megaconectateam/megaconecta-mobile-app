import { configureStore } from '@reduxjs/toolkit';

import countrySearchReducer from './features/countrySearchSlice';
import registerReducer from './features/registerSlice';

export const store = configureStore({
  reducer: {
    countrySearch: countrySearchReducer,
    register: registerReducer,
  },
});
