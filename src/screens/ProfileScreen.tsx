import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { name: authName, email: authEmail, setName: setAuthName } = useAuth();

  const [name, setName] = useState(authName ?? '');
  const [email, setEmail] = useState(authEmail ?? '');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  useEffect(() => {
    setName(authName ?? '');
    setEmail(authEmail ?? '');
  }, [authName, authEmail]);

  const onSave = () => {
    setAuthName(name);
    Alert.alert(
      'Profile Saved',
      `Name: ${name}\nEmail: ${email}\nPassword: ${password}\nLocation: ${location}\nPhone: ${countryCode} ${phoneNumber}\nProfile Image: ${profileImageUri ? 'Updated' : 'No image selected'}`
    );
  };

  const onChangeProfilePicture = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            // Simulate camera capture
            setProfileImageUri('camera_image_uri');
            Alert.alert('Success', 'Photo taken from camera!');
          }
        },
        {
          text: 'Gallery',
          onPress: () => {
            // Simulate gallery selection
            setProfileImageUri('gallery_image_uri');
            Alert.alert('Success', 'Photo selected from gallery!');
          }
        },
        {
          text: 'Remove Photo',
          onPress: () => {
            setProfileImageUri(null);
            Alert.alert('Success', 'Profile photo removed!');
          },
          style: 'destructive'
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.profileImageContainer} onPress={onChangeProfilePicture}>
          {profileImageUri ? (
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          ) : (
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          <View style={styles.editIconContainer}>
            <Text style={styles.editIcon}>📷</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.changePhotoText}>Tap to change photo</Text>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#ccc"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ccc"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
          secureTextEntry
          placeholderTextColor="#ccc"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter your location"
          placeholderTextColor="#ccc"
        />
      </View>

      <View style={styles.phoneContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneInputRow}>
          <TextInput
            style={styles.countryCodeInput}
            value={countryCode}
            onChangeText={setCountryCode}
            keyboardType="phone-pad"
            maxLength={5}
            placeholder="+1"
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.phoneNumberInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            placeholderTextColor="#ccc"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          <Text style={styles.iconText}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')} style={styles.navButton}>
          <Text style={styles.iconText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TrackVehicle')} style={styles.navButton}>
          <Text style={styles.iconText}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MenuScreen')} style={styles.navButton}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCCCCc',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5B9138',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profileInitials: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5B9138',
  },
  editIcon: {
    fontSize: 16,
  },
  changePhotoText: {
    color: '#5B9138',
    fontSize: 14,
    fontWeight: '500',
  },
  placeholderText: {
    color: '#000',
    fontSize: 14,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#000',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFF',
    color: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  phoneContainer: {
    marginBottom: 20,
  },
  phoneInputRow: {
    flexDirection: 'row',
  },
  countryCodeInput: {
    width: 60,
    backgroundColor: '#FFF',
    color: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
    textAlign: 'center',
  },
  phoneNumberInput: {
    flex: 1,
    backgroundColor: '#FFF',
    color: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#5B913B',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#A5CECA',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default ProfileScreen;
