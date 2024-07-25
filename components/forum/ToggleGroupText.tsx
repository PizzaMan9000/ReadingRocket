import React from 'react';
import { Text } from 'tamagui';

export default function ToggleGroupText(props: {
  color: string;
  value: string;
  marginLeftValue?: number;
  marginTopValue?: number;
}) {
  return (
    <Text
      color={props.color}
      fontSize={10}
      lineHeight={16}
      ml={props.marginLeftValue}
      fontWeight={500}
      mt={props.marginTopValue}>
      {props.value}
    </Text>
  );
}
