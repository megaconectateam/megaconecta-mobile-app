import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import i18n from 'i18next';
import { toLower } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useQuery } from 'react-query';
import { SVGs } from '../../../assets/svg';
import {
  ConsentModal,
  ContactSelector,
  CountrySelectorInput,
  WithdrawCommissionModal,
} from '../../../components';
import {
  FontType,
  MegaButton,
  MegaText,
  ScreenWithKeyboard,
} from '../../../components/ui';
import { ContactPhone, GenericList, QueryTypes } from '../../../models';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { useGlobalModalContext, useLoadingContext } from '../../../providers';
import { ProfileContext } from '../../../providers/ProfileProvider';
import { CountryServices, ReferralServices } from '../../../services';
import { Colors } from '../../../themes';
import {
  convertAuthCountryToGenericList,
  currencyFormat,
} from '../../../utils';

const REFERRAL_COMMISSION = '5 USD';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'ReferralContainer'
>;

export const ReferralContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { profile } = useContext(ProfileContext);
  const { showModal, hideModal } = useGlobalModalContext();

  const [consentModalVisible, setConsentModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [referralBalance, setReferralBalance] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<GenericList | null>(
    null,
  );
  const [countryList, setCountryList] = useState<GenericList[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactPhone | null>(
    null,
  );

  const referralBalanceQuery = useQuery(
    QueryTypes.GetReferralBalance,
    () => {
      setLoading(true, { queueName: 'referralBalance' });
      return ReferralServices.getReferralBalance();
    },
    {
      staleTime: 0,
      onSettled: () => setLoading(false, { queueName: 'referralBalance' }),
    },
  );

  const countryQuery = useQuery(
    QueryTypes.GetAuthCountries,
    () => {
      setLoading(true, { queueName: 'authCountries' });
      return CountryServices.getAllAuthorizedCountries();
    },
    {
      onSettled: () => setLoading(false, { queueName: 'authCountries' }),
    },
  );

  useEffect(() => {
    if (referralBalanceQuery.status === 'success') {
      setReferralBalance(referralBalanceQuery.data);
    }
  }, [referralBalanceQuery.data]);

  useEffect(() => {
    const country = toLower(profile?.user.address.country) || 'usa';
    if (countryQuery.data?.length) {
      const usa = countryQuery.data.find(
        (i) => i.count_cod?.toLowerCase() === country,
      );

      setSelectedCountry(
        convertAuthCountryToGenericList(usa || countryQuery.data[0]),
      );

      setCountryList(countryQuery.data.map(convertAuthCountryToGenericList));
    }
  }, [countryQuery.data]);

  const submitReferral = async () => {
    try {
      if (!selectedContact || !selectedCountry) {
        return;
      }

      setLoading(true, { queueName: 'submitReferral' });

      const countryCode = selectedCountry.extraLabel || '';
      const phone = selectedContact.phoneNumber.slice(countryCode.length);

      const response = await ReferralServices.sendReferral({
        country: selectedCountry.value,
        language: i18n.language,
        phone,
      });

      if (response) {
        showModal({
          type: 'success',
          title: 'Megaconecta',
          description: t('referralSection.successDescription'),
          buttons: [
            {
              id: 'close',
              title: t('close'),
              onPress: () => {
                hideModal();
                navigation.goBack();
              },
              variant: 'secondary',
            },
            {
              id: 'report',
              title: t('referralSection.seeReferralReport'),
              variant: 'link',
              onPress: () => {
                navigation.goBack();
                hideModal();
              },
            },
          ],

          onClose: () => {},
        });
      } else {
        setScreenErrorMessage(t('referralSection.genericError'));
      }
    } catch (error: any) {
      if (
        (error?.error ?? error) === 'EXISTING_REFERRAL' ||
        (error?.error ?? error) === 'EXISTING_USERNAME'
      ) {
        setScreenErrorMessage(t('referralSection.duplicatedError'));
      } else {
        setScreenErrorMessage(t('referralSection.genericError'));
      }
    } finally {
      setLoading(false, { queueName: 'submitReferral' });
    }
  };

  const setScreenErrorMessage = (error: string) => {
    setLoading(false, { queueName: 'submitReferral' });

    showModal({
      type: 'error',
      title: t('error'),
      description: error,
      buttons: [
        {
          id: 'close',
          title: t('close'),
          onPress: () => {
            hideModal();
          },
          variant: 'secondary',
        },
      ],
      onClose: () => {},
    });
  };

  const header = () => (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.darkGreen, '#6AA500']}
        start={[0, 0]}
        end={[0, 1]}
        style={styles.gradient}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <MegaText
            size={44}
            font={FontType.medium}
            styles={{ lineHeight: 44, color: Colors.white }}
          >
            {currencyFormat(referralBalance, true)}
          </MegaText>
          <MegaText
            size={30}
            styles={{ lineHeight: 36, color: '#E3F4C9', paddingBottom: 3 }}
          >
            USD
          </MegaText>
        </View>

        <View>
          <MegaText size={15} styles={{ lineHeight: 19, color: '#E3F4C9' }}>
            {t('referralSection.wonCommission')}
          </MegaText>
        </View>

        {referralBalance > 0 && (
          <View style={{ marginTop: 15, flexGrow: 1 }}>
            <MegaButton
              text={t('referralSection.retrieveCommission')}
              variant="light-secondary"
              onPress={() => {
                setWithdrawModalVisible(true);
              }}
              gradientStyles={{ paddingHorizontal: 30 }}
            />
          </View>
        )}
      </LinearGradient>
    </View>
  );

  return (
    <ScreenWithKeyboard HeaderComponent={header()} useBottomSafeview>
      <View>
        <MegaText
          size={18}
          font={FontType.medium}
          styles={{
            lineHeight: 22,
            color: Colors.primary,
            textAlign: 'center',
          }}
        >
          {t('referralSection.whomToRefer')}
        </MegaText>
      </View>

      <View style={{ marginTop: 20 }}>
        <CountrySelectorInput
          countryList={countryList}
          selectedCountry={selectedCountry?.value}
          onSelectCountry={(c: GenericList) => {
            setSelectedCountry(c);
          }}
          labelBackgroundColor="transparent"
          hasShadow
          hideLabel
        />
      </View>

      {selectedCountry && (
        <View style={{ marginTop: 20 }}>
          <ContactSelector
            contactCountry={selectedCountry}
            onSelectedContact={setSelectedContact}
            source="referral"
          />
        </View>
      )}

      <View style={{ marginTop: 15 }}>
        <MegaButton
          text={t('referralSection.seeUseConditions')}
          variant="link"
          onPress={() => {
            setConsentModalVisible(true);
          }}
          iconLeft={
            <SVGs.InfoIcon fill={Colors.darkGreen} width={20} height={20} />
          }
          iconRight={
            <SVGs.ArrowListItem
              fill={Colors.darkGreen}
              width={15}
              height={15}
            />
          }
        />
      </View>

      <View style={{ marginTop: 15 }}>
        <MegaButton
          text={t('referralSection.sendReferral')}
          variant="secondary"
          onPress={submitReferral}
          disabled={!selectedContact}
        />
      </View>

      <View style={{ marginTop: 15 }}>
        <MegaText size={15} styles={{ lineHeight: 22 }}>
          {t('referralSection.referralDescription1')}
          <MegaText
            size={15}
            font={FontType.medium}
            styles={{ lineHeight: 22, color: Colors.primary }}
          >
            {' ' + REFERRAL_COMMISSION + ' '}
          </MegaText>
          {t('referralSection.referralDescription2')}
        </MegaText>
      </View>
      <View style={{ marginTop: 5, marginBottom: 20 }}>
        <MegaText size={15} styles={{ lineHeight: 22 }}>
          {t('referralSection.referralDescription3')}
          <MegaText
            size={15}
            font={FontType.medium}
            styles={{ lineHeight: 22, color: Colors.primary }}
          >
            {' ' + REFERRAL_COMMISSION}
          </MegaText>
          {t('referralSection.referralDescription4')}
        </MegaText>
      </View>

      <ConsentModal
        isVisible={consentModalVisible}
        title={t('referralSection.useConditions')}
        mainDescription={t('referralSection.useConditionsDescription')}
        descriptions={[
          t('referralSection.useConditions1'),
          t('referralSection.useConditions2'),
          t('referralSection.useConditions3'),
          t('referralSection.useConditions4'),
        ]}
        onClose={() => {
          setConsentModalVisible(false);
        }}
      />

      {selectedCountry && (
        <WithdrawCommissionModal
          isVisible={withdrawModalVisible}
          onClose={(isSuccess) => {
            if (isSuccess) {
              referralBalanceQuery.refetch();
            }

            setWithdrawModalVisible(false);
          }}
          country={selectedCountry}
        />
      )}
    </ScreenWithKeyboard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  gradient: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
});
