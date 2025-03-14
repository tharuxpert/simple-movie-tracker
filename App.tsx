import { View } from "react-native";
import { withExpoSnack } from "nativewind";
import { ThemeProvider } from "./lib/theme";
import HomeScreen from "./app/(tabs)";

function App() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <HomeScreen />
      </View>
    </ThemeProvider>
  );
}

export default withExpoSnack(App);
