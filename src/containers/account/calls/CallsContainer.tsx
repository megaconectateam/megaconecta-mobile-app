import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { MegaTabs } from '../../../components/ui';
import { RootStackParamList, TabStackParamList } from '../../../navigation';
import { ContactosPage, RecientesPage, TecladoPage } from '../../../pages';
import { Colors } from '../../../themes';

type Props = NativeStackScreenProps<
  TabStackParamList & RootStackParamList,
  'Calls'
>;

export const CallsContainer = ({ navigation, route }: Props) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'teclado', label: t('teclado') },
    { id: 'contactos', label: t('contactos') },
    { id: 'recientes', label: t('recientes') },
  ];

  const [activeTab, setActiveTab] = useState<string>(
    route.params?.defaultPage || tabs[0].id,
  );

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <MegaTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        gradientStyles={{ paddingHorizontal: 30 }}
      />

      <View
        style={{
          flex: 1,
          flexGrow: 1,
          justifyContent: 'space-between',
          flexDirection: 'column',
          backgroundColor: Colors.backgroundScreen,
        }}
      >
        {activeTab === 'teclado' && <TecladoPage />}
        {activeTab === 'contactos' && <ContactosPage navigation={navigation} />}
        {activeTab === 'recientes' && <RecientesPage />}
      </View>
    </View>
  );
};
