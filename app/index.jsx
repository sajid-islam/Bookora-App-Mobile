import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text>Home</Text>
            <Link href="/(auth)">Login</Link>
            <Link href="/(auth)/signup">Signup</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
