import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/userStore';
import { MatrixBackground } from '@/components/MatrixBackground';
import { useThemeStore } from '@/store/themeStore';
import { useLanguageStore } from '@/store/languageStore';
import { LogIn } from 'lucide-react-native';
import { IMAGES } from '@/constants/images';
import { Card } from '@/components/Card';

const GOOGLE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { primaryColor, secondaryColor } = useThemeStore();
  const { t } = useLanguageStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data
      const mockUser = {
        id: 'user123',
        name: 'Amir Gharegozlou',
        email: 'everai@rexent.com',
        photoUrl: IMAGES.defaultProfileMale, // Default to male profile
        connectedPlatforms: [],
      };
      
      setUser(mockUser);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'There was an error logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MatrixBackground />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: IMAGES.logo }} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Card glass gradient style={styles.loginCard}>
          <View style={styles.headerContainer}>
            <Image 
              source={{ uri: IMAGES.logo }} 
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.title}>{t('auth.welcome')}</Text>
          </View>
          
          <Text style={styles.subtitle}>
            {t('auth.subtitle')}
          </Text>
          
          <View style={styles.loginContainer}>
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.googleButtonContent}>
                  <Text style={styles.googleButtonText}>{t('auth.loggingIn')}</Text>
                </View>
              ) : (
                <View style={styles.googleButtonContent}>
                  <Image source={{ uri: GOOGLE_LOGO }} style={styles.googleLogo} />
                  <Text style={styles.googleButtonText}>{t('auth.loginWithGoogle')}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <Button
              title={t('auth.login')}
              onPress={handleGoogleLogin}
              loading={loading}
              variant="glass"
              icon={<LogIn size={20} color={COLORS.text} />}
              style={styles.loginButton}
            />
          </View>
          
          <Text style={styles.footerText}>
            {t('auth.termsAndPrivacy')}
          </Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center', // Ensure logo is centered
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center', // Center header content
    width: '100%', // Ensure full width
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 24,
  },
  loginContainer: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center', // Center login buttons
  },
  googleButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Ensure content takes full width
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    marginBottom: 16,
    alignSelf: 'center',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});