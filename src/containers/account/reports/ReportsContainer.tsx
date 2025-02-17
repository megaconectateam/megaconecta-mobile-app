import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { MegaTabs } from '../../../components/ui';
import { ReportTypesEnum } from '../../../models/enums';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { ReportPage } from '../../../pages';
import { ProfileContext } from '../../../providers/ProfileProvider';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'ReportsContainer'
>;

export const ReportsContainer = ({ route }: Props) => {
  const { t } = useTranslation();
  const { canDoRemittance } = useContext(ProfileContext);

  const INITIAL_TABS = [
    { id: ReportTypesEnum.topup, label: t('reportsSection.topup') },
    { id: ReportTypesEnum.payment, label: t('reportsSection.payment') },
    { id: ReportTypesEnum.market, label: t('reportsSection.market') },
  ];

  const [tabs, setTabs] =
    useState<{ id: ReportTypesEnum; label: string }[]>(INITIAL_TABS);
  const [activeTab, setActiveTab] = useState<ReportTypesEnum>(
    route.params?.defaultPage || tabs[0].id,
  );

  useEffect(() => {
    if (canDoRemittance) {
      setTabs([
        ...INITIAL_TABS,
        {
          id: ReportTypesEnum.remittance,
          label: t('reportsSection.remittance'),
        },
      ]);
    }
  }, []);

  const onTabChange = (tab: ReportTypesEnum) => {
    setActiveTab(tab);
  };

  return (
    <View style={{ flex: 1 }}>
      <MegaTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab: string) => {
          onTabChange(tab as ReportTypesEnum);
        }}
      />

      {activeTab === ReportTypesEnum.topup && (
        <ReportPage reportType={activeTab} />
      )}
      {activeTab === ReportTypesEnum.payment && (
        <ReportPage reportType={activeTab} />
      )}
      {activeTab === ReportTypesEnum.remittance && (
        <ReportPage reportType={activeTab} />
      )}
      {activeTab === ReportTypesEnum.market && (
        <ReportPage reportType={activeTab} />
      )}
    </View>
  );
};
