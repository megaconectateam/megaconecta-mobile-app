import i18n from 'i18next';
import parsePhoneNumber from 'libphonenumber-js';
import { orderBy } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  SectionList,
  SectionListData,
  StyleSheet,
  View,
} from 'react-native';
import { useQuery } from 'react-query';
import { SVGs } from '../assets/svg';
import { Flag, FontType, MegaText } from '../components/ui';
import { CallReport, QueryTypes, SectionItem } from '../models';
import { useLoadingContext } from '../providers/LoadingProvider';
import { CallServices } from '../services';
import { Colors } from '../themes';
import {
  currencyFormat,
  isLoadingQueries,
  isToday,
  isYesterday,
} from '../utils';

const PAGE_SIZE = 15;

export const RecientesPage = () => {
  const { setLoading } = useLoadingContext();
  const { t } = useTranslation();

  const [reportItems, setReportItems] = useState<CallReport[]>([]);
  const [sectionItems, setSectionItems] = useState<SectionItem<CallReport>[]>(
    [],
  );
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(PAGE_SIZE);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPagerDone, setIsPagerDone] = useState(false);

  const callReportQuery = useQuery(
    [QueryTypes.GetCallReport, skip, take],
    () => {
      return CallServices.getCallReport(skip, take);
    },
  );

  useEffect(() => {
    if (callReportQuery.status === 'success') {
      if (callReportQuery.data.length < take) {
        setIsPagerDone(true);
        return;
      }

      let reportData = [];
      if (isRefreshing) {
        setIsRefreshing(false);
        reportData = callReportQuery.data;
      } else {
        reportData = [...reportItems, ...callReportQuery.data];
      }

      setReportItems(reportData);

      const sections = convertIntoSections(reportData);
      setSectionItems(sections);
    }
  }, [callReportQuery.data]);

  useEffect(() => {
    setLoading(isLoadingQueries([callReportQuery]));
  }, [callReportQuery.status]);

  const convertIntoSections = (data: CallReport[]) => {
    const sections: SectionItem<CallReport>[] = [];

    data.forEach((item) => {
      const date = moment(
        item.call_connect_time,
        'DD/MM/YYYY HH:mm a',
      ).toDate();

      if (isToday(date)) {
        const todaySection = sections.find(
          (section) => section.title === 'hoy',
        );

        if (todaySection) {
          todaySection.data.push(item);
        } else {
          sections.push({ title: 'hoy', date, data: [item] });
        }
        return;
      }

      if (isYesterday(date)) {
        const yesterdaySection = sections.find(
          (section) => section.title === 'ayer',
        );

        if (yesterdaySection) {
          yesterdaySection.data.push(item);
        } else {
          sections.push({ title: 'ayer', date, data: [item] });
        }
        return;
      }

      const lMoment = moment(date);
      lMoment.locale(i18n.language);
      const dateString = lMoment.format('LL');

      const yesterdaySection = sections.find(
        (section) =>
          section.title !== 'ayer' &&
          section.title !== 'hoy' &&
          moment(section.title, 'LL').isSame(date, 'day'),
      );

      if (yesterdaySection) {
        yesterdaySection.data.push(item);
      } else {
        sections.push({ title: dateString, date, data: [item] });
      }
    });

    return orderBy(sections, ['date'], ['desc']);
  };

  const renderItem = (
    item: CallReport,
    index: number,
    section: SectionListData<CallReport, SectionItem<CallReport>>,
  ) => {
    const phone = parsePhoneNumber(item.called_number, 'CU');

    return (
      <View
        style={[
          styles.rowContainer,
          index === 0 && styles.rowContainerFirst,
          index === section.data.length - 1 && styles.rowContainerLast,
        ]}
      >
        <View>
          <SVGs.CallOutgoingIcon />
        </View>
        <View
          style={[
            styles.rowSecondHalfContainer,
            index === section.data.length - 1 &&
              styles.lastRowSecondHalfContainer,
          ]}
        >
          <View style={styles.middleRowContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Flag
                name="cu"
                styles={{ height: 20, width: 20, marginRight: 5 }}
              />
              <MegaText
                size={16}
                font={FontType.medium}
                styles={{ lineHeight: 20, color: Colors.primary }}
              >
                {phone?.formatInternational() || item.called_number}
              </MegaText>
            </View>
            <View>
              <MegaText size={13} styles={{ color: '#616161', lineHeight: 20 }}>
                {item.duration + ' MIN'} |{' '}
                {currencyFormat(Number(item.cost_before_fees))}
              </MegaText>
            </View>
          </View>
          <View style={{ alignSelf: 'center', marginLeft: 'auto' }}>
            <MegaText size={13} styles={{ lineHeight: 27, color: '#949494' }}>
              {moment(item.call_connect_time, 'DD/MM/YYYY HH:mm a').format(
                'HH:mm a',
              )}
            </MegaText>
          </View>
        </View>
      </View>
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setIsPagerDone(false);

    setSkip(0);
    setTake(PAGE_SIZE);

    callReportQuery.refetch();
  };

  return (
    <SectionList
      sections={sectionItems}
      keyExtractor={(item, index) => item.call_connect_time + index}
      renderItem={({ item, index, section }) =>
        renderItem(item, index, section)
      }
      renderSectionHeader={({ section: { title } }) => (
        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: '#8F979F', marginTop: 16 }}
        >
          {t(title)}
        </MegaText>
      )}
      contentContainerStyle={styles.sectionContainer}
      refreshing={isRefreshing}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      onEndReached={() => {
        if (!isPagerDone) {
          setSkip(skip + PAGE_SIZE);
        }
      }}
      onEndReachedThreshold={0.5}
      stickySectionHeadersEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowSecondHalfContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    marginLeft: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197, 197, 197, 0.5)',
  },
  rowContainerFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowContainerLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  lastRowSecondHalfContainer: {
    borderBottomWidth: 0,
  },
  middleRowContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
