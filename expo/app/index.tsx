import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { MatrixBackground } from '@/components/MatrixBackground';
import { IMAGES } from '@/constants/images';
import { useUserStore } from '@/store/userStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/store/themeStore';

export default function SplashScreen() {
  const { isLoggedIn } = useUserStore();
  const { primaryColor, secondaryColor } = useThemeStore();
  const router = useRouter();

  // Use useEffect for navigation instead of Redirect component
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }, 2000); // Give a bit more time for the root layout to mount
    
    return () => clearTimeout(timer);
  }, [isLoggedIn, router]);

  return (
    <View style={styles.container}>
      <MatrixBackground />
      <LinearGradient
        colors={[`${primaryColor}30`, `${secondaryColor}20`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glassCircle}
      />
      <View style={styles.content}>
        <Image 
          source={{ uri: IMAGES.logo }} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>EVER AI</Text>
        <Text style={styles.subtitle}>Smart AI-powered content for all your social media platforms</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  glassCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: '50%',
    left: '50%',
    marginTop: -150,
    marginLeft: -150,
    opacity: 0.5,
    backdropFilter: 'blur(20px)',
  },
});