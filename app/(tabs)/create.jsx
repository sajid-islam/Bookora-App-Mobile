import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextInput,
    TouchableOpacity,
} from "react-native";
import styles from "../../assets/styles/create.style";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color";
import { useState } from "react";

export default function CreateScreen() {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(3);

    const RenderRatingPicker = () => {
        const star = [];
        for (let i = 1; i <= 5; i++) {
            star.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => setRating(i)}
                    style={styles.starButton}
                >
                    <Ionicons
                        name={i <= rating ? "star" : "star-outline"}
                        color={i <= rating ? "#f4b400" : COLORS.textSecondary}
                        size={32}
                    />
                </TouchableOpacity>
            );
        }
        return <View style={styles.ratingContainer}>{star}</View>;
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                style={styles.scrollViewStyle}
            >
                <View style={styles.card}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Add Book Recommendation
                        </Text>
                        <Text style={styles.subtitle}>
                            Share your favorite reads with others
                        </Text>
                    </View>
                    {/* TITLE */}
                    <View style={styles.form}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Book Title</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="book-outline"
                                    style={styles.inputIcon}
                                    color={COLORS.primary}
                                    size={20}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter  book title"
                                    placeholderTextColor={
                                        COLORS.placeholderText
                                    }
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>
                    </View>
                    {/* RATING */}
                    <View style={styles.form}>
                        <Text style={styles.label}>Rating</Text>
                        <View>{RenderRatingPicker()}</View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
