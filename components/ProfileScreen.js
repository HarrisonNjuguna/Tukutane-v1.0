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
    ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const [helpModalVisible, setHelpModalVisible] = useState(false);
    const [privacyPolicyModalVisible, setPrivacyPolicyModalVisible] = useState(false); 
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [inviteFriendsModalVisible, setInviteFriendsModalVisible] = useState(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [is2FAModalVisible, setIs2FAModalVisible] = useState(false);

    const inviteLink = "https://www.tukutane.io/invite"; // shareable link


    // Fetch user data on mount
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
                        setEmail(data.email || '');
                        setPhoneNumber(data.phoneNumber || '');
                        setProfilePicture(data.profilePicture || '/TukutaneApp/assets/df-profile.png');
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
    
        const phoneRegex = /^\+254[1-9]\d{8}$/;
        if (!phoneRegex.test(phoneNumber)) {
            Alert.alert("Invalid Phone Number", "Please enter a valid Kenyan phone number in the format +254712345678.");
            return;
        }
    
        if (user) {
            try {
                await updateDoc(doc(db, 'users', user.uid), { username, email, phoneNumber });
                Alert.alert("Success", "Profile updated!");
                setModalVisible(false);
            } catch (error) {
                console.error("Error updating profile:", error);
                Alert.alert("Error", "Could not update profile.");
            }
        }
    };

    const handleChangePassword = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);

            try {
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                Alert.alert("Success", "Password changed successfully!");
                setChangePasswordModalVisible(false);
            } catch (error) {
                console.error("Error changing password:", error);
                Alert.alert("Error", "Could not change password. Please check your current password.");
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

    
    const sendVerificationCode = async () => {
        const auth = getAuth();
        const appVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    
        try {
            const verificationId = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setVerificationId(verificationId);
            Alert.alert("Code Sent", "A verification code has been sent to your phone.");
        } catch (error) {
            console.error("Error sending verification code:", error);
            Alert.alert("Error", "Could not send verification code. Please check your phone number and try again.");
        }
    };
    

    const verifyCode = async () => {
        const auth = getAuth();
        try {
            const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
            await auth.signInWithCredential(credential);
            setIs2FAEnabled(true); // Enable 2FA in your user settings
            Alert.alert("Success", "Two-Factor Authentication enabled!");
            setIs2FAModalVisible(false); // Close modal after successful verification
        } catch (error) {
            console.error("Error verifying code:", error);
            Alert.alert("Error", "Invalid verification code.");
        }
    };

    
    

    const sections = [
        { title: "Your Profile", icon: <Ionicons name="person-outline" size={24} color="#ff7518" />, onPress: () => setModalVisible(true) },
        { title: "Payment Methods", icon: <MaterialCommunityIcons name="credit-card-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Payment Methods', 'Details here...') },
        { title: "Help Center", icon: <Ionicons name="help-circle-outline" size={24} color="#ff7518" />, onPress: () => setHelpModalVisible(true) },
        { title: "Privacy Policy", icon: <MaterialCommunityIcons name="shield-lock-outline" size={24} color="#ff7518" />, onPress: () => setPrivacyPolicyModalVisible(true) }, // Link to privacy policy modal
        { title: "Invite Friends", icon: <Ionicons name="person-add-outline" size={24} color="#ff7518" />, onPress: () => setInviteFriendsModalVisible(true) },
        { title: "Logout", icon: <Ionicons name="log-out-outline" size={24} color="#ff7518" />, onPress: handleLogout },
    ];

    const settingsSections = [
        { title: "Change Password", icon: <Ionicons name="lock-closed-outline" size={24} color="#ff7518" />, onPress: () => setChangePasswordModalVisible(true) },
        { title: "Two-Factor Authentication", icon: <Ionicons name="shield-checkmark-outline" size={24} color="#ff7518" />, onPress: () => setIs2FAModalVisible(true) },
        { title: "Profile Visibility", icon: <Ionicons name="eye-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Profile Visibility', 'Choose visibility settings...') },
        { title: "Block/Unblock Users", icon: <Ionicons name="person-remove-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Block/Unblock Users', 'Manage blocked users...') },
        { title: "Push Notifications", icon: <Ionicons name="notifications-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Push Notifications', 'Toggle notifications...') },
        { title: "Email Notifications", icon: <Ionicons name="mail-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Email Notifications', 'Control email notifications...') },
        { title: "Language Preferences", icon: <Ionicons name="language-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Language Preferences', 'Choose your language...') },
        { title: "Region Settings", icon: <Ionicons name="globe-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Region Settings', 'Set your region...') },
        { title: "Dark/Light Mode", icon: <Ionicons name="moon-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Dark/Light Mode', 'Switch theme...') },
        { title: "Font Size Adjustment", icon: <Ionicons name="text-outline" size={24} color="#ff7518" />, onPress: () => Alert.alert('Font Size Adjustment', 'Adjust font size...') },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#ff7518" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleProfilePictureChange} style={styles.profilePictureContainer}>
                    <Image
                        source={{ uri: profilePicture }}
                        style={styles.profilePicture}
                    />
                </TouchableOpacity>
                <Text style={styles.username}>{username || '@username'}</Text>
            </View>

            <ScrollView style={styles.sectionsContainer}>
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

                <Text style={styles.settingsHeader}>Settings</Text>

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
            </ScrollView>

            {/* Username Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                        />
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            style={styles.input}
                        />
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            placeholder="e.g. +254712345678"
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleUsernameChange}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={changePasswordModalVisible}
                onRequestClose={() => setChangePasswordModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.label}>Current Password</Text>
                        <TextInput
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                            style={styles.input}
                        />
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                            <Text style={styles.saveButtonText}>Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setChangePasswordModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Help Center Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={helpModalVisible}
                onRequestClose={() => setHelpModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.label}>Help Center</Text>
                        <Text style={styles.helpText}>
                            If you need assistance, please contact support@example.com or visit our website.
                        </Text>
                        <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            
            {/* Privacy Policy Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={privacyPolicyModalVisible}
                onRequestClose={() => setPrivacyPolicyModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.label}>Privacy Policy</Text>
                        <ScrollView>
                            <Text style={styles.policyText}>
                                Your privacy is important to us. This policy explains how we collect, use and protect your information.
                            </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.tukutane.io/privacy-policy')}>
                                <Text style={[styles.policyLink, { color: '#ff7518' }]}>
                                    Read our full privacy policy here.
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                        <TouchableOpacity onPress={() => setPrivacyPolicyModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for invite friends */}
            
            {/* 2FA Authentication Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={is2FAModalVisible}
                onRequestClose={() => setIs2FAModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.label}>Enable Two-Factor Authentication</Text>
                        <TextInput
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="Enter your phone number"
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={sendVerificationCode}>
                            <Text style={styles.saveButtonText}>Send Code</Text>
                        </TouchableOpacity>
                        <TextInput
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            placeholder="Enter verification code"
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={verifyCode}>
                            <Text style={styles.saveButtonText}>Verify Code</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIs2FAModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Close</Text>
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
        backgroundColor: '#f5f5f5',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        height: 100,
        paddingTop: 70,
        zIndex: 1,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 20,
        paddingTop: 40,
    },
    profilePictureContainer: {
        borderRadius: 50,
        overflow: 'hidden',
        width: 100,
        height: 100,
        marginBottom: 5,
    },
    profilePicture: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    username: {
        marginTop: 5,
        color: '#000',
        fontSize: 19,
        fontWeight: 'bold',
    },
    sectionsContainer: {
        marginTop: 220,
        paddingHorizontal: 20,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    sectionText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
    },
    settingsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%', // Adjust width as necessary
        maxWidth: 400, // Limit max width for larger screens
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'left',
        color: '#000',  
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#ff7518',
        borderRadius: 10,
        paddingVertical: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#ff7518',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
    },
    copyButtonText: {
        color: '#ff7518'
    },
    helpText: {
        marginVertical: 15,
        textAlign: 'center',
        marginBottom: 20,
    },
    policyText: {
        marginVertical: 15,
        textAlign: 'left',
        marginBottom: 20,
    },
    policyLink: {
        marginVertical: 10,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },    
});
