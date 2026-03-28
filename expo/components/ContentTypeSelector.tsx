import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useLanguageStore } from '@/store/languageStore';
import { ContentType } from '@/types';
import { Image, FileText, Video, Music } from 'lucide-react-native';
import { StyledText } from '@/components/FontProvider';

interface ContentTypeSelectorProps {
  selectedType: ContentType | null;
  onSelectType: (type: ContentType) => void;
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = Math.min(width / 4 - 16, 100);

export const ContentTypeSelector = ({
  selectedType,
  onSelectType,
}: ContentTypeSelectorProps) => {
  const { primaryColor } = useThemeStore();
  const { t } = useLanguageStore();

  const contentTypes: ContentType[] = [
    {
      id: 'text',
      name: 'Text Post',
      icon: 'text',
      description: 'Create engaging text content'
    },
    {
      id: 'image',
      name: 'Image Post',
      icon: 'image',
      description: 'Generate image descriptions and captions'
    },
    {
      id: 'video',
      name: 'Video Script',
      icon: 'video',
      description: 'Create video scripts and descriptions'
    },
    {
      id: 'audio',
      name: 'Audio Script',
      icon: 'audio',
      description: 'Generate podcast or audio content scripts'
    },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'text':
        return <FileText size={24} color={COLORS.text} />;
      case 'image':
        return <Image size={24} color={COLORS.text} />;
      case 'video':
        return <Video size={24} color={COLORS.text} />;
      case 'audio':
        return <Music size={24} color={COLORS.text} />;
      default:
        return <FileText size={24} color={COLORS.text} />;
    }
  };

  // Animation values for floating effect
  const floatingAnim = useRef(
    contentTypes.map(() => new Animated.Value(0))
  ).current;
  
  // Setup floating animation
  useEffect(() => {
    const animations = floatingAnim.map((anim, index) => {
      // Stagger the animations slightly
      const delay = index * 150;
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1500,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
    });
    
    // Start all animations
    Animated.parallel(animations).start();
    
    return () => {
      // Stop animations on unmount
      animations.forEach(anim => anim.stop());
    };
  }, []);

  return (
    <View style={styles.container}>
      {contentTypes.map((item, index) => {
        const isSelected = selectedType?.id === item.id;
        
        // Calculate floating transform based on animation value
        const translateY = floatingAnim[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6], // Float up to 6 pixels
        });
        
        // Calculate scale based on selection
        const scale = isSelected ? 1.05 : 1;
        
        return (
          <Animated.View
            key={item.id}
            style={[
              styles.typeItemContainer,
              { transform: [{ translateY }, { scale }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.typeItem,
                isSelected && { 
                  borderColor: primaryColor, 
                  backgroundColor: `${primaryColor}20`,
                  shadowColor: primaryColor,
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                  elevation: 6
                },
              ]}
              onPress={() => onSelectType(item)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                isSelected && { backgroundColor: `${primaryColor}30` }
              ]}>
                {getIcon(item.icon)}
              </View>
              <StyledText style={[
                styles.typeLabel,
                isSelected && { color: primaryColor, fontWeight: 'bold' }
              ]}>
                {item.name}
              </StyledText>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  typeItemContainer: {
    margin: 8,
  },
  typeItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  typeLabel: {
    color: COLORS.text,
    fontSize: 14,
    textAlign: 'center',
  },
});