import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { GenericList } from '../../models';

interface RegisterUser {
  selectedCountry: GenericList;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  promoSms: boolean;
}

interface RegisterState {
  user: RegisterUser | null;
  changePassword: {
    phone: string;
  };
}

const initialState: RegisterState = {
  user: null,
  changePassword: {
    phone: '',
  },
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegisterUser: (state, action: PayloadAction<RegisterUser | null>) => {
      state.user = action.payload;
    },
    setChangePasswordPhone: (state, action: PayloadAction<string>) => {
      state.changePassword.phone = action.payload;
    },
  },
});

export const { setRegisterUser, setChangePasswordPhone } =
  registerSlice.actions;

// selectors
const selectSelf = (state: RootState) => state;

export const selectRegisterUser = createSelector(
  selectSelf,
  (state) => state.register.user,
);

export const selectChangePasswordPhone = createSelector(
  selectSelf,
  (state) => state.register.changePassword.phone,
);

export default registerSlice.reducer;
