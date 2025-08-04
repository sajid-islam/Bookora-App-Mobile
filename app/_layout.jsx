import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const { checkAuth, token, user } = useAuthStore();
    const [isReady, setIsReady] = useState(false);

    const [loaded, error] = useFonts({
        "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    useEffect(() => {
        checkAuth().finally(() => setIsReady(true));
    }, [checkAuth]);

    useEffect(() => {
        if (!isReady) return;
        const inAuthScreen = segments[0] === "(auth)";
        const isSignedIn = user && token;

        if (!inAuthScreen && !isSignedIn) router.replace("/(auth)");
        else if (inAuthScreen && isSignedIn) router.replace("/(tabs)");
    }, [user, token, segments, router, isReady]);

    if (!isReady) return null;

    return (
        <SafeAreaProvider>
            <SafeScreen>
                <Slot />
            </SafeScreen>
            <StatusBar style="dark" />
        </SafeAreaProvider>
    );
}
