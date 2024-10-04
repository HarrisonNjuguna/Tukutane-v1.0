import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';

export default function OnboardingScreen() {
    const [currentStep, setCurrentStep] = useState(0);
    const navigation = useNavigation();

    const steps = [
        {
            title: 'Discover Local Events',
            description: 'Find exciting events happening near you, from music concerts to community meet-ups.',
            image: require('../assets/discover.jpg'),
        },
        {
            title: 'Connect With Friends',
            description: 'See which events your friends are attending and join them for an amazing experience.',
            image: require('../assets/connecting.jpg'),
        },
        {
            title: 'Create Your Own Events',
            description: 'Organize your own events and invite others in the community.',
            image: require('../assets/meeting.jpg'),
        }
    ];

    // Load custom fonts
    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'roboto': require('../assets/fonts/Roboto/Roboto-Regular.ttf'),
                'montserrat': require('../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
            });
        };

        loadFonts();
    }, []);

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            navigation.navigate('Auth');
        }
    };

    const renderIndicators = () => {
        return (
            <View style={styles.indicatorContainer}>
                {steps.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.indicator,
                            currentStep === index && styles.activeIndicator,
                        ]}
                        onPress={() => setCurrentStep(index)} // Optional: Navigate directly to the step
                    />
                ))}
            </View>
        );
    };

    return (
        <LinearGradient colors={['#FF6F61', '#FF9A68']} style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Auth')}>
                <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
                <Image
                    source={steps[currentStep].image}
                    style={styles.image}
                />
                <View style={styles.overlay} />
            </View>
            <Ionicons
                name={steps[currentStep].icon}
                size={100}
                color='#FFD700'
                style={styles.icon}
            />
            <Text style={styles.title}>
                {steps[currentStep].title}
            </Text>
            <Text style={styles.description}>
                {steps[currentStep].description}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            {renderIndicators()}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    skipButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: 'transparent',
    },
    skipButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    imageContainer: {
        width: '100%',
        height: '50%', // Adjust height as needed
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 15,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 15,
        opacity: 0.8, 
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontFamily: 'montserrat',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        fontFamily: 'roboto',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#4A4A4A', 
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 25,
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginHorizontal: 5,
        opacity: 0.5,
    },
    activeIndicator: {
        opacity: 1,
    },
})