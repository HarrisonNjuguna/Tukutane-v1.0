import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import FavoritesScreen from './components/FavoritesScreen'; 
import TicketsScreen from './components/TicketsScreen';
import ExploreScreen from './components/ExploreScreen'; 
import ProfileScreen from './components/ProfileScreen'; 
import InterestsScreen from './components/InterestsScreen'; 
import LocationScreen from './components/LocationScreen'; 
import PersonalizeScreen from './components/PersonalizeScreen'; 
import EventDetailsScreen from './components/EventDetailsScreen'; 
import AllEventsScreen from './components/AllEventsScreen';
import { Ionicons } from '@expo/vector-icons';
import { auth } from './firebase/firebase';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Favorites') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Tickets') {
                        iconName = focused ? 'ticket' : 'ticket-outline';
                    } else if (route.name === 'Explore') {
                        iconName = focused ? 'search' : 'search-outline';
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
            <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false}}>
                {!user ? (
                    <>
                        <Stack.Screen name="Splash" component={SplashScreen} />
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                        <Stack.Screen name="Auth" component={AuthScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Interests" component={InterestsScreen} />
                        <Stack.Screen name="Location" component={LocationScreen} />
                        <Stack.Screen name="Personalize" component={PersonalizeScreen} />
                        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
                        <Stack.Screen name="AllEvents" component={AllEventsScreen} />
                        <Stack.Screen name="Main" component={TabNavigator} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
