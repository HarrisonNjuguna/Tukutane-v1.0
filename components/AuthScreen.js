import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import { auth } from '../firebase/firebase'; // Adjust the path if necessary
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { FacebookAuthProvider } from 'firebase/auth';
import { Facebook } from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AuthScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);

    useEffect(() => {
        const checkAppleAuth = async () => {
            const available = await AppleAuthentication.isAvailableAsync();
            setIsAppleAuthAvailable(available);
        };
        checkAppleAuth();
    }, []);

    const handleAuth = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        if (isSignUp) {
            if (password !== confirmPassword) {
                Alert.alert('Error', "Passwords don't match");
                return;
            }
            createUserWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    await updateProfile(userCredential.user, { displayName: username });
                    navigation.navigate('Interests');
                })
                .catch(error => {
                    console.error("Sign Up Error:", error);
                    Alert.alert('Error', error.message);
                });
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    navigation.navigate('Main');
                })
                .catch(error => {
                    console.error("Sign In Error:", error);
                    Alert.alert('Error', error.message);
                });
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Success', 'Password reset link sent to your email');
            setForgotPasswordModalVisible(false); // Close the modal
        } catch (error) {
            console.error("Reset Password Error:", error);
            Alert.alert('Error', error.message);
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
                navigation.navigate('Interests');
            }
        } catch (error) {
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
            navigation.navigate('Interests');
        } catch (error) {
            Alert.alert('Apple Login Error', error.message);
        }
    };

    // Check if the email and password fields are filled
    const isLoginReady = email.length > 0 && password.length > 0;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
            <Text style={styles.subtitle}>
                {isSignUp ? 'Fill your information below or register with your social media accounts' : 'Hi Welcome back!'}
            </Text>
            {isSignUp && (
                <>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        placeholder="Username"
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                </>
            )}
            <Text style={styles.label}>Email</Text>
            <TextInput
                placeholder="YourEmail@gmail.com"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
                placeholder="Password"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            {isSignUp && (
                <>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        placeholder="Confirm Password"
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                </>
            )}
            <TouchableOpacity onPress={() => setForgotPasswordModalVisible(true)}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
            {isSignUp && (
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setIsAgreed(!isAgreed)}>
                        <View style={[styles.checkbox, isAgreed && styles.checkedCheckbox]} />
                    </TouchableOpacity>
                    <Text style={styles.checkboxText}>
                        Agree with our <Text style={styles.termsText} onPress={() => setTermsModalVisible(true)}>Terms and Conditions</Text>
                    </Text>
                </View>
            )}
            <TouchableOpacity
                style={[styles.authButton, isLoginReady ? styles.activeButton : styles.inactiveButton]}
                onPress={handleAuth}
                disabled={!isLoginReady || (isSignUp && !isAgreed)}
            >
                <Text style={styles.authButtonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
            </TouchableOpacity>
            <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.orText}>Or sign Up with</Text>
                <View style={styles.line} />
            </View>
            <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                    <FontAwesome name="facebook" size={24} color="#fff" />
                </TouchableOpacity>
                {isAppleAuthAvailable && (
                    <TouchableOpacity style={styles.appleButton} onPress={handleAppleLogin}>
                        <MaterialCommunityIcons name="apple" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.googleButton}>
                    <MaterialCommunityIcons name="google" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggleText}>
                    {isSignUp ? 'Already have an account? ' : 'Don’t have an account? '}
                    <Text style={styles.toggleHighlight}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
                </Text>
            </TouchableOpacity>

            {/* Forgot Password Modal */}
            <Modal
                visible={forgotPasswordModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setForgotPasswordModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Reset Password</Text>
                        <Text style={styles.modalSubtitle}>Enter your email to receive a password reset link</Text>
                        <TextInput
                            placeholder="YourEmail@gmail.com"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity style={styles.resetButton} onPress={handleForgotPassword}>
                            <Text style={styles.resetButtonText}>Send Reset Link</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setForgotPasswordModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Terms Modal */}
            <Modal
                visible={termsModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setTermsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.termsTitle}>Terms and Conditions</Text>
                            <Text style={styles.termsText}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </Text>
                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setTermsModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#848482',
        textAlign: 'center',
        marginBottom: 40,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    forgotPasswordText: {
        color: '#ff7518',
        textAlign: 'center',
        marginVertical: 10,
    },
    authButton: {
        paddingVertical: 15,
        borderRadius: 30,
        marginBottom: 20,
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%',
    },
    activeButton: {
        backgroundColor: '#ff7518',
    },
    inactiveButton: {
        backgroundColor: '#ddd',
    },
    authButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderColor: '#ff7518',
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 10,
    },
    checkedCheckbox: {
        backgroundColor: '#ff7518',
    },
    checkboxText: {
        fontSize: 16,
        color: '#111',
    },
    termsText: {
        color: '#ff7518',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        height: 1,
        flex: 1,
        backgroundColor: '#ddd',
    },
    orText: {
        marginHorizontal: 10,
        color: '#111',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    socialButton: {
        backgroundColor: '#3b5998',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: 60,
    },
    appleButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: 60,
    },
    googleButton: {
        backgroundColor: '#db4437',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        width: 60,
    },
    toggleText: {
        fontSize: 16,
        color: '#111',
        textAlign: 'center',
    },
    toggleHighlight: {
        color: '#ff7518',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    resetButton: {
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#111',
        fontSize: 16,
    },
    termsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
