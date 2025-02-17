import { PropsWithChildren } from 'react';

import { MegaText } from './mega-text';
import { Colors } from '../../themes';

export const MegaLabel = (props: PropsWithChildren) => {
  return (
    <MegaText size={13} styles={{ color: Colors.label, lineHeight: 27 }}>
      {props.children}
    </MegaText>
  );
};
