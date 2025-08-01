import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import styles from "../../assets/styles/create.style";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color";
import { useState } from "react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function CreateScreen() {
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(3);
    const [image, setImage] = useState("");
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageBase64, setImageBase64] = useState("");

    const pickImage = async () => {
        try {
            if (Platform.OS !== "web") {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();

                if (status !== "granted") {
                    Alert.alert(
                        "Permission Denied",
                        "We need camera rolls permission to upload image"
                    );
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [4, 3],
                base64: true,
                quality: 0.5,
            });
            if (!result.canceled) {
                setImage(result.assets[0].uri);

                // if base 64 is provided, use it
                if (result.assets[0].base64) {
                    setImageBase64(result.assets[0].base64);
                } else {
                    // otherwise convert to, base64
                    const base64 = await FileSystem.readAsStringAsync(
                        result.assets[0].uri,
                        {
                            encoding: FileSystem.EncodingType.Base64,
                        }
                    );
                    setImageBase64(base64);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = () => {};

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

                    {/* IMAGE */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Book Image</Text>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={pickImage}
                        >
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    style={styles.previewImage}
                                />
                            ) : (
                                <View style={styles.placeholderContainer}>
                                    <Ionicons
                                        name="image-outline"
                                        size={40}
                                        color={COLORS.textSecondary}
                                    />
                                    <Text style={styles.placeholderText}>
                                        Tap to select image
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* CAPTION */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Caption</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Write a review or thoughts about this book..."
                            placeholderTextColor={COLORS.placeholderText}
                            value={caption}
                            onChangeText={setCaption}
                            multiline
                        />
                    </View>

                    {/* SUBMIT BUTTON */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <>
                                <Ionicons
                                    name="cloud-upload-outline"
                                    size={20}
                                    color={COLORS.white}
                                    style={styles.buttonIcon}
                                />
                                <Text style={styles.buttonText}>Share</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
