import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUsername(data.username);
                        setEmail(data.email || ''); // Set email, but don't allow editing
                        setPhoneNumber(data.phoneNumber || ''); // Set phone number
                        setProfilePicture(data.profilePicture || 'https://example.com/default-profile-picture.jpg');
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    Alert.alert("Error", "Could not fetch user data.");
                }
            }
        };

        fetchUserData();
    }, []);

    const handleUsernameChange = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), { username, phoneNumber });
                Alert.alert("Success", "Profile updated!");
                setModalVisible(false);
            } catch (error) {
                console.error("Error updating profile:", error);
                Alert.alert("Error", "Could not update profile.");
            }
        }
    };

    const handleProfilePictureChange = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImage = result.assets[0].uri;
            setProfilePicture(selectedImage);

            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    await updateDoc(doc(db, 'users', user.uid), { profilePicture: selectedImage });
                    Alert.alert("Success", "Profile picture updated!");
                } catch (error) {
                    console.error("Error updating profile picture:", error);
                    Alert.alert("Error", "Could not update profile picture.");
                }
            }
        } else {
            Alert.alert("No image selected.");
        }
    };

    const handleLogout = () => {
        const auth = getAuth();
        auth.signOut()
            .then(() => navigation.navigate('Splash'))
            .catch(error => {
                console.error("Error signing out:", error);
                Alert.alert("Error", "Could not log out.");
            });
    };

    const sections = [
        { title: "Your Profile", icon: <Ionicons name="person-outline" size={24} color="#ff7518" />, onPress: () => setModalVisible(true) },
        { title: "Payment Methods", icon: <MaterialCommunityIcons name="credit-card-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Payment Methods', 'Details here...') },
        { title: "Settings", icon: <Ionicons name="settings-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Settings', 'Details here...') },
        { title: "Help Center", icon: <Ionicons name="help-circle-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Help Center', 'Details here...') },
        { title: "Privacy Policy", icon: <MaterialCommunityIcons name="shield-lock-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Privacy Policy', 'Details here...') },
        { title: "Invite Friends", icon: <Ionicons name="person-add-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Invite Friends', 'Details here...') },
        { title: "Logout", icon: <Ionicons name="log-out-outline" size={24} color="#ff7518" />, onPress: handleLogout },
    ];

    const settingsSections = [
        { title: "Change Password", icon: <Ionicons name="lock-closed-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Change Password', 'Functionality to change password...') },
        { title: "Two-Factor Authentication", icon: <Ionicons name="shield-checkmark-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Two-Factor Authentication', 'Enable extra security...') },
        { title: "Profile Visibility", icon: <Ionicons name="eye-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Profile Visibility', 'Choose visibility settings...') },
        { title: "Block/Unblock Users", icon: <Ionicons name="person-remove-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Block/Unblock Users', 'Manage blocked users...') },
        { title: "Push Notifications", icon: <Ionicons name="notifications-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Push Notifications', 'Toggle notifications...') },
        { title: "Email Notifications", icon: <Ionicons name="mail-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Email Notifications', 'Control email notifications...') },
        { title: "Language Preferences", icon: <Ionicons name="language-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Language Preferences', 'Choose your language...') },
        { title: "Region Settings", icon: <Ionicons name="globe-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Region Settings', 'Set your region...') },
        { title: "Dark/Light Mode", icon: <Ionicons name="moon-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Dark/Light Mode', 'Switch theme...') },
        { title: "Font Size Adjustment", icon: <Ionicons name="text-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Font Size Adjustment', 'Adjust font size...') }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={handleProfilePictureChange} style={styles.profilePictureContainer}>
                    <Image
                        source={{ uri: profilePicture }}
                        style={styles.profilePicture}
                    />
                </TouchableOpacity>
                <Text style={styles.username}>{username || '@username'}</Text>
            </View>

            <View style={styles.sectionsContainer}>
                {sections.map((section, index) => (
                    <View key={index}>
                        <TouchableOpacity style={styles.section} onPress={section.onPress}>
                            {section.icon}
                            <Text style={styles.sectionText}>{section.title}</Text>
                            <Ionicons name="chevron-forward" size={24} color="#333" />
                        </TouchableOpacity>
                        <View style={styles.separator} />
                    </View>
                ))}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                value={username}
                                onChangeText={setUsername}
                                style={styles.input}
                            />
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                value={email}
                                editable={false} // Make email non-editable
                                style={styles.input}
                            />
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                style={styles.input}
                            />
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity style={styles.modalButton} onPress={handleUsernameChange}>
                                    <Text style={styles.modalButtonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Render Settings Section */}
                {settingsSections.map((section, index) => (
                    <View key={index}>
                        <TouchableOpacity style={styles.section} onPress={section.onPress}>
                            {section.icon}
                            <Text style={styles.sectionText}>{section.title}</Text>
                            <Ionicons name="chevron-forward" size={24} color="#333" />
                        </TouchableOpacity>
                        <View style={styles.separator} />
                    </View>
                ))}
            </View>

            <Text style={styles.versionText}>App Version: 1.0.0</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        marginBottom: 20, // Added margin to create space between header and sections
    },
    backButton: {
        position: 'absolute',
        left: 1,
        top: 50,
        backgroundColor: '#ff7518',
        borderRadius: 18,
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    profilePictureContainer: {
        borderRadius: 75,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#ff7518',
        marginBottom: 5,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    username: {
        fontSize: 20, // Increased size for better visibility
        fontWeight: 'bold',
        color: '#333',
    },
    sectionsContainer: {
        flex: 1,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    sectionText: {
        fontSize: 18,
        flex: 1,
        marginLeft: 10,
        color: '#333',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        backgroundColor: '#ff7518',
        padding: 10,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    versionText: {
        position: 'absolute',
        bottom: 3,
        left: 20,
        color: '#999',
        fontSize: 10,
    },
});
