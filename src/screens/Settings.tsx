import React, { useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,Modal,TextInput,ScrollView,Button,} from 'react-native';

const Settings: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [collectionModalVisible, setCollectionModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const [location, setLocation] = useState('');
  const [collectionReminder, setCollectionReminder] = useState('');
  const [language, setLanguage] = useState('English');

  const termsText = `Terms and Conditions

1. Use of the application is subject to acceptance of these terms.
2. User data will be handled according to our privacy policy.
3. The application is provided "as is" without warranties.
4. We reserve the right to update terms at any time.
5. By using the app, you agree to these terms.
`;

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Text style={styles.buttonText}>Profile Setting</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setLocationModalVisible(true)}
        >
          <Text style={styles.buttonText}>Location Setting</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCollectionModalVisible(true)}
        >
          <Text style={styles.buttonText}>Collection Reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setLanguageModalVisible(true)}
        >
          <Text style={styles.buttonText}>Language & Accessibility</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setTermsModalVisible(true)}
        >
          <Text style={styles.buttonText}>Terms and Conditions</Text>
        </TouchableOpacity>
      </View>

      {/* Location Modal */}
      <Modal
        visible={locationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Update Location</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your location"
              placeholderTextColor="#999"
              value={location}
              onChangeText={setLocation}
            />
            <Button title="Save" onPress={() => setLocationModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Collection Reminder Modal */}
      <Modal
        visible={collectionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCollectionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Collection Reminder</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Set your collection reminder"
              placeholderTextColor="#999"
              value={collectionReminder}
              onChangeText={setCollectionReminder}
            />
            <Button title="Save" onPress={() => setCollectionModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Language & Accessibility Modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Language & Accessibility</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter language"
              placeholderTextColor="#999"
              value={language}
              onChangeText={setLanguage}
            />
            <Button title="Save" onPress={() => setLanguageModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Terms and Conditions Modal */}
      <Modal
        visible={termsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTermsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBoxLarge}>
            <Text style={styles.modalTitle}>Terms and Conditions</Text>
            <ScrollView style={styles.termsScroll}>
              <Text style={styles.termsText}>{termsText}</Text>
            </ScrollView>
            <Button title="Close" onPress={() => setTermsModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          <Text style={styles.iconText}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')} style={styles.navButton}>
          <Text style={styles.iconText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LocationScreen')} style={styles.navButton}>
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
    backgroundColor: '#4e54c8',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  box: {
    backgroundColor: '#6a11cb',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#4e54c8',
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#6a11cb',
    borderRadius: 20,
    padding: 20,
  },
  modalBoxLarge: {
    width: '90%',
    height: '70%',
    backgroundColor: '#6a11cb',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#4e54c8',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  termsScroll: {
    marginBottom: 20,
  },
  termsText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#6a11cb',
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
    fontSize: 14,
  },
});

export default Settings;
