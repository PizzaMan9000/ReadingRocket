import { Label, RadioGroup, SizeTokens, XStack, useTheme } from 'tamagui';

export function RadioGroupItemWithLabel(props: { size: SizeTokens; value: string; label: string }) {
  const theme = useTheme() as {
    primaryColor: string;
    secondaryColorOne: string;
    secondaryColorTwo: string;
    complementaryColor: string;
  };

  const id = `radiogroup-${props.value}`;
  return (
    <XStack width={300} alignItems="center" space="$4">
      <RadioGroup.Item
        value={props.value}
        id={id}
        size={props.size}
        borderColor={theme.primaryColor}>
        <RadioGroup.Indicator bc={theme.primaryColor} w="60%" h="60%" />
      </RadioGroup.Item>

      <Label
        color="#747474"
        fontSize={10}
        fontWeight={400}
        lineHeight={16}
        htmlFor={id}
        marginVertical={5}>
        {props.label}
      </Label>
    </XStack>
  );
}
