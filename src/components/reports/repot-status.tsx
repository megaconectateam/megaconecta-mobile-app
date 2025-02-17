import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ReportStatusEnum } from '../../models/enums';
import { MegaText } from '../ui';

export type ReportStatusProps = {
  status: ReportStatusEnum;
  overrideTextColor?: boolean;
};

export const ReportStatus = ({
  status,
  overrideTextColor,
}: ReportStatusProps) => {
  const { t } = useTranslation();

  let color = '';
  switch (status) {
    case ReportStatusEnum.approved:
      color = '#3368E2';
      break;
    case ReportStatusEnum.cancelled:
      color = '#616161';
      break;
    case ReportStatusEnum.completed:
      color = '#6AA500';
      break;
    case ReportStatusEnum.in_process:
      color = '#263645';
      break;
    case ReportStatusEnum.pending:
      color = '#FF9855';
      break;
    case ReportStatusEnum.refunded:
      color = '';
      break;
    case ReportStatusEnum.rejected:
      color = '#EF1A5B';
      break;
    case ReportStatusEnum.returned:
      color = '#EF1A5B';
      break;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
          marginRight: 5,
        }}
      />
      <MegaText
        size={13}
        styles={[
          { lineHeight: 27, textAlign: 'right' },
          !!overrideTextColor && { color },
        ]}
      >
        {t(`reportsSection.status.${status}`)}
      </MegaText>
    </View>
  );
};
