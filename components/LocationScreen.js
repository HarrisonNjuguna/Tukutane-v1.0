import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const LocationScreen = ({ navigation }) => {
    const [currentCity, setCurrentCity] = useState(null);
    const [locationPermission, setLocationPermission] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cachedLocation, setCachedLocation] = useState(null);

    useEffect(() => {
        // Check location permission on mount
        const checkLocationPermission = async () => {
            const { status } = await Location.getForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');

            // If permission was granted, try to fetch cached location
            if (status === 'granted' && cachedLocation) {
                setCurrentCity(cachedLocation);
            }
        };

        checkLocationPermission();
    }, [cachedLocation]);

    const handleAllowLocationAccess = () => {
        Alert.alert(
            "Location Access",
            "Do you want to allow location access?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Location access denied"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: startLocationUpdates,
                }
            ]
        );
    };

    const startLocationUpdates = async () => {
        if (!locationPermission) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');
        }

        if (locationPermission) {
            setLoading(true);
            try {
                // Request the highest accuracy for location
                const { coords } = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                await fetchCityName(coords.latitude, coords.longitude);
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Could not fetch location. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert("Location Access Denied", "Please enable location services.");
        }
    };

    const fetchCityName = async (latitude, longitude) => {
        try {
            // Use a timeout to prevent excessively long waits
            const response = await Promise.race([
                Location.reverseGeocodeAsync({ latitude, longitude }),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000)) // 5 seconds timeout
            ]);
            if (response.length > 0) {
                const { city, region } = response[0];
                const cityName = city ? city : region; // Fallback to region if city is not available
                setCurrentCity(cityName);
                setCachedLocation(cityName); // Cache the current city for future use
            } else {
                Alert.alert("Error", "Could not determine city from your location.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not fetch location name. Please try again.");
        }
    };

    const handleNext = () => {
        if (currentCity) {
            navigation.navigate('Personalize');
        } else {
            Alert.alert("Location Error", "Please allow location access to proceed.");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.locationIconContainer}>
                <View style={styles.locationIconBackground}>
                    <Ionicons name="location" size={40} color="#ff7518" />
                </View>
            </View>

            <Text style={styles.title}>What is your Location?</Text>

            <Text style={styles.subtext}>
                To find nearby events, share your location with us.
            </Text>

            {/* Allow Location Access Button */}
            <TouchableOpacity style={styles.allowButton} onPress={handleAllowLocationAccess}>
                <Text style={styles.buttonText}>Allow Location Access</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#ff7518" />
            ) : currentCity ? (
                <Text style={styles.currentLocationText}>
                    Current Location: {currentCity}
                </Text>
            ) : (
                <Text style={styles.subtext}>
                    {locationPermission ? "Location access granted. Please fetch your location." : "Location access denied."}
                </Text>
            )}

            {/* Next Button with color change based on state */}
            <TouchableOpacity 
                style={[styles.nextButton, { backgroundColor: currentCity ? '#ff7518' : '#ccc' }]} 
                onPress={handleNext}
                disabled={!currentCity} // Disable until city is fetched
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
    currentLocationText: {
        fontSize: 16,
        fontWeight: 'bold',
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
    nextButton: {
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 20,
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
