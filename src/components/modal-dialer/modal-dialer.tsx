import { toLower } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SVGs } from '../../assets/svg';
import { ContactPhone, GenericList } from '../../models';
import { CallServices } from '../../services';
import { Colors } from '../../themes';
import { digitsWithNoAsterisk, getFormattedPhoneNumber } from '../../utils';
import { Flag, FontType, MegaButton, MegaModal, MegaText } from '../ui';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export type ModalDialerProps = {
  isVisible: boolean;
  onClose: () => void;
  defaultCountry?: GenericList;
  enforceDefaultCountry?: boolean;
  source?: 'topup' | 'referral';
  onSelected: (selected: ContactPhone) => void;
};

export const ModalDialer = (props: ModalDialerProps) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState(t('topupSection.numberToRecharge'));
  const [btnLabel, setBtnLabel] = useState(
    t('topupSection.rechargeThisNumber'),
  );

  const [numberToDial, setNumberToDial] = useState(
    props.defaultCountry?.extraLabel || '',
  );
  const [countryTitle, setCountryTitle] = useState(
    `${props.defaultCountry?.label} (${props.defaultCountry?.extraLabel})` ||
      '',
  );
  const [country, setCountry] = useState(props.defaultCountry?.value || '');

  const digits = digitsWithNoAsterisk;

  useEffect(() => {
    switch (props.source) {
      case 'referral':
        setTitle(t('referralSection.dialerReferralTitle'));
        setBtnLabel(t('referralSection.dialerReferralBtnLabel'));
        break;

      case 'topup':
      default:
        setTitle(t('topupSection.numberToRecharge'));
        setBtnLabel(t('topupSection.rechargeThisNumber'));
        break;
    }
  }, [props.source]);

  useEffect(() => {
    if (props.defaultCountry) {
      setCountryTitle(
        `${props.defaultCountry.label} (${props.defaultCountry.extraLabel})`,
      );
      setCountry(props.defaultCountry.value);
      setNumberToDial(props.defaultCountry.extraLabel || '');
    }
  }, [props.defaultCountry]);

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
        if (
          !props.enforceDefaultCountry ||
          !props.defaultCountry ||
          numberToDial !== props.defaultCountry?.extraLabel
        ) {
          setNumberToDial(numberToDial.substring(0, numberToDial.length - 1));
        }
      }
    } else {
      if (numberToDial && numberToDial.length === 15) {
        return;
      }

      if (!validateLength()) {
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
      setCountryTitle(
        `${rateResponse.country_name} (+${rateResponse.pattern})`,
      );
      setCountry(toLower(rateResponse.country_code));
    } else {
      setCountryTitle('');
      setCountry('');
    }
  };

  const validateLength = () => {
    if (!props.enforceDefaultCountry || !props.defaultCountry) {
      return true;
    }

    if (!!props.defaultCountry && props.defaultCountry.phoneMask) {
      const length = (props.defaultCountry.phoneMask.match(/n/gi) || []).length;
      // const length = props.defaultCountry.phoneMask.length;
      const newNumber = numberToDial.replace(
        props.defaultCountry.extraLabel || '',
        '',
      );

      if (newNumber.length === length) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (
      numberToDial &&
      (!props.enforceDefaultCountry || !props.defaultCountry)
    ) {
      getRate();
    }
  }, [numberToDial]);

  const onSelect = () => {
    if (!numberToDial) {
      return;
    }

    const contact: ContactPhone = {
      id: '-1',
      firstName: t('number'),
      lastName: '',
      fullName: t('number'),
      phoneNumber: numberToDial,
      countryCode: country,
      isMegaconecta: false,
      phoneType: 'mobile',
      initials: '',
      formattedPhone:
        getFormattedPhoneNumber(numberToDial, country) || numberToDial,
    };

    props.onSelected(contact);
    setNumberToDial(props.defaultCountry?.extraLabel || '');
  };

  const isButtonDisabled = () => {
    if (!props.enforceDefaultCountry || !props.defaultCountry) {
      return false;
    }

    return !validateLength();
  };

  return (
    <MegaModal
      modalProps={{
        isVisible: props.isVisible,
        swipeDirection: ['down'],
        scrollHorizontal: true,
        onSwipeComplete: props.onClose,
      }}
      isLoading={false}
      modalStyle={styles.view}
    >
      <View style={styles.content}>
        <View style={{ alignItems: 'center', position: 'relative' }}>
          <View
            style={{
              height: 5,
              width: 50,
              backgroundColor: Colors.border1,
              borderRadius: 5,
            }}
          />
          <View style={{ position: 'absolute', top: -8, right: 0 }}>
            <TouchableOpacity onPress={() => props.onClose()}>
              <SVGs.CloseIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingVertical: 20 }}>
          <MegaText
            size={18}
            font={FontType.medium}
            styles={{
              lineHeight: 21,
              color: Colors.primary,
              textAlign: 'center',
            }}
          >
            {title}
          </MegaText>
        </View>

        <View style={styles.numberDial}>
          <MegaText
            size={44}
            font={FontType.medium}
            styles={{ lineHeight: 54, color: Colors.primary }}
          >
            {numberToDial}
          </MegaText>
        </View>

        <View style={styles.countryContainer}>
          {!!country && (
            <Flag
              name={country}
              styles={{ height: 20, width: 20, marginRight: 10 }}
            />
          )}
          <MegaText
            size={16}
            font={FontType.medium}
            styles={{ lineHeight: 20, color: Colors.primary }}
          >
            {countryTitle}
          </MegaText>
        </View>

        <View style={{ marginTop: 20 }}>
          <MegaButton
            text={btnLabel}
            variant="secondary"
            onPress={onSelect}
            disabled={!isButtonDisabled()}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            width: '100%',
          }}
        >
          <View style={styles.containerButtons}>
            {digits.map((el) => (
              <View key={el.number}>
                <TouchableOpacity
                  style={[
                    styles.itemBox,
                    el.margin === 'right' && { marginLeft: 0 },
                    el.number === 'delete' && {
                      marginTop: 10,
                    },
                  ]}
                  onPress={() => {
                    if (el.number === 'delete') {
                      backSpace();
                      return;
                    }

                    keypadDial(el.number);
                  }}
                  onLongPress={() => {
                    if (el.number === 'delete') {
                      backSpace();
                      return;
                    }

                    pressEvent(el.number);
                  }}
                >
                  {el.number !== 'delete' && (
                    <>
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
                    </>
                  )}
                  {el.number === 'delete' && <SVGs.BorrarIcon />}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
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
  numberDial: {
    height: 54,
    maxHeight: 54,
    minHeight: 54,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  containerButtons: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
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
