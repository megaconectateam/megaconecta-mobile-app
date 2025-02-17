import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { LottieResources } from '../../../assets/animations';
import { SVGs } from '../../../assets/svg';
import {
  FontType,
  MegaCard,
  MegaGradient,
  MegaText,
  ScreenWithKeyboard,
} from '../../../components/ui';
import { Colors } from '../../../themes';

export const CustomerSupportContainer = () => {
  const { t } = useTranslation();

  const phone = '305.507.8545';
  const email = 'ayuda@megaconecta.com';

  const openWhatsApp = () => {
    const url = `whatsapp://send?phone=${phone.replace(/\D/g, '')}`;

    Linking.openURL(url)
      .then(() => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert(t('customerSupportSection.whatsAppNotInstalled'));
      });
  };

  const openEmail = () => {
    const subject = encodeURIComponent(
      t('customerSupportSection.emailSubject'),
    );
    const url = `mailto:${email}?subject=${subject}`;

    Linking.openURL(url)
      .then(() => {
        console.log('Email Opened');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openCall = async () => {
    const newPhone = phone.replace(/\D/g, '');

    if (Platform.OS === 'android') {
      await Linking.openURL(`tel:${newPhone}`);
    } else if (Platform.OS === 'ios') {
      await Linking.openURL(`telprompt:${encodeURIComponent(newPhone)}`);
    }
  };

  return (
    <ScreenWithKeyboard>
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <LottieView
          autoPlay
          style={{
            width: 120,
            height: 120,
          }}
          source={LottieResources.customerSupport}
        />
      </View>

      <View>
        <MegaText
          size={18}
          font={FontType.medium}
          styles={{
            lineHeight: 22,
            color: Colors.darkGreen,
            textAlign: 'center',
          }}
        >
          {t('customerSupportSection.needAHand')}
        </MegaText>

        <MegaText
          size={18}
          font={FontType.medium}
          styles={{
            lineHeight: 22,
            color: Colors.primary,
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          {t('customerSupportSection.contactUs')}
        </MegaText>

        <MegaText
          size={15}
          styles={{
            lineHeight: 20,
            textAlign: 'center',
            marginTop: 10,
            paddingHorizontal: 5,
          }}
        >
          {t('customerSupportSection.pageDescription')}
        </MegaText>
      </View>

      <MegaCard
        containerStyles={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={openCall}
      >
        <View style={{ marginRight: 10 }}>
          <MegaGradient icon={<SVGs.CustomerSupportIcon />} />
        </View>
        <View style={styles.titleContainer}>
          <MegaText
            size={16}
            font={FontType.medium}
            styles={{ lineHeight: 22, color: Colors.primary }}
          >
            {t('customerSupportSection.callUs')}
          </MegaText>
          <MegaText size={13} styles={{ lineHeight: 20 }}>
            {t('customerSupportSection.callUsDescription', { phone })}
          </MegaText>
        </View>
        <View>
          <SVGs.ArrowListItem width={15} fill={Colors.borderInput} />
        </View>
      </MegaCard>

      <MegaCard
        containerStyles={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={openWhatsApp}
      >
        <View style={{ marginRight: 10 }}>
          <MegaGradient icon={<SVGs.WhatsAppIcon />} />
        </View>
        <View style={styles.titleContainer}>
          <MegaText
            size={16}
            font={FontType.medium}
            styles={{ lineHeight: 22, color: Colors.primary }}
          >
            {t('customerSupportSection.whatsApp')}
          </MegaText>
          <MegaText size={13} styles={{ lineHeight: 20 }}>
            {t('customerSupportSection.whatsAppDescription')}
          </MegaText>
        </View>
        <View>
          <SVGs.ArrowListItem width={15} fill={Colors.borderInput} />
        </View>
      </MegaCard>

      <MegaCard
        containerStyles={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}
        onPress={openEmail}
      >
        <View style={{ marginRight: 10 }}>
          <MegaGradient icon={<SVGs.EmailUsIcon />} />
        </View>
        <View style={styles.titleContainer}>
          <MegaText
            size={16}
            font={FontType.medium}
            styles={{ lineHeight: 22, color: Colors.primary }}
          >
            {t('customerSupportSection.writeUsAnEmail')}
          </MegaText>
          <MegaText size={13} styles={{ lineHeight: 20 }}>
            {t('customerSupportSection.writeUsAnEmailDescription')}
          </MegaText>
          <MegaText
            size={13}
            font={FontType.medium}
            styles={{ lineHeight: 20, color: Colors.darkGreen }}
          >
            {email}
          </MegaText>
        </View>
        <View>
          <SVGs.ArrowListItem width={15} fill={Colors.borderInput} />
        </View>
      </MegaCard>
    </ScreenWithKeyboard>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
    flex: 1,
  },
});
