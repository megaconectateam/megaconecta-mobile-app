import { StyleSheet } from 'react-native';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { Colors } from '../../themes';

export type MegaRadioProps = {
  options: {
    id: string;
    label?: string;
    value: string;
  }[];

  selectedId: string;
  onPress: (id: string) => void;
};

export const MegaRadio = (props: MegaRadioProps) => {
  const options: RadioButtonProps[] = props.options.map((option) => {
    return {
      id: option.id,
      label: option.label,
      value: option.value,
      color: Colors.darkGreen,
      labelStyle: styles.text,
      borderColor:
        props.selectedId === option.id ? Colors.darkerGreen : '#ABADC4',
    };
  });

  return (
    <RadioGroup
      radioButtons={options}
      selectedId={props.selectedId}
      onPress={props.onPress}
      containerStyle={{ alignItems: 'flex-start' }}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-Regular',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 15,
    lineHeight: 20,
    color: Colors.regularText,
  },
});
