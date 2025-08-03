import { expo as expoConfig } from "./app.json";
import "dotenv/config";

export default {
    expo: {
        ...expoConfig,
        extra: {
            ...expoConfig.extra,
            IP_ADDRESS: process.env.IP_ADDRESS, // Add your env var here
        },
    },
};
