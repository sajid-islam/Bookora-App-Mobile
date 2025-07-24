import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "./../store/authStore";

export default function Index() {
    const { checkAuth, logout, user, token } = useAuthStore();
    console.log(token, user);
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    return (
        <View style={styles.container}>
            <Text>Home</Text>
            <Link href="/(auth)">Login</Link>
            <Link href="/(auth)/signup">Signup</Link>
            <TouchableOpacity onPress={() => logout()}>
                <Text>Logout</Text>
            </TouchableOpacity>
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
