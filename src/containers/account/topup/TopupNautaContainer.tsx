import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useQuery } from 'react-query';
import { NautaSelector, TopupProducts } from '../../../components';
import {
    FontType,
    MegaButton,
    MegaText,
    ScreenWithKeyboard,
} from '../../../components/ui';
import {
    ContactPhone,
    MegaCarrier,
    MegaCarrierRate,
    QueryTypes,
} from '../../../models';
import { useLoadingContext } from '../../../providers/LoadingProvider';
import { CarrierServices } from '../../../services';
import { Colors } from '../../../themes';
import { convertRatesOldFormat } from '../../../utils';

const COUNTRY_CODE = 'CU';
const CATEGORY = 'NAUTA';

export const TopupNautaContainer = () => {
  const { t } = useTranslation();
  const { setLoading } = useLoadingContext();

  const [selectedCarrier, setSelectedCarrier] = useState<MegaCarrier>();
  const [carrierRates, setCarrierRates] = useState<MegaCarrierRate[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactPhone | null>(
    null,
  );
  const [selectedCarrierRate, setSelectedCarrierRate] =
    useState<MegaCarrierRate>();

  const carriersQuery = useQuery(
    [QueryTypes.GetTopUpCarriers, CATEGORY],
    () => {
      setLoading(true);
      return CarrierServices.getCarriers(COUNTRY_CODE, CATEGORY);
    },
    {
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
        return CarrierServices.getCarrierRates(selectedCarrier.uid);
      } else {
        return [];
      }
    },
    {
      onSettled: () => {
        setLoading(false);
      },
    },
  );

  useEffect(() => {
    if (carriersQuery.status === 'success' && carriersQuery.data.length > 0) {
      setSelectedCarrier(carriersQuery.data[0]);
    }
  }, [carriersQuery.data]);

  useEffect(() => {
    if (
      carrierRatesQuery.status === 'success' &&
      carrierRatesQuery.data.length > 0
    ) {
      setCarrierRates(
        carrierRatesQuery.data.map((e) => {
          const newData = convertRatesOldFormat(e);

          return {
            ...newData,
            remoteFormattedAmount: `${t('topupSection.nautaReceives', {
              amount: newData.remoteFormattedAmount,
            })}`,
          };
        }),
      );
      setSelectedCarrierRate(convertRatesOldFormat(carrierRatesQuery.data[0]));
    }
  }, [carrierRatesQuery.data]);

  const canBeAdded = () => {
    return !!selectedContact && !!selectedCarrierRate;
  };

  const bottomButtons = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexGrow: 1 }}>
          <MegaButton
            text={t('addToCart')}
            variant="light-secondary"
            onPress={() => {}}
            disabled={!canBeAdded()}
          />
        </View>
        <View style={{ flexGrow: 1 }}>
          <MegaButton
            text={t('payNow')}
            variant="secondary"
            onPress={() => {}}
            disabled={!canBeAdded()}
          />
        </View>
      </View>
    );
  };

  return (
    <ScreenWithKeyboard
      FooterComponent={bottomButtons()}
      useBottomSafeview
      keepFooterComponentAnchored
      footerWithTopBorder
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

        <NautaSelector onSelectedContact={setSelectedContact} />

        {!!carrierRates && carrierRates.length > 0 && (
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
              products={carrierRates}
              onSelectProduct={() => {}}
            />
          </View>
        )}
      </View>
    </ScreenWithKeyboard>
  );
};
