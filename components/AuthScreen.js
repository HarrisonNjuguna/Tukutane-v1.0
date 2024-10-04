import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase/firebase'; // Adjust the path if necessary
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FacebookAuthProvider } from 'firebase/auth';
import { Facebook } from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';
import { FontAwesome } from '@expo/vector-icons';

export default function AuthScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);

    useEffect(() => {
        const checkAppleAuth = async () => {
            const available = await AppleAuthentication.isAvailableAsync();
            setIsAppleAuthAvailable(available);
        };
        checkAppleAuth();
    }, []);

    const handleAuth = () => {
        if (isSignUp) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    console.log('User signed up', userCredential.user);
                    await updateProfile(userCredential.user, { displayName: username });
                    navigation.navigate('Home');
                })
                .catch(error => {
                    console.error(error);
                    Alert.alert('Error', error.message);
                });
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    console.log('User signed in', userCredential.user);
                    navigation.navigate('Home');
                })
                .catch(error => {
                    console.error(error);
                    Alert.alert('Error', error.message);
                });
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await Facebook.initializeAsync({ appId: 'YOUR_FACEBOOK_APP_ID' });
            const { type, token } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile', 'email'],
            });
            if (type === 'success') {
                const credential = FacebookAuthProvider.credential(token);
                await auth.signInWithCredential(credential);
                navigation.navigate('Home');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Facebook Login Error', error.message);
        }
    };

    const handleAppleLogin = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            const appleCredential = firebase.auth.AppleAuthProvider.credential(credential.identityToken);
            await auth.signInWithCredential(appleCredential);
            navigation.navigate('Home');
        } catch (error) {
            console.error(error);
            Alert.alert('Apple Login Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
            {isSignUp && (
                <TextInput
                    placeholder="Username"
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
            )}
            <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
                <Text style={styles.authButtonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggleText}>
                    {isSignUp ? 'Already have an account? Login' : 'Don’t have an account? Sign Up'}
                </Text>
            </TouchableOpacity>

            {/* Facebook Login */}
            <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                <FontAwesome name="facebook" size={20} color="#fff" />
                <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>

            {/* Apple Login (Only for iOS) */}
            {isAppleAuthAvailable && (
                <TouchableOpacity style={styles.appleButton} onPress={handleAppleLogin}>
                    <Text style={styles.appleButtonText}>Sign in with Apple</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#ff5733',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    authButton: {
        backgroundColor: '#f0f0f0', // Light gray background
        paddingVertical: 15,
        borderRadius: 30, // More rounded corners
        marginBottom: 20,
        alignItems: 'center',
        alignSelf: 'center', // Center the button
        width: '80%', // Set width to 80%
        elevation: 3, // Add shadow for modern look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    authButtonText: {
        fontSize: 18,
        color: '#333', // Dark gray for text
        fontWeight: 'bold',
    },    
    toggleText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    socialButton: {
        flexDirection: 'row',
        backgroundColor: '#3b5998',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        alignSelf: 'center', // Center the button
        width: '80%', // Set width to 80%
        justifyContent: 'center', // Center the content
    },
    socialButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center', // Center the text within the button
        marginLeft: 5, // Optional: Small space between icon and text
    },
    appleButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        marginTop: 10,
        alignSelf: 'center', // Center the button
        width: '80%', // Set width to 80%
    },
    appleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
