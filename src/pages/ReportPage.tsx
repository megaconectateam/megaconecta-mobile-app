import i18n from 'i18next';
import { orderBy } from 'lodash';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';
import { useQuery } from 'react-query';
import { LottieResources } from '../assets/animations';
import { ReportItem } from '../components';
import { FontType, MegaText } from '../components/ui';
import { MegaReportBase, QueryTypes, SectionItem } from '../models';
import { ReportTypesEnum } from '../models/enums';
import { useLoadingContext } from '../providers';
import { ReportsServices } from '../services';
import { Colors } from '../themes';
import { isLoadingQueries, isToday, isYesterday } from '../utils';

export type ReportPageProps = {
  reportType: ReportTypesEnum;
};

const PAGE_SIZE = 15;

export const ReportPage = ({ reportType }: ReportPageProps) => {
  const { setLoading } = useLoadingContext();
  const { t } = useTranslation();

  const [reportItems, setReportItems] = useState<MegaReportBase[]>([]);
  const [sectionItems, setSectionItems] = useState<
    SectionItem<MegaReportBase>[]
  >([]);
  const [skip, setSkip] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPagerDone, setIsPagerDone] = useState(false);

  const reportQuery = useQuery(
    [`${QueryTypes.GetReport}${reportType}`, skip],
    () => {
      return ReportsServices.getReport(reportType, skip, PAGE_SIZE);
    },
    {
      onSettled: (data: MegaReportBase[] | undefined) => {
        if (isRefreshing && data && data.length === 0) {
          setIsRefreshing(false);
        }

        setLoading(false);
      },
    },
  );

  useEffect(() => {
    if (reportQuery.status === 'success') {
      if (!reportQuery.data || reportQuery.data.length < PAGE_SIZE) {
        setIsPagerDone(true);
      }

      let reportData = [];
      if (isRefreshing) {
        setIsRefreshing(false);
        reportData = !reportQuery.data ? [] : reportQuery.data;
      } else {
        reportData = [...reportItems, ...reportQuery.data];
      }

      setReportItems(reportData);

      const sections = convertIntoSections(reportData);
      setSectionItems(sections);
    }
  }, [reportQuery.data]);

  useEffect(() => {
    setLoading(isLoadingQueries([reportQuery]));
  }, [reportQuery.status]);

  const convertIntoSections = (data: MegaReportBase[]) => {
    const sections: SectionItem<MegaReportBase>[] = [];

    data.forEach((item) => {
      const date = item.date;

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

  const onRefresh = () => {
    setIsRefreshing(true);
    setIsPagerDone(false);
    // setReportItems([]);
    // setSectionItems([]);

    setSkip(0);
    reportQuery.refetch();
  };

  return (
    <SectionList
      sections={sectionItems}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item, index, section }) => (
        <ReportItem item={item} index={index} section={section} />
      )}
      renderSectionHeader={({ section: { title } }) => (
        <MegaText
          size={13}
          font={FontType.medium}
          styles={{ lineHeight: 24, color: '#8F979F', marginTop: 16 }}
        >
          {t(title)}
        </MegaText>
      )}
      contentContainerStyle={[
        styles.sectionContainer,
        sectionItems.length === 0 && { flex: 1, flexGrow: 1 },
      ]}
      refreshing={isRefreshing}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      onEndReached={({ distanceFromEnd }) => {
        if (distanceFromEnd === 0) {
          return;
        }

        if (!isPagerDone) {
          setSkip(skip + PAGE_SIZE);
        }
      }}
      onEndReachedThreshold={0.5}
      stickySectionHeadersEnabled={false}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            flexGrow: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
          }}
        >
          <LottieView
            autoPlay
            style={{
              width: 140,
              height: 140,
            }}
            source={LottieResources.emptyReport}
          />

          <MegaText
            size={16}
            font={FontType.medium}
            styles={{
              lineHeight: 21,
              color: '#5F6368',
              textAlign: 'center',
            }}
          >
            {t('reportsSection.noReportsTitle')}
          </MegaText>

          <MegaText
            size={13}
            styles={{
              lineHeight: 18,
              color: '#949494',
              textAlign: 'center',
              marginTop: 5,
            }}
          >
            {t('reportsSection.noReportsDescription.' + reportType)}
          </MegaText>
        </View>
      }
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
    paddingBottom: 60,
  },
});
