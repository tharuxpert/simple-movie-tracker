import { View } from "react-native";
import { withExpoSnack } from "nativewind";
import HomeScreen from "./app/(tabs)";
import { ThemeProvider } from "./lib/theme";

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