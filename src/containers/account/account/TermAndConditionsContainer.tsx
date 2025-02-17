import i18n from 'i18next';
import { useEffect, useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useQuery } from 'react-query';
import { ScreenWithKeyboard } from '../../../components/ui';
import { MegaContent, QueryTypes } from '../../../models';
import { useLoadingContext } from '../../../providers';
import { ContentService } from '../../../services';
import { Colors } from '../../../themes';

export const TermAndConditionsContainer = () => {
  const { setLoading } = useLoadingContext();
  const { width } = useWindowDimensions();
  const lang = i18n.language;

  const [html, setHtml] = useState<MegaContent>({ content: '' });

  const contentQuery = useQuery(
    [QueryTypes.GetContent, `term_cond/${lang}`],
    () => {
      setLoading(true);
      return ContentService.getContent('term_cond', lang);
    },
    {
      onSettled: () => setLoading(false),
    },
  );

  useEffect(() => {
    if (contentQuery.data) {
      setHtml(contentQuery.data);
    }
  }, [contentQuery.data]);

  return (
    <ScreenWithKeyboard useBottomSafeview>
      <RenderHtml
        contentWidth={width}
        source={{ html: html.content }}
        baseStyle={{
          color: '#616161',
          fontFamily: 'Inter-Regular',
          fontSize: 14,
        }}
        tagsStyles={{
          li: {
            marginBottom: 10,
          },
        }}
        classesStyles={{
          'text-mega': {
            color: Colors.darkGreen,
            fontFamily: 'Inter-Bold',
          },
        }}
        systemFonts={['Inter-Regular', 'Inter-Bold']}
      />

      <View style={{ marginBottom: 20 }} />
    </ScreenWithKeyboard>
  );
};
