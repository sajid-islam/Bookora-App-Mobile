import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import React, { useState } from "react";
import styles from "./../../assets/styles/login.style.js";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color.js";
import { Link } from "expo-router";
import { useAuthStore } from "../../store/authStore.js";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { isLoading, login, isAuthChecking } = useAuthStore();

    const handleLogin = async () => {
        const result = await login(email, password);
        console.log(result);

        if (!result.success) Alert.alert("Error", result.error);
    };

    if (isAuthChecking) return null;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <View style={styles.illustrationImage}>
                    <Image
                        style={styles.illustrationImage}
                        source={require("../../assets/images/book-bro.png")}
                        contentFit="contain"
                    />
                </View>
                <View style={styles.card}>
                    <View>
                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter you email"
                                    placeholderTextColor={
                                        COLORS.placeholderText
                                    }
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={
                                        COLORS.placeholderText
                                    }
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={
                                            showPassword
                                                ? "eye-off-outline"
                                                : "eye-outline"
                                        }
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        disabled={isLoading}
                        onPress={handleLogin}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Do not have an account?{" "}
                        </Text>
                        <Link href="/(auth)/signup" asChild>
                            <TouchableOpacity>
                                <Text style={styles.link}>Signup</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
