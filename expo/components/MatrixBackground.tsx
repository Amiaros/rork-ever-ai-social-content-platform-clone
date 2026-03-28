import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const MatrixBackground = () => {
  const { primaryColor, secondaryColor } = useThemeStore();
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  // Animate opacity
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={[`${primaryColor}10`, `${secondaryColor}05`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      
      {/* Animated dots or particles */}
      <Animated.View 
        style={[
          styles.particleLayer, 
          { opacity: opacityAnim }
        ]}
      />
      
      {/* Glass-like overlay */}
      <View style={[
        styles.glassOverlay, 
        { backgroundColor: `${primaryColor}05` }
      ]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particleLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    backgroundImage: Platform.OS === 'web' ? 
      'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)' : 
      undefined,
    backgroundSize: '20px 20px',
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(80px)',
  },
});