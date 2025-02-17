import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Colors } from '../../themes';

export type HtmlContentProps = {
  content: string;
};

const tagsStyles = {
  strong: {
    fontSize: '16px',
    fontFamily: 'Inter-Bold',
    marginBottom: 100,
    color: Colors.primary,
  },
};

const baseStyle = {
  color: '#616161',
  fontFamily: 'Inter-Regular',
  fontSize: 13,
};

export const HtmlContent = ({ content }: HtmlContentProps) => {
  const { width } = useWindowDimensions();

  return (
    <RenderHtml
      contentWidth={width}
      source={{ html: content }}
      baseStyle={baseStyle}
      tagsStyles={tagsStyles}
      systemFonts={['Inter-Regular', 'Inter-Bold']}
    />
  );
};
