import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen'; // Adjust the path as necessary
import FavoritesScreen from './screens/FavoritesScreen'; // Create this screen
import CartScreen from './screens/CartScreen'; // Create this screen
import ProfileScreen from './screens/ProfileScreen'; // Create this screen
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
                        } else if (route.name === 'Cart') {
                            iconName = focused ? 'cart' : 'cart-outline';
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
                <Tab.Screen name="Cart" component={CartScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
