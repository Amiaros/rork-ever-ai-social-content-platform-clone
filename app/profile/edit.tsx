import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  KeyboardAvoidingView,
  Alert,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/userStore';
import { useLanguageStore } from '@/store/languageStore';
import { Camera, User, Eye, EyeOff } from 'lucide-react-native';
import { CountryCodePicker } from '@/components/CountryCodePicker';
import { DatePicker } from '@/components/DatePicker';
import { COUNTRY_CODES } from '@/constants/countryCodes';
import { CountryCode } from '@/types';
import { IMAGES } from '@/constants/images';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const { t } = useLanguageStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfilePicker, setShowProfilePicker] = useState(false);

  // Initialize selected country from user data if available
  useEffect(() => {
    if (user?.countryCode) {
      const country = COUNTRY_CODES.find(c => c.dialCode === user.countryCode);
      if (country) {
        setSelectedCountry(country);
      }
    } else {
      // Default to US if no country code is set
      setSelectedCountry(COUNTRY_CODES[0]);
    }

    // Initialize date of birth if available
    if (user?.dateOfBirth) {
      setDateOfBirth(new Date(user.dateOfBirth));
    }
    
    // Set default profile picture based on email if available
    if (!user?.photoUrl && user?.email) {
      // Simple heuristic: if email contains common female names or "female"/"woman" keywords
      const lowerEmail = user.email.toLowerCase();
      const femaleIndicators = ['female', 'woman', 'girl', 'mary', 'sarah', 'jennifer', 'jessica'];
      const isFemale = femaleIndicators.some(indicator => lowerEmail.includes(indicator));
      
      setPhotoUrl(isFemale ? IMAGES.defaultProfileFemale : IMAGES.defaultProfileMale);
    } else if (user?.photoUrl) {
      setPhotoUrl(user.photoUrl);
    } else {
      // Default to male profile if no email or photo is available
      setPhotoUrl(IMAGES.defaultProfileMale);
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
      setShowProfilePicker(false);
    }
  };

  const selectDefaultProfile = (imageUrl: string) => {
    setPhotoUrl(imageUrl);
    setShowProfilePicker(false);
  };

  const openProfilePicker = () => {
    setShowProfilePicker(true);
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert(t('common.error'), t('profile.nameRequired'));
      return false;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert(t('common.error'), t('profile.validEmailRequired'));
      return false;
    }

    if (phoneNumber && !/^\d{6,15}$/.test(phoneNumber)) {
      Alert.alert(t('common.error'), t('profile.validPhoneRequired'));
      return false;
    }

    if (password && password.length < 6) {
      Alert.alert(t('common.error'), t('profile.passwordTooShort'));
      return false;
    }

    if (password && password !== confirmPassword) {
      Alert.alert(t('common.error'), t('profile.passwordsDoNotMatch'));
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (user) {
        setUser({
          ...user,
          name,
          email,
          photoUrl,
          phoneNumber: phoneNumber || undefined,
          countryCode: selectedCountry?.dialCode || undefined,
          dateOfBirth: dateOfBirth?.toISOString() || undefined,
        });
      }
      
      setLoading(false);
      router.back();
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color={COLORS.text} />
            </View>
          )}
          <TouchableOpacity style={styles.changePhotoButton} onPress={openProfilePicker}>
            <Camera size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('profile.name')}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t('profile.namePlaceholder')}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('profile.email')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={t('profile.emailPlaceholder')}
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('profile.phoneNumber')}</Text>
          <View style={styles.phoneContainer}>
            <View style={styles.countryCodeContainer}>
              <CountryCodePicker
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
              />
            </View>
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder={t('profile.phonePlaceholder')}
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('profile.dateOfBirth')}</Text>
          <DatePicker
            selectedDate={dateOfBirth}
            onSelectDate={setDateOfBirth}
            maximumDate={new Date()} // Can't select future dates
            minimumDate={new Date(1900, 0, 1)} // Minimum year 1900
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('profile.password')}</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder={t('profile.passwordPlaceholder')}
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color={COLORS.textSecondary} />
              ) : (
                <Eye size={20} color={COLORS.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>{t('profile.confirmPassword')}</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t('profile.confirmPasswordPlaceholder')}
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={COLORS.textSecondary} />
              ) : (
                <Eye size={20} color={COLORS.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <Button
          title={t('common.save')}
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />

        {/* Profile Picture Selection Modal */}
        <Modal
          visible={showProfilePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowProfilePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('profile.selectProfilePicture')}</Text>
              
              <View style={styles.profileOptions}>
                <TouchableOpacity 
                  style={styles.profileOption}
                  onPress={() => selectDefaultProfile(IMAGES.defaultProfileMale)}
                >
                  <Image source={{ uri: IMAGES.defaultProfileMale }} style={styles.profileOptionImage} />
                  <Text style={styles.profileOptionText}>{t('profile.male')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.profileOption}
                  onPress={() => selectDefaultProfile(IMAGES.defaultProfileFemale)}
                >
                  <Image source={{ uri: IMAGES.defaultProfileFemale }} style={styles.profileOptionImage} />
                  <Text style={styles.profileOptionText}>{t('profile.female')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.profileOption}
                  onPress={pickImage}
                >
                  <View style={styles.uploadOption}>
                    <Camera size={40} color={COLORS.text} />
                  </View>
                  <Text style={styles.profileOptionText}>{t('profile.uploadPhoto')}</Text>
                </TouchableOpacity>
              </View>
              
              <Button
                title={t('common.cancel')}
                onPress={() => setShowProfilePicker(false)}
                variant="outline"
                style={styles.cancelButton}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: Platform.OS === 'web' ? '40%' : 100,
    backgroundColor: COLORS.surface,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  phoneContainer: {
    flexDirection: 'row',
  },
  countryCodeContainer: {
    width: '30%',
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    color: COLORS.text,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  saveButton: {
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  profileOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  profileOption: {
    alignItems: 'center',
    width: '30%',
  },
  profileOptionImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  uploadOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profileOptionText: {
    color: COLORS.text,
    fontSize: 14,
    textAlign: 'center',
  },
  cancelButton: {
    width: '100%',
  },
});