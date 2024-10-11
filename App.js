import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import FavoritesScreen from './components/FavoritesScreen'; 
import TicketsScreen from './components/TicketsScreen'; // Tickets screen
import ExploreScreen from './components/ExploreScreen'; // Explore screen
import ProfileScreen from './components/ProfileScreen'; 
import InterestsScreen from './components/InterestsScreen'; // Interests screen
import LocationScreen from './components/LocationScreen'; // Location screen
import PersonalizeScreen from './components/PersonalizeScreen'; // Personalize screen
import { Ionicons } from '@expo/vector-icons';
import { auth } from './firebase/firebase';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator setup for main app screens (Home, Favorites, Tickets, Explore, Profile)
const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // Hide headers for tab screens
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Favorites') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Tickets') {
                        iconName = focused ? 'ticket' : 'ticket-outline'; // Icon for Tickets
                    } else if (route.name === 'Explore') {
                        iconName = focused ? 'search' : 'search-outline'; // Icon for Explore
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#ff7518',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} />
            <Tab.Screen name="Tickets" component={TicketsScreen} /> 
            <Tab.Screen name="Explore" component={ExploreScreen} /> 
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

// Main App component
export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => { 
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    if (loading) {
        return null; // Show loading state or splash screen while loading
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Group>
                        <Stack.Screen name="Splash" component={SplashScreen} />
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                        <Stack.Screen name="Auth" component={AuthScreen} />
                    </Stack.Group>
                ) : (
                    <>
                        <Stack.Screen name="Interests" component={InterestsScreen} />
                        <Stack.Screen name="Location" component={LocationScreen} />
                        <Stack.Screen name="Personalize" component={PersonalizeScreen} />
                        <Stack.Screen name="Main" component={TabNavigator} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
