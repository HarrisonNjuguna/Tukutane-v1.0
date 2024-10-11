import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icons from Expo

const interestsData = [
    { name: "Gaming", icon: "game-controller" },
    { name: "Music", icon: "musical-notes" },
    { name: "Photography", icon: "camera" },
    { name: "Fashion", icon: "shirt-outline" },
    { name: "Fitness", icon: "fitness" },
    { name: "Art", icon: "color-palette-outline" },
    { name: "Sports", icon: "football-outline" },
    { name: "Tech", icon: "laptop-outline" },
    { name: "Business", icon: "business" },
    { name: "Cars", icon: "car-sport" },
    { name: "Religious", icon: "people" },
];

const PersonalizeScreen = ({ navigation }) => {
    const [selectedInterests, setSelectedInterests] = useState([]);

    // Handle interest selection
    const handleInterestSelect = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else if (selectedInterests.length < 5) {
            setSelectedInterests([...selectedInterests, interest]);
        } else {
            Alert.alert("Limit Reached", "You can only select up to 5 interests.");
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
                {interestsData.map((interest) => (
                    <TouchableOpacity
                        key={interest.name}
                        style={[
                            styles.interestButton,
                            selectedInterests.includes(interest.name) ? styles.selectedButton : styles.unselectedButton
                        ]}
                        onPress={() => handleInterestSelect(interest.name)}
                    >
                        <Ionicons name={interest.icon} size={24} color={selectedInterests.includes(interest.name) ? "#fff" : "#acacac"} />
                        <Text style={[styles.interestText, { color: selectedInterests.includes(interest.name) ? "#fff" : "#acacac" }]}>
                            {interest.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity 
                style={styles.nextButton} 
                onPress={() => navigation.navigate('Home')} // Replace with the actual home screen name
            >
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        marginTop: 60,
        marginLeft: 20,
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#acacac',
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
        backgroundColor: '#c0c0c0', // Default background for unselected interests
        borderRadius: 10,
        padding: 15,
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexBasis: '30%', // Allow dynamic sizing
        minWidth: 120, // Ensure minimum width for smaller screens
        maxWidth: '48%', // Max width to maintain layout
    },
    selectedButton: {
        backgroundColor: '#ff7518', // Background color for selected interests
    },
    unselectedButton: {
        backgroundColor: '#c0c0c0', // Background color for unselected interests
    },
    interestText: {
        fontSize: 16,
        marginLeft: 10,
        flexShrink: 1, // Allow text to shrink to fit
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
