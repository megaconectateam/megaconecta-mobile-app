import * as Crypto from 'expo-crypto';
import { startsWith, toLower } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useQuery } from 'react-query';
import { SVGs } from '../../../assets/svg';
import {
  ContactSelector,
  ContactSelectorRef,
  ContentTab,
  CountrySelectorInput,
  GenericSelectorInput,
  TopupProducts,
} from '../../../components';
import {
  FontType,
  MegaButton,
  MegaText,
  ScreenWithKeyboard,
  ScreenWithKeyboardRef,
} from '../../../components/ui';
import {
  ContactPhone,
  ContentTabItem,
  GenericList,
  MegaCarrierRate,
  QueryTypes,
} from '../../../models';
import { useLoadingContext, useTopup } from '../../../providers';
import { CarrierServices, ValidationServices } from '../../../services';
import { Colors, themeStyles } from '../../../themes';
import {
  convertRatesOldFormat,
  convertTopupCarrierToGenericList,
  convertTopupCountryToGenericList,
  onlyNumbers,
} from '../../../utils';

export const TopupMobileContainer = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();
  const { setInitialData, initialData, addCartItem } = useTopup();
  const contactRef = useRef<ContactSelectorRef>(null);
  const screenRef = useRef<ScreenWithKeyboardRef>(null);
  const { height: phoneHeight } = useWindowDimensions();

  const DATA_TAB: ContentTabItem = {
    key: 'bundle',
    name: t('topupSection.tabs.data'),
    icon: <SVGs.RecargarDatosIcon width={25} height={25} />,
  };
  const TOPUP_TAB: ContentTabItem = {
    key: 'topup',
    name: t('topupSection.tabs.topup'),
    icon: <SVGs.RecargarIcon width={25} height={25} />,
  };
  const PROMO_TAB: ContentTabItem = {
    key: 'promo',
    name: t('topupSection.tabs.promo'),
    icon: <SVGs.Account.Servicios.Promos width={25} height={25} />,
  };

  const [countries, setCountries] = useState<GenericList[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<GenericList | null>(
    null,
  );
  const [selectedContact, setSelectedContact] = useState<ContactPhone | null>(
    null,
  );
  const [selectedCarrier, setSelectedCarrier] = useState<GenericList | null>(
    null,
  );
  const [carrierList, setCarrierList] = useState<GenericList[]>([]);
  const [topupRateList, setTopupRateList] = useState<MegaCarrierRate[]>([]);
  const [productTabs, setProductTabs] = useState<ContentTabItem[]>([]);
  const [selectedCarrierRate, setSelectedCarrierRate] =
    useState<MegaCarrierRate>();
  const [isPhoneBlacklisted, setIsPhoneBlacklisted] = useState<boolean>(false);
  const [layoutProducts, setLayoutProducts] = useState<
    {
      id: string;
      y: number;
    }[]
  >([]);

  const countriesQuery = useQuery(
    QueryTypes.GetCountriesForTopUp,
    () => {
      setLoading(true);
      return CarrierServices.getCountries();
    },
    {
      onSettled: () => {
        setLoading(false);
      },
    },
  );

  const carriersQuery = useQuery(
    [QueryTypes.GetTopUpCarriers, selectedCountry],
    () => {
      if (selectedCountry) {
        setLoading(true);
        return CarrierServices.getCarriers(selectedCountry.value, 'TOPUP');
      } else {
        return [];
      }
    },
    {
      cacheTime: 0,
      onSettled: () => {
        setLoading(false);
      },
    },
  );

  const carrierRatesQuery = useQuery(
    [QueryTypes.GetTopUpCarrierRates, selectedCarrier],
    () => {
      if (selectedCarrier) {
        setLoading(true);
        return CarrierServices.getCarrierRates(selectedCarrier.value);
      } else {
        return undefined;
      }
    },
    {
      cacheTime: 0,
      onSettled: () => {
        setLoading(false);
      },
    },
  );

  const blacklistedPhoneQuery = useQuery(
    [QueryTypes.GetBlacklistedPhone, selectedContact],
    () => {
      if (selectedContact) {
        setLoading(true);
        return ValidationServices.checkBlacklistedPhone(
          selectedContact.phoneNumber!.replace(/\D/g, ''),
        );
      } else {
        return false;
      }
    },
    {
      cacheTime: 0,
      onSettled: () => {
        setLoading(false);
      },
    },
  );

  useEffect(() => {
    if (countriesQuery.status === 'success' && countriesQuery.data.length > 0) {
      const countryList = countriesQuery.data.map(
        convertTopupCountryToGenericList,
      );

      setCountries(countryList);
      setSelectedCountry(
        countryList.find((country) => toLower(country.value) === 'cu') ||
          countryList[0],
      );
    }
  }, [countriesQuery.status]);

  useEffect(() => {
    if (carriersQuery.status === 'success') {
      if (carriersQuery.data.length > 0) {
        setCarrierList(
          (carriersQuery.data || []).map(convertTopupCarrierToGenericList),
        );
        setSelectedCarrier(
          convertTopupCarrierToGenericList(carriersQuery.data[0]),
        );
      }
    }
  }, [carriersQuery.data]);

  useEffect(() => {
    if (carrierRatesQuery.status === 'success' && carrierRatesQuery.data) {
      setInitialData(carrierRatesQuery.data.initial_data);
      const tabs = [];
      let productList: MegaCarrierRate[] = [];
      let selectedLocalProduct: MegaCarrierRate | undefined = undefined;

      if (carrierRatesQuery.data.offer_products.length > 0) {
        tabs.push(PROMO_TAB);
        const products = carrierRatesQuery.data.offer_products.map((e) =>
          convertRatesOldFormat(e, 'promo', {
            enabled: true,
            date: initialData?.future_date,
          }),
        );
        productList = [...productList, ...products];
        selectedLocalProduct = products[0];
      }

      if (carrierRatesQuery.data.topup_products.length > 0) {
        tabs.push(TOPUP_TAB);
        const products = carrierRatesQuery.data.topup_products.map((e) =>
          convertRatesOldFormat(e, 'topup', { enabled: false }),
        );
        productList = [...productList, ...products];
        selectedLocalProduct = selectedLocalProduct || products[0];
      }

      if (carrierRatesQuery.data.bundle_products.length > 0) {
        tabs.push(DATA_TAB);
        const products = carrierRatesQuery.data.bundle_products.map((e) =>
          convertRatesOldFormat(e, 'bundle', { enabled: false }),
        );
        productList = [...productList, ...products];
        selectedLocalProduct = selectedLocalProduct || products[0];
      }

      setProductTabs(tabs);
      setTopupRateList(productList);
      setSelectedCarrierRate(selectedLocalProduct);
    }
  }, [carrierRatesQuery.data]);

  useEffect(() => {
    if (blacklistedPhoneQuery.status === 'success') {
      setIsPhoneBlacklisted(blacklistedPhoneQuery.data);
    }
  }, [blacklistedPhoneQuery.data]);

  useEffect(() => {
    if (selectedContact) {
      getCarrierByPhone();
    }
  }, [selectedContact]);

  const getCarrierByPhone = async () => {
    try {
      if (!selectedContact) {
        return;
      }

      setLoading(true);
      const carrierId = await CarrierServices.getCarrierByPhoneAndCategory(
        onlyNumbers(selectedContact.phoneNumber),
      );

      if (carrierId) {
        const preferredCarrier = carrierList?.find((carrier) => {
          return carrier.value === `${carrierId}`;
        });

        if (preferredCarrier) {
          setSelectedCarrier(preferredCarrier);
        }
      } else {
        if (carrierList.length === 1) {
          setSelectedCarrier(carrierList[0]);
        }
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSelectedCarrier(null);
    }
  };

  const canBeAdded = () => {
    return (
      !!selectedCountry &&
      !!selectedContact &&
      !!selectedCarrierRate &&
      !!selectedCarrier &&
      !isPhoneBlacklisted
    );
  };

  const bottomButtons = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          paddingTop: 10,
        }}
      >
        <View style={{ flexGrow: 1 }}>
          <MegaButton
            text={t('addToCart')}
            variant="light-secondary"
            onPress={() => addSelectedItemToCart('cart')}
            disabled={!canBeAdded()}
          />
        </View>
        <View style={{ flexGrow: 1 }}>
          <MegaButton
            text={t('payNow')}
            variant="secondary"
            onPress={() => addSelectedItemToCart('checkout')}
            disabled={!canBeAdded()}
          />
        </View>
      </View>
    );
  };

  const addSelectedItemToCart = (source: 'cart' | 'checkout') => {
    if (!canBeAdded()) {
      return;
    }

    addCartItem({
      uuid: Crypto.randomUUID(),
      carrier: selectedCarrier!,
      carrierRate: selectedCarrierRate!,
      contact: selectedContact!,
      country: selectedCountry!,
      type: selectedCarrierRate!.type,
      futurePromotionalDate:
        selectedCarrierRate!.type === 'promo'
          ? initialData?.future_date
          : undefined,
    });

    if (source === 'cart') {
      resetScreen();
    }

    //TODO: navigate to checkout if source is checkout
    console.log(source);
  };

  const resetScreen = () => {
    contactRef.current?.resetContact();
    screenRef.current?.scrollTo(0, 0);
    if (topupRateList.length > 0) {
      setSelectedCarrierRate(topupRateList[0]);
    }
  };

  return (
    <ScreenWithKeyboard
      FooterComponent={bottomButtons()}
      keepFooterComponentAnchored
      footerWithTopBorder
      ref={screenRef}
    >
      <View style={{ marginBottom: 16 }}>
        <MegaText
          size={16}
          font={FontType.medium}
          styles={{
            lineHeight: 21,
            color: Colors.primary,
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          {t('topupSection.whomToRecharge')}
        </MegaText>

        <CountrySelectorInput
          countryList={countries}
          selectedCountry={selectedCountry?.value}
          onSelectCountry={(c: GenericList) => {
            setSelectedCarrier(null);
            setCarrierList([]);
            setSelectedCarrierRate(undefined);
            setSelectedCountry(c);
            setTopupRateList([]);
          }}
          labelBackgroundColor="transparent"
          hasShadow
          hideLabel
        />
      </View>

      {!!selectedCountry && (
        <View>
          <ContactSelector
            contactCountry={selectedCountry}
            onSelectedContact={setSelectedContact}
            ref={contactRef}
          />

          {isPhoneBlacklisted && (
            <View style={{ marginTop: 16, ...themeStyles.errorContainer }}>
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{
                  lineHeight: 21,
                  color: Colors.danger,
                  textAlign: 'center',
                }}
              >
                {t('topupSection.blacklistedPhone')}
              </MegaText>
            </View>
          )}
        </View>
      )}

      {(selectedContact || selectedCountry?.value === 'cu') &&
        carrierList.length > 0 && (
          <>
            <View style={{ marginTop: 16 }}>
              {selectedCountry && selectedCountry.value !== 'cu' && (
                <>
                  <MegaText
                    size={16}
                    font={FontType.medium}
                    styles={{
                      lineHeight: 21,
                      color: Colors.primary,
                      textAlign: 'center',
                      marginBottom: 10,
                    }}
                  >
                    {t('topupSection.carrier')}
                  </MegaText>

                  <GenericSelectorInput
                    itemList={carrierList}
                    selectedItem={selectedCarrier || undefined}
                    placeholder={t('topupSection.selectCarrier')}
                    onSelectItem={(item) => {
                      setSelectedCarrier(item);
                      setTopupRateList([]);
                      setSelectedCarrierRate(undefined);
                    }}
                    hasShadow
                  />
                </>
              )}

              {productTabs.length > 1 && (
                <ContentTab
                  tabs={productTabs}
                  onChange={(tab) => {
                    const items = layoutProducts.filter((p) =>
                      startsWith(p.id, tab),
                    );
                    let min = items.length > 0 ? items[0].y : 0;
                    items.forEach((p) => {
                      if (p.y < min) {
                        min = p.y;
                      }
                    });

                    screenRef.current?.scrollTo(0, min + phoneHeight * 0.4);
                  }}
                />
              )}

              {!!topupRateList && topupRateList.length > 0 && (
                <View style={{ marginTop: 15 }}>
                  <MegaText
                    size={16}
                    font={FontType.medium}
                    styles={{
                      lineHeight: 21,
                      color: Colors.primary,
                      textAlign: 'center',
                      marginBottom: 10,
                    }}
                  >
                    {t('topupSection.amountToTopup')}
                  </MegaText>

                  <TopupProducts
                    selectedId={selectedCarrierRate?.id}
                    products={topupRateList}
                    onSelectProduct={(p: MegaCarrierRate) => {
                      setSelectedCarrierRate(p);
                    }}
                    onLayout={(id, y) => {
                      const index = layoutProducts.findIndex(
                        (p) => p.id === id,
                      );
                      if (index === -1) {
                        setLayoutProducts([...layoutProducts, { id, y }]);
                      } else {
                        layoutProducts[index].y = y;
                        setLayoutProducts([...layoutProducts]);
                      }
                    }}
                  />
                </View>
              )}
            </View>
          </>
        )}
    </ScreenWithKeyboard>
  );
};

const styles = StyleSheet.create({
  warningFuture: {
    borderRadius: 10,
    backgroundColor: '#FFEDB9',
    padding: 5,
    marginBottom: 10,
  },
});
