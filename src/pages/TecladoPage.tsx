import { toLower } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SVGs } from '../assets/svg';
import { Flag, FontType, MegaText } from '../components/ui';
import { useGlobalModalContext } from '../providers/ModalProvider';
import { CallServices } from '../services';
import { Colors } from '../themes';
import { currencyFormat, digitsWithAsterisk } from '../utils';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const TecladoPage = () => {
  const { showModal, hideModal } = useGlobalModalContext();
  const { t } = useTranslation();

  const digits = digitsWithAsterisk;

  const [numberToDial, setNumberToDial] = useState('');
  const [rateText, setRateText] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const keypadDial = (number: any) => {
    digitEntered(number, 'keyup');
  };

  const pressEvent = (number: any) => {
    digitEntered(number, 'press');
  };

  const backSpace = () => {
    digitEntered('backspace', 'keyup');
  };

  const digitEntered = (digit: string, eventtype: string) => {
    if (digit === 'backspace') {
      if (numberToDial !== '') {
        setNumberToDial(numberToDial.substring(0, numberToDial.length - 1));
      }
    } else {
      if (numberToDial && numberToDial.length === 15) {
        return;
      }
      if (digit === '0' && numberToDial === '' && eventtype === 'press') {
        let numberToDial1 = numberToDial;
        setNumberToDial((numberToDial1 += '+'));
      } else {
        let numberToDial1 = numberToDial;
        setNumberToDial((numberToDial1 += digit));
      }
    }
  };

  const sanitizePhone = () => {
    if (!numberToDial) {
      return '';
    }

    if (numberToDial.length === 1) {
      if (numberToDial !== '+') {
        setNumberToDial('+' + numberToDial);
      }
    }

    let phone = numberToDial.replace(/[^\d, +]/g, '');
    if (!phone) {
      return '';
    }

    const char3 = phone.substring(0, 3);
    if (char3 === '011') {
      phone = phone.replace('011', '+');
    }

    const char2 = phone.substring(0, 2);
    if (char2 === '00') {
      phone = phone.replace('00', '+');
    }

    phone = phone.replace('++', '+');
    phone = phone.replace('+++', '+');

    return phone;
  };

  const getRate = async () => {
    const phone = sanitizePhone();
    const rateResponse = await CallServices.getCallRate(phone);

    if (rateResponse && rateResponse.rate) {
      setRateText(
        `${rateResponse.rate} (+${rateResponse.pattern}) : ${currencyFormat(
          Number(rateResponse.cost),
        )}`,
      );

      if (rateResponse.country_code) {
        setCountryCode(toLower(rateResponse.country_code));
      }
    } else {
      setRateText('');
    }
  };

  useEffect(() => {
    if (numberToDial) {
      getRate();
    }
  }, [numberToDial]);

  const call = async () => {
    const phone = sanitizePhone();

    if (!phone) {
      return;
    }

    try {
      const data = await CallServices.setCall(phone);

      if (!data || !data.directDialCall) {
        throw new Error('missing data');
      }

      const newPhone = data.directDialCall;

      if (Platform.OS === 'android') {
        await Linking.openURL(`tel:${newPhone}`);
      } else if (Platform.OS === 'ios') {
        await Linking.openURL(`telprompt:${encodeURIComponent(newPhone)}`);
      }
    } catch (error) {
      console.log(error);

      showModal({
        type: 'error',
        title: t('error'),
        description: t('callError'),
        onClose: () => {},
        buttons: [
          {
            id: 'ok',
            title: t('close'),
            onPress: () => {
              hideModal();
            },
            variant: 'secondary',
          },
        ],
      });
    }
  };

  return (
    <View
      style={{
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <View style={styles.digitsContainer}>
        <View
          style={{
            width: '100%',
            borderWidth: 0,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MegaText
            size={screenHeight / 21}
            font={FontType.medium}
            styles={{
              lineHeight: screenHeight / 17,
              color: numberToDial ? Colors.primary : 'transparent',
            }}
          >
            {numberToDial || '88'}
          </MegaText>
        </View>

        <View>
          {rateText && (
            <View style={{ flexDirection: 'row' }}>
              {!!countryCode && (
                <Flag
                  name={countryCode}
                  styles={{ height: 20, width: 20, marginRight: 5 }}
                />
              )}
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ lineHeight: 20, color: Colors.primary }}
              >
                {rateText}{' '}
                <MegaText
                  size={16}
                  font={FontType.medium}
                  styles={{ lineHeight: 20, color: Colors.darkGreen }}
                >
                  / min
                </MegaText>
              </MegaText>
            </View>
          )}
        </View>
      </View>

      <View style={styles.containerButtons}>
        {digits.map((el) => (
          <View key={el.number}>
            <TouchableOpacity
              style={styles.itemBox}
              onPress={() => keypadDial(el.number)}
              onLongPress={() => pressEvent(el.number)}
            >
              <MegaText
                size={35}
                font={FontType.medium}
                styles={styles.itemNumber}
              >
                {el.number}
              </MegaText>
              <MegaText size={13} styles={styles.itemDesc}>
                {el.desc}
              </MegaText>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.callContainer}>
        <View style={styles.itemBox} />
        <View style={styles.itemBox}>
          <TouchableOpacity onPress={call}>
            <View style={styles.callIcon}>
              <SVGs.LlamarIcon
                width={screenHeight / 31}
                height={screenHeight / 31}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.itemBox}>
          {numberToDial && (
            <TouchableOpacity onPress={backSpace}>
              <View style={styles.borrarContainer}>
                <SVGs.BorrarIcon />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textDigitContainer: {},
  digitsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexGrow: 1,
    maxHeight: screenHeight / 5,
  },
  callContainer: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  callIcon: {
    width: screenHeight / 13.5,
    height: screenHeight / 13.5,
    borderRadius: screenHeight / 13.5,
    backgroundColor: Colors.darkGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerButtons: {
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  borrarContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemBox: {
    width: screenWidth / 3 - 45,
    paddingHorizontal: 10,
    paddingVertical: screenHeight / 80,
    marginTop: 5,
    marginLeft: 25,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemNumber: {
    marginTop: 0,
    color: Colors.primary,
    lineHeight: 42,
  },
  itemDesc: {
    marginTop: 0,
    color: '#8D8D8D',
    lineHeight: 16,
  },
});
