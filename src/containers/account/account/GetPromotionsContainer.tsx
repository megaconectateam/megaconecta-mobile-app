import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ConsentModal } from '../../../components';
import {
  FontType,
  MegaCard,
  MegaSwitch,
  MegaText,
  ScreenWithKeyboard,
} from '../../../components/ui';
import { useGlobalModalContext, useLoadingContext } from '../../../providers';
import { ProfileContext } from '../../../providers/ProfileProvider';
import { AccountServices } from '../../../services';
import { Colors } from '../../../themes';

// TODO: consent modals

export const GetPromotionsContainer = () => {
  const { t } = useTranslation();
  const { showModal, hideModal } = useGlobalModalContext();
  const { setLoading } = useLoadingContext();
  const { profile, refetchProfile } = useContext(ProfileContext);

  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailsEnabled, setEmailsEnabled] = useState(false);

  const [consentSmsVisible, setConsentSmsVisible] = useState(false);
  const [consentEmailsVisible, setConsentEmailsVisible] = useState(false);

  useEffect(() => {
    if (profile && profile.user) {
      setSmsEnabled(profile.user.receive_sms);
      setEmailsEnabled(profile.user.receive_emails);
    }
  }, [profile]);

  const items = [
    {
      key: 'sms',
      name: t('promotionSection.sms'),
      tap: t('promotionSection.tapToSeeConsent'),
    },
    {
      key: 'emails',
      name: t('promotionSection.email'),
      tap: t('promotionSection.tapToSeeConsent'),
    },
  ];

  const onChangeEmails = (state: boolean) => {
    setEmailsEnabled(state);
    onChange(smsEnabled, state);
  };
  const onChangeSms = (state: boolean) => {
    setSmsEnabled(state);
    onChange(state, emailsEnabled);
  };

  const onChange = async (receiveSms: boolean, receiveEmails: boolean) => {
    try {
      setLoading(true);
      const response = await AccountServices.updateCommunications(
        receiveSms,
        receiveEmails,
      );

      if (!response) {
        setScreenErrorMessage(t('promotionSection.error'));
      } else {
        refetchProfile();
      }
    } catch (error) {
      setScreenErrorMessage(t('promotionSection.error'));
    } finally {
      setLoading(false);
    }
  };

  const setScreenErrorMessage = (error: string) => {
    setLoading(false);

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

  const openConsent = (key: string) => {
    if (key === 'sms') {
      setConsentSmsVisible(true);
    }

    if (key === 'emails') {
      setConsentEmailsVisible(true);
    }
  };

  return (
    <ScreenWithKeyboard useBottomSafeview>
      <MegaText
        size={18}
        font={FontType.medium}
        styles={{
          lineHeight: 22,
          textAlign: 'center',
          color: Colors.primary,
        }}
      >
        {t('promotionSection.megaPromotions')}
      </MegaText>

      <MegaText
        size={15}
        styles={{
          lineHeight: 20,
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        {t('promotionSection.pageDescription')}
      </MegaText>

      <MegaCard containerStyles={{ marginTop: 20 }}>
        {items.map((item) => (
          <View
            key={item.key}
            style={[
              styles.menuContainer,
              item.key === 'emails' && { borderBottomWidth: 0 },
            ]}
          >
            <View style={styles.menuTitleContainer}>
              <View>
                <MegaText
                  size={16}
                  font={FontType.medium}
                  styles={{
                    lineHeight: 24,
                    color: Colors.primary,
                  }}
                >
                  {item.name}
                </MegaText>
              </View>
              <View>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => openConsent(item.key)}
                >
                  <MegaText
                    size={13}
                    styles={{
                      lineHeight: 18,
                    }}
                  >
                    {item.tap}
                  </MegaText>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              {item.key === 'sms' && (
                <MegaSwitch value={smsEnabled} onChange={onChangeSms} />
              )}
              {item.key === 'emails' && (
                <MegaSwitch value={emailsEnabled} onChange={onChangeEmails} />
              )}
            </View>
          </View>
        ))}
      </MegaCard>

      <ConsentModal
        isVisible={consentSmsVisible}
        title={t('promotionSection.smsConsentTitle')}
        descriptions={[
          t('promotionSection.smsConsent1'),
          t('promotionSection.smsConsent2'),
        ]}
        onClose={() => {
          setConsentSmsVisible(false);
        }}
      />

      <ConsentModal
        isVisible={consentEmailsVisible}
        title={t('promotionSection.emailConsentTitle')}
        descriptions={[
          t('promotionSection.emailConsent1'),
          t('promotionSection.emailConsent2'),
        ]}
        onClose={() => {
          setConsentEmailsVisible(false);
        }}
      />
    </ScreenWithKeyboard>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    borderBottomColor: '#C5C5C5',
    borderBottomWidth: 1,
  },
  menuTitleContainer: {
    flexDirection: 'column',
    flexGrow: 1,
    paddingVertical: 10,
  },
});
