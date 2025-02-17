import { createContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { MegaProfile, QueryTypes } from '../models';
import { AccountServices } from '../services';

type ProfileContextContract = {
  profile: MegaProfile | null;
  canDoRemittance: boolean;
  refetchProfile: () => void;
};

const ProfileContext = createContext<ProfileContextContract>({
  profile: null,
  canDoRemittance: false,
  refetchProfile: () => {},
});

const ProfileProvider = ({ children }: any) => {
  const [profile, setProfile] = useState<MegaProfile | null>(null);

  const profileQuery = useQuery(
    QueryTypes.GetProfile,
    AccountServices.getProfileData,
  );

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  const refetchProfile = () => {
    profileQuery.refetch();
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        canDoRemittance: profile?.user?.accept_remittance || false,
        refetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileProvider };
