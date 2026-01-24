import AsyncStorage from "@react-native-async-storage/async-storage";

const handleError = (operation: string, key: string, error: unknown): never => {
    console.error(`Storage ${operation} failed for key "${key}":`, error);
    throw error;
};

interface JotaiStorage {
    getItem: <T>(key: string, initialValue: T) => Promise<T>;
    setItem: <T>(key: string, newValue: T) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
}

export const storage: JotaiStorage = {
    getItem: <T>(key: string, defaultValue: T): Promise<T> =>
        AsyncStorage.getItem(key)
            .then((value) => (value ? (JSON.parse(value) as T) : defaultValue))
            .catch((error) => handleError("getItem", key, error)),

    setItem: <T>(key: string, value: T): Promise<void> =>
        AsyncStorage.setItem(key, JSON.stringify(value)).catch((error) =>
            handleError("setItem", key, error)
        ),

    removeItem: (key: string): Promise<void> =>
        AsyncStorage.removeItem(key).catch((error) =>
            handleError("removeItem", key, error)
        ),
};
