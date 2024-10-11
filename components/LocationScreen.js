import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have this library installed

const LocationScreen = ({ navigation }) => {
    
    // Function to handle location access
    const handleAllowLocationAccess = () => {
        // You can implement location access request here
        Alert.alert("Location Access", "Please allow access to your location.");
    };

    // Function to handle manual location entry
    const handleEnterLocationManually = () => {
        // Navigate to a screen where user can enter location manually
        Alert.alert("Enter Location Manually", "This will take you to the manual entry screen.");
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Location Icon */}
            <View style={styles.locationIconContainer}>
                <View style={styles.locationIconBackground}>
                    <Ionicons name="location" size={40} color="#ff7518" />
                </View>
            </View>

            {/* Title Text */}
            <Text style={styles.title}>What is your Location?</Text>

            {/* Subtext */}
            <Text style={styles.subtext}>
                To find nearby events, share your location with us.
            </Text>

            {/* Allow Location Access Button */}
            <TouchableOpacity style={styles.allowButton} onPress={handleAllowLocationAccess}>
                <Text style={styles.buttonText}>Allow Location Access</Text>
            </TouchableOpacity>

            {/* Clickable text for manual location entry */}
            <TouchableOpacity onPress={handleEnterLocationManually}>
                <Text style={styles.manualText}>Enter Location Manually</Text>
            </TouchableOpacity>

            {/* Next Button */}
            <TouchableOpacity 
                style={styles.nextButton} 
                onPress={() => navigation.navigate('Personalize')} 
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
    locationIconContainer: {
        marginBottom: 30,
    },
    locationIconBackground: {
        backgroundColor: '#dcdcdc',
        borderRadius: 50,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtext: {
        color: '#acacac',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    allowButton: {
        backgroundColor: '#ff7518',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    manualText: {
        color: '#ff7518', // Set the color to #ff7518
        fontSize: 18,
        fontWeight: 'bold', // Make the text bold
        marginBottom: 20,
    },
    nextButton: {
        backgroundColor: '#ff7518',
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 90,
        alignItems: 'center',
        width: '100%',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LocationScreen;
