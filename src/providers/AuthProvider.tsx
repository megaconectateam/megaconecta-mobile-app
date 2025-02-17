import React, { createContext, useEffect, useState } from 'react';

import { OneSignal } from 'react-native-onesignal';
import { useQuery, useQueryClient } from 'react-query';
import { MegaUser, QueryTypes } from '../models';
import { AccountServices, ReferralServices } from '../services';
import { isLoadingQueries } from '../utils';
import { LocalStorageService } from '../utils/LocalStorageService';
import { useLoadingContext } from './LoadingProvider';

type AuthContextContract = {
  isAuth: boolean;
  authUser: MegaUser | null;
  setUser: (user: MegaUser) => Promise<boolean>;
  token: string | null;
  setToken: (token: string) => Promise<boolean>;
  logOut: () => Promise<void>;
  referralBalance: number;
  userBalance: number;
  reloadReferralBalance: () => void;
  reloadUserBalance: () => void;
};

const AuthContext = createContext<AuthContextContract>({
  isAuth: false,
  authUser: null,
  setUser: async () => {
    return true;
  },
  token: null,
  setToken: async () => {
    return true;
  },
  logOut: async () => {},

  referralBalance: 0,
  userBalance: 0,
  reloadReferralBalance: () => {},
  reloadUserBalance: () => {},
});

const AuthProvider = ({ children }: any) => {
  const queryCache = useQueryClient();

  const { setLoading } = useLoadingContext();

  const [authUser, setAuthUser] = useState<MegaUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [referralBalance, setReferralBalance] = useState<number>(0);

  const getAuthUser = async () => {
    const user = await LocalStorageService.getAuthenticatedUser();

    if (user) {
      setAuthUser(user);
    } else {
      setAuthUser(null);
    }
  };

  const getToken = async () => {
    const authToken: string | null = await LocalStorageService.getToken();
    setToken(authToken);
  };

  const setAuthToken = async (authToken: string) => {
    try {
      const success = await LocalStorageService.setToken(authToken);

      if (success) {
        setToken(authToken);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  const setUser = async (user: MegaUser): Promise<boolean> => {
    try {
      const success = await LocalStorageService.setAuthenticatedUser(user);

      if (success) {
        setAuthUser(user);
        setOneSignal(user);

        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  const setOneSignal = (user: MegaUser) => {
    if (user.EMAILADDRESS) {
      OneSignal.User.addEmail(user.EMAILADDRESS);
    }

    OneSignal.User.addTag('username', user.USERNAME);
  };

  const logOut = async () => {
    queryCache.invalidateQueries();
    await LocalStorageService.removeAuthenticatedUser();
    await LocalStorageService.removeToken();
    setAuthUser(null);
    setToken(null);
  };

  const balanceQuery = useQuery(
    QueryTypes.GetBalance,
    AccountServices.getBalance,
    {
      enabled: !!token && !!authUser,
      onError: (err: any) => {
        setLoading(false);
        if (err && err.message === 'Unauthenticated.') {
          logOut();
        }
      },
    },
  );

  const referralBalanceQuery = useQuery(
    QueryTypes.GetReferralBalance,
    ReferralServices.getReferralBalance,
    {
      enabled: !!token && !!authUser,
      onError: (err: any) => {
        setLoading(false);
        if (err && err.message === 'Unauthenticated.') {
          logOut();
        }
      },
    },
  );

  useEffect(() => {
    setLoading(isLoadingQueries([balanceQuery, referralBalanceQuery]));
  }, [balanceQuery.status, referralBalanceQuery.status]);

  useEffect(() => {
    if (balanceQuery.data) {
      setUserBalance(Number(balanceQuery.data.balance.toFixed(2)));
    }
  }, [balanceQuery.data]);

  useEffect(() => {
    if (referralBalanceQuery.data) {
      setReferralBalance(referralBalanceQuery.data);
    }
  }, [referralBalanceQuery.data]);

  const reloadUserBalance = () => {
    queryCache.invalidateQueries(QueryTypes.GetBalance);
    balanceQuery.refetch();
  };

  const reloadReferralBalance = () => {
    queryCache.invalidateQueries(QueryTypes.GetReferralBalance);
    referralBalanceQuery.refetch();
  };

  useEffect(() => {
    getAuthUser();
    getToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setUser,
        logOut,
        setToken: setAuthToken,
        token,
        isAuth: !!token && !!authUser,

        userBalance,
        referralBalance,
        reloadUserBalance,
        reloadReferralBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
