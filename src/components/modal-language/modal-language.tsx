import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SVGs } from '../../assets/svg';
import { Colors } from '../../themes';
import { LocalStorageService } from '../../utils';
import { FontType, MegaModal, MegaRadio, MegaText } from '../ui';

export type ModalLanguageProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ModalLanguage = ({ isVisible, onClose }: ModalLanguageProps) => {
  const { t } = useTranslation();

  const languages = [
    {
      key: 'es',
      name: t('languageSection.spanish'),
      translated: t('languageSection.spanish', {
        lng: i18n.language === 'es' ? 'en' : 'es',
      }),
    },
    {
      key: 'en',
      name: t('languageSection.english'),
      translated: t('languageSection.english', {
        lng: i18n.language === 'es' ? 'en' : 'es',
      }),
    },
  ];

  const onLanguageChange = (lang: 'en' | 'es') => {
    i18n.changeLanguage(lang);
    LocalStorageService.setLanguage(lang);
    onClose();
  };

  return (
    <MegaModal
      isLoading={false}
      modalProps={{
        isVisible,
        scrollHorizontal: false,
        avoidKeyboard: true,
      }}
      modalStyle={styles.view}
    >
      <View style={styles.content}>
        <View
          style={{
            alignItems: 'center',
            position: 'relative',
            marginBottom: 30,
          }}
        >
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{
              lineHeight: 21,
              color: Colors.primary,
              textAlign: 'center',
            }}
          >
            {t('languageSection.language')}
          </MegaText>

          <View style={{ position: 'absolute', top: 2, right: 0 }}>
            <TouchableOpacity onPress={onClose}>
              <SVGs.CloseIcon />
            </TouchableOpacity>
          </View>
        </View>

        {languages.map((lang) => (
          <View
            key={lang.key}
            style={{
              flexDirection: 'row',
              marginTop: 8,
              marginBottom: 8,
            }}
          >
            <View style={{ marginRight: 5, paddingTop: 5 }}>
              <MegaRadio
                onPress={() => {
                  onLanguageChange(lang.key as 'en' | 'es');
                }}
                options={[
                  {
                    id: lang.key,
                    label: '',
                    value: '',
                  },
                ]}
                selectedId={i18n.language === lang.key ? lang.key : ''}
              />
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                onLanguageChange(lang.key as 'en' | 'es');
              }}
            >
              <View
                style={[
                  {
                    flexDirection: 'column',
                    flexGrow: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: '#C5C5C5',
                    paddingBottom: 15,
                  },
                  lang.key === 'en' && { borderBottomWidth: 0 },
                ]}
              >
                <MegaText
                  size={16}
                  font={FontType.medium}
                  styles={{
                    lineHeight: 24,
                    color: Colors.primary,
                  }}
                >
                  {lang.name}
                </MegaText>
                <MegaText
                  size={13}
                  styles={{
                    lineHeight: 18,
                  }}
                >
                  {lang.translated}
                </MegaText>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ))}
        <View style={{ marginBottom: 20 }} />
      </View>
    </MegaModal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 20,
    backgroundColor: 'white',
    paddingHorizontal: 30,
  },
});
