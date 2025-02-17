import { Switch } from 'react-native';
import { Colors } from '../../themes';

export type MegaSwitchProps = {
  value: boolean;
  onChange?: (state: boolean) => void;
};

export const MegaSwitch = (props: MegaSwitchProps) => {
  const onSwitchChange = (state: boolean) => {
    props.onChange && props.onChange(state);
  };

  return (
    <Switch
      trackColor={{ false: '#767577', true: Colors.darkGreen }}
      thumbColor={props.value ? '#f4f3f4' : '#f4f3f4'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onSwitchChange}
      value={props.value}
    />
  );
};
