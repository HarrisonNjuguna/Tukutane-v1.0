import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Animated, Easing } from 'react-native';
import * as Font from 'expo-font';

export default function SplashScreen({ navigation }) {
    const spinValue = new Animated.Value(0);

    useEffect(() => {
        // Load custom font
        const loadFonts = async () => {
            await Font.loadAsync({
                'african-font': require('../assets/fonts/african.ttf'), // Replace with your actual font path
            });
        };

        loadFonts();

        // Start the loading animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Navigate to onboarding screen after 4 seconds
        setTimeout(() => {
            navigation.navigate('Onboarding');
        }, 4000);
    }, []);

    // Spin animation
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* App Name */}
            <Text style={styles.appName}>Tukutane</Text>

            {/* Loading Animation */}
            <Animated.Image
                source={require('../assets/icon.png')}
                style={[styles.loadingImage, { transform: [{ rotate: spin }] }]}
            />

            {/* Loading Text */}
            <Text style={styles.loadingText}>Discover. Socialize. Repeat</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff5733', // Bright and inviting color
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    appName: {
        fontSize: 42, // Larger font size for better visibility
        fontFamily: 'african-font', // Custom font for African appeal
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingImage: {
        width: 100, // Slightly larger icon for better visual impact
        height: 100,
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 20, // Larger font size for readability
        fontFamily: 'african-font', // Match the loading text font
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
});
