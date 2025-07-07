import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  ColorValue,
  Platform,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '@/store/themeStore';
import { COLORS } from '@/constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'danger' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon
}: ButtonProps) => {
  const { primaryColor, secondaryColor } = useThemeStore();
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
          colors: [primaryColor, secondaryColor] as [ColorValue, ColorValue],
        };
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
          colors: ['transparent', 'transparent'] as [ColorValue, ColorValue],
        };
      case 'outline':
        return {
          container: styles.outlineContainer,
          text: { ...styles.outlineText, color: primaryColor },
          colors: ['transparent', 'transparent'] as [ColorValue, ColorValue],
        };
      case 'glass':
        return {
          container: styles.glassContainer,
          text: styles.primaryText,
          colors: [`${primaryColor}60`, `${secondaryColor}40`] as [ColorValue, ColorValue],
        };
      case 'danger':
        return {
          container: styles.dangerContainer,
          text: styles.primaryText,
          colors: ['#ef4444', '#dc2626'] as [ColorValue, ColorValue],
        };
      case 'text':
        return {
          container: styles.textContainer,
          text: { ...styles.textText, color: primaryColor },
          colors: ['transparent', 'transparent'] as [ColorValue, ColorValue],
        };
      default:
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
          colors: [primaryColor, secondaryColor] as [ColorValue, ColorValue],
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const buttonStyle = getButtonStyle();
  const sizeStyle = getSizeStyle();
  const isOutline = variant === 'outline';
  const isGlass = variant === 'glass';

  if (isGlass) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button,
          buttonStyle.container,
          sizeStyle,
          disabled && styles.disabledButton,
          style,
        ]}
      >
        <View style={[styles.glassInner, sizeStyle]}>
          {Platform.OS !== 'web' ? (
            <BlurView 
              intensity={20} 
              tint="dark" 
              style={styles.blurBackground}
            />
          ) : (
            <View style={styles.webGlassBackground} />
          )}
          
          <LinearGradient
            colors={buttonStyle.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, sizeStyle]}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.text} />
            ) : (
              <>
                {icon && icon}
                <Text style={[buttonStyle.text, textStyle]}>{title}</Text>
              </>
            )}
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        buttonStyle.container,
        sizeStyle,
        disabled && styles.disabledButton,
        style,
        isOutline && { borderColor: primaryColor }
      ]}
    >
      <LinearGradient
        colors={buttonStyle.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, sizeStyle]}
      >
        {loading ? (
          <ActivityIndicator color={isOutline ? primaryColor : COLORS.text} />
        ) : (
          <>
            {icon && icon}
            <Text style={[buttonStyle.text, textStyle]}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryContainer: {
    backgroundColor: 'transparent',
  },
  primaryText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  secondaryContainer: {
    backgroundColor: COLORS.surface,
  },
  secondaryText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  outlineText: {
    fontWeight: '500',
  },
  glassContainer: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  glassInner: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
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
    backgroundColor: 'rgba(30, 30, 30, 0.4)',
    backdropFilter: 'blur(8px)',
  },
  smallButton: {
    height: 36,
    paddingHorizontal: 16,
  },
  mediumButton: {
    height: 48,
    paddingHorizontal: 24,
  },
  largeButton: {
    height: 56,
    paddingHorizontal: 32,
  },
  disabledButton: {
    opacity: 0.5,
  },
  dangerContainer: {
    backgroundColor: 'transparent',
  },
  textContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  textText: {
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});