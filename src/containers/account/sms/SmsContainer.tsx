import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useQuery } from 'react-query';
import { LottieResources } from '../../../assets/animations';
import {
  FontType,
  MegaButton,
  MegaText,
  ScreenWithKeyboard,
} from '../../../components/ui';
import { QueryTypes } from '../../../models';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { SmsService } from '../../../services';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'SendSms'
>;

export const SmsContainer = ({ navigation }: Props) => {
  const { t } = useTranslation();

  const conversationQuery = useQuery(
    [QueryTypes.GetSmsConversation],
    SmsService.getConversations,
  );

  if (true) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LottieView
          autoPlay
          style={{
            width: 140,
            height: 140,
          }}
          source={LottieResources.emptySms}
        />
        <MegaText
          size={16}
          font={FontType.medium}
          styles={{ lineHeight: 21, color: '#5F6368' }}
        >
          {t('smsSection.noSms')}
        </MegaText>
        <MegaText
          size={13}
          styles={{ lineHeight: 18, marginTop: 5, color: '#949494' }}
        >
          {t('smsSection.noSmsDescription')}
        </MegaText>

        <MegaButton
          text={t('smsSection.sendSmsNow')}
          variant="link"
          onPress={() => {}}
        />
      </View>
    );
  }

  return (
    <ScreenWithKeyboard>
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <MegaText>SMS container</MegaText>
      </View>
    </ScreenWithKeyboard>
  );
};
