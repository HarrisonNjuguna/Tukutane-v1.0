import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const interestsData = [
    { name: "Gaming", icon: "game-controller" },
    { name: "Music", icon: "musical-notes" },
    { name: "Culture", icon: "camera" },
    { name: "Fashion", icon: "shirt-outline" },
    { name: "Fitness", icon: "fitness" },
    { name: "Art", icon: "color-palette-outline" },
    { name: "Sports", icon: "football-outline" },
    { name: "Tech", icon: "laptop-outline" },
    { name: "Reality", icon: "business" },
    { name: "Cars", icon: "car-sport" },
    { name: "Church", icon: "people" },
];

const PersonalizeScreen = ({ navigation }) => {
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [animation] = useState(new Animated.Value(1));

    const handleInterestSelect = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else if (selectedInterests.length < 5) {
            setSelectedInterests([...selectedInterests, interest]);
            // Trigger animation
            Animated.spring(animation, {
                toValue: 1.2,
                friction: 2,
                useNativeDriver: true,
            }).start(() => {
                Animated.spring(animation, {
                    toValue: 1,
                    friction: 2,
                    useNativeDriver: true,
                }).start();
            });
        } else {
            Alert.alert("Limit Reached", "You can only select up to 5 interests.");
        }
    };

    const handleNext = () => {
        if (selectedInterests.length === 0) {
            Alert.alert("Selection Required", "Please select at least one interest to proceed.");
        } else {
            navigation.navigate('Main');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Select up to 5 Interests</Text>
            <Text style={styles.subtitle}>
                Personalize your events journey by choosing your interests
            </Text>

            <View style={styles.interestsContainer}>
                {interestsData.map((interest) => {
                    const isSelected = selectedInterests.includes(interest.name);
                    return (
                        <TouchableOpacity
                            key={interest.name}
                            style={[styles.interestButton, isSelected ? styles.selectedButton : styles.unselectedButton]}
                            onPress={() => handleInterestSelect(interest.name)}
                        >
                            <Animated.View style={{ transform: [{ scale: isSelected ? animation : 1 }] }}>
                                <Ionicons name={interest.icon} size={24} color={isSelected ? "#fff" : "#acacac"} />
                            </Animated.View>
                            <Text style={[styles.interestText, { color: isSelected ? "#fff" : "#acacac" }]}>
                                {interest.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity 
                style={[styles.nextButton, { opacity: selectedInterests.length === 0 ? 0.5 : 1 }]} 
                onPress={handleNext} 
                disabled={selectedInterests.length === 0} 
            >
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Soft background color for warmth
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 60,
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 40,
    },
    interestButton: {
        backgroundColor: '#c0c0c0',
        borderRadius: 10,
        padding: 15,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexBasis: '30%',
        minWidth: 120,
        maxWidth: '48%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    selectedButton: {
        backgroundColor: '#ff7518',
    },
    unselectedButton: {
        backgroundColor: '#c0c0c0',
    },
    interestText: {
        fontSize: 16,
        marginLeft: 10,
        flexShrink: 1,
    },
    nextButton: {
        backgroundColor: '#ff7518',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PersonalizeScreen;
