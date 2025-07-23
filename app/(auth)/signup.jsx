import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useState } from "react";
import styles from "../../assets/styles/signup.style";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const { user, isLoading, register } = useAuthStore();

    const handleSignup = async () => {
        const result = await register(username, email, password);
        console.log(result);
        console.log(username, email, password);

        if (!result.success)
            Alert.alert("Error", result.error || result.message);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.title}>BOOKORA 💡</Text>
                        <Text style={styles.subtitle}>
                            Share Your Favorite Reads
                        </Text>
                    </View>
                    {/* FORM CONTAINER */}
                    <View>
                        {/* Username */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={username}
                                    placeholder="JohnDoe"
                                    placeholderTextColor={
                                        COLORS.placeholderText
                                    }
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
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
                                    value={email}
                                    placeholder="johndoe@example.com"
                                    placeholderTextColor={
                                        COLORS.placeholderText
                                    }
                                    keyboardType="email-address"
                                    onChangeText={setEmail}
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
                                    value={password}
                                    placeholder="••••••"
                                    placeholderTextColor={
                                        COLORS.placeholderText
                                    }
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
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
                        onPress={handleSignup}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Signup</Text>
                        )}
                    </TouchableOpacity>

                    {/* FOOTER */}
                    <View style={styles.footer}>
                        <Text>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.link}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
