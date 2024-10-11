import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen'; 
import FavoritesScreen from './screens/FavoritesScreen'; 
import TicketsScreen from './screens/TicketsScreen'; 
import ExploreScreen from './screens/ExploreScreen'; 
import ProfileScreen from './screens/ProfileScreen'; 
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Favorites') {
                            iconName = focused ? 'heart' : 'heart-outline';
                        } else if (route.name === 'Tickets') {
                            iconName = focused ? 'ticket' : 'ticket-outline'; // Add icon for Tickets
                        } else if (route.name === 'Explore') {
                            iconName = focused ? 'search' : 'search-outline'; // Add icon for Explore
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
                <Tab.Screen name="Tickets" component={TicketsScreen} /> {/* Add Tickets tab */}
                <Tab.Screen name="Explore" component={ExploreScreen} /> {/* Add Explore tab */}
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
