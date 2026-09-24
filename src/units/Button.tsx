import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  text: string;
  fontSize?: number;
  onPress?: () => void;
  disabled?: boolean;
}

export default function Button_X({ text, fontSize, onPress, disabled }: ButtonProps) {
  return (
    <TouchableOpacity style={style.container} onPress={onPress} disabled={disabled}>
      <Text style={[{ fontSize: fontSize, color: "rgba(222, 222, 222, 0.5)" }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  container: {
    padding: "0.4%",
  },
});
