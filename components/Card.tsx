import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, ColorValue, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, SHADOWS } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  gradient?: boolean;
  glass?: boolean;
}

export const Card = ({ 
  children, 
  style, 
  gradient = false,
  glass = true // Default to glass effect
}: CardProps) => {
  const { primaryColor, secondaryColor, theme } = useThemeStore();

  // Enhanced glassmorphism effect
  if (glass) {
    return (
      <View style={[styles.glassContainer, SHADOWS.medium, style]}>
        {Platform.OS !== 'web' ? (
          <BlurView 
            intensity={20} 
            tint="dark" 
            style={styles.blurBackground}
          />
        ) : (
          <View style={[
            styles.webGlassBackground, 
            { backgroundColor: `${primaryColor}10` }
          ]} />
        )}
        
        {gradient && (
          <LinearGradient
            colors={[`${primaryColor}15`, `${secondaryColor}10`] as [ColorValue, ColorValue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBackground}
          />
        )}
        
        <View style={[
          styles.glassBorder, 
          { borderColor: `${primaryColor}30` }
        ]} />
        
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  // Original card without glass effect
  if (gradient) {
    return (
      <View style={[styles.cardContainer, SHADOWS.medium, style]}>
        <LinearGradient
          colors={[`${primaryColor}20`, `${secondaryColor}10`] as [ColorValue, ColorValue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        />
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.cardContainer, SHADOWS.medium, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  glassContainer: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    backdropFilter: 'blur(10px)',
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webGlassBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    backdropFilter: 'blur(10px)',
  },
  glassBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});