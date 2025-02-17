import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import moment from 'moment';
import { NativeModules, Platform } from 'react-native';
import { en, es } from '../translations';
import { LocalStorageService } from './LocalStorageService';

i18n
  .use(initReactI18next)
  .use({
    type: 'languageDetector',
    init: () => {},
    async: true,
    detect: async () => {
      const supportedLanguages = ['en', 'es'];
      const isIOS = Platform.OS === 'ios';
      let locale = '';

      const defLanguage = await LocalStorageService.getLanguage();
      if (defLanguage && supportedLanguages.includes(defLanguage)) {
        return defLanguage;
      }

      if (isIOS) {
        locale =
          NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages[0] ||
          'es';
      } else {
        locale = NativeModules.I18nManager?.localeIdentifier || 'es';
      }

      const [lowerCaseLocale] = locale.split('_');
      if (supportedLanguages.includes(lowerCaseLocale)) {
        return lowerCaseLocale;
      }

      return 'es';
    },
  })
  .init({
    debug: false,
    fallbackLng: 'es',
    ns: ['common'],
    defaultNS: 'common',
    compatibilityJSON: 'v3',
    resources: {
      en,
      es,
    },
  });

moment.updateLocale('es', {
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Deciembre',
  ],
  weekdays: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab'],
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'MM/DD/YYYY',
    LL: 'Do [de] MMMM YYYY',
    LLL: 'MMMM Do YYYY LT',
    LLLL: 'dddd, MMMM Do YYYY LT',
  },
});

export default i18n;
