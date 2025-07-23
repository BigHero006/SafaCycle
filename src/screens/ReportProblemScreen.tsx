import React, { useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput,ScrollView,Image,Platform,Alert,} from 'react-native';

const ReportProblem: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [problemType, setProblemType] = useState('');
  const [description, setDescription] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const problemTypes = [
    'Missed Collection',
    'Overflowing Bin',
    'Damaged Bin',
    'Illegal Dumping',
    'Collection Schedule Issue',
    'Recycling Problem',
    'Hazardous Waste Issue',
    'Other'
  ];

  const handleProblemTypeSelect = (type: string) => {
    setProblemType(type);
    setShowDropdown(false);
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Upload Image',
      'Choose an option to add supporting image',
      [
        {
          text: 'Camera',
          onPress: () => {
            // Simulate camera capture
            setUploadedImage('camera_image_uri');
            Alert.alert('Success', 'Photo taken successfully!');
          }
        },
        {
          text: 'Gallery',
          onPress: () => {
            // Simulate gallery selection
            setUploadedImage('gallery_image_uri');
            Alert.alert('Success', 'Image selected from gallery!');
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleSubmit = () => {
    if (!problemType || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    // Navigate directly to MenuScreen after successful submission
    navigation.navigate('MenuScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.box}>
          <Text style={styles.label}>Problem Type *</Text>
          <TouchableOpacity 
            style={styles.dropdown} 
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={styles.dropdownText}>
              {problemType || 'Select problem type...'}
            </Text>
            <Text style={styles.dropdownArrow}>{showDropdown ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownOptions}>
              {problemTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownOption,
                    index === problemTypes.length - 1 && styles.lastDropdownOption
                  ]}
                  onPress={() => handleProblemTypeSelect(type)}
                >
                  <Text style={styles.dropdownOptionText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Problem Description *</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Please provide detailed description of the problem..."
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Supporting Image (Optional)</Text>
          <TouchableOpacity style={styles.imageUploadBox} onPress={handleImageUpload}>
            {uploadedImage ? (
              <View style={styles.uploadedImageContainer}>
                <Text style={styles.uploadedImageText}>📷 Image Uploaded</Text>
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setUploadedImage(null)}
                >
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.imageUploadIcon}>📷</Text>
                <Text style={styles.imageUploadText}>
                  Tap to add photo{'\n'}(Camera or Gallery)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
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
    backgroundColor: '#ABE5dA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // to avoid bottom nav bar overlap
  },
  box: {
    backgroundColor: '#A5CECA',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    color: '#000',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A5CECA',
  },
  dropdownText: {
    color: '#000',
    fontSize: 16,
  },
  dropdownArrow: {
    color: '#5B913B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownOptions: {
    backgroundColor: '#5B913B',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownOption: {
    padding: 12,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    borderBottomWidth: 1,
  },
  lastDropdownOption: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  textInput: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    color: '#000',
    padding: 15,
    textAlignVertical: 'top',
    marginBottom: 20,
    minHeight: 100,
    fontSize: 16,
  },
  imageUploadBox: {
    height: 150,
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5B913B',
    borderStyle: 'dashed',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  imageUploadIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  imageUploadText: {
    color: '#5B913B',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  uploadedImageContainer: {
    alignItems: 'center',
  },
  uploadedImageText: {
    color: '#5B913B',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  removeImageButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#5B913B',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
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
    width: '100%',
  },
  navButton: {
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default ReportProblem;
