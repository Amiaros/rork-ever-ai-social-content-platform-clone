import React, { useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Animated,
  Platform,
  Dimensions
} from 'react-native';
import { SOCIAL_PLATFORMS } from '@/constants/socialPlatforms';
import { COLORS } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { SocialPlatform } from '@/types';
import { useLanguageStore } from '@/store/languageStore';
import { Check } from 'lucide-react-native';
import { StyledText } from '@/components/FontProvider';

interface SocialPlatformSelectorProps {
  selectedPlatform: string | null;
  onSelectPlatform: (platform: SocialPlatform) => void;
  connectedOnly?: boolean;
  connectedPlatforms?: SocialPlatform[];
  onAddMore?: () => void;
  vertical?: boolean;
}

const { width } = Dimensions.get('window');
const PLATFORM_SIZE = Math.min((width - 120) / 3, 90);

export const SocialPlatformSelector = ({
  selectedPlatform,
  onSelectPlatform,
  connectedOnly = false,
  connectedPlatforms = [],
  onAddMore,
  vertical = true
}: SocialPlatformSelectorProps) => {
  const { primaryColor } = useThemeStore();
  const { t } = useLanguageStore();
  
  // Animation values for floating effect
  const floatingAnim = useRef(
    SOCIAL_PLATFORMS.map(() => new Animated.Value(0))
  ).current;
  
  // Setup floating animation
  useEffect(() => {
    const animations = floatingAnim.map((anim, index) => {
      const delay = index * 100;
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
    });
    
    Animated.parallel(animations).start();
    
    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  // Convert SOCIAL_PLATFORMS to have connected property based on connectedPlatforms
  const platformsWithConnected: SocialPlatform[] = SOCIAL_PLATFORMS.map(platform => ({
    ...platform,
    connected: connectedPlatforms.some(p => p.id === platform.id),
    username: connectedPlatforms.find(p => p.id === platform.id)?.username
  }));

  const platforms = connectedOnly 
    ? platformsWithConnected.filter(platform => platform.connected)
    : platformsWithConnected;

  if (platforms.length === 0 && connectedOnly) {
    return (
      <View style={styles.emptyContainer}>
        <StyledText style={styles.emptyText}>No connected accounts available</StyledText>
      </View>
    );
  }

  const renderPlatform = (platform: SocialPlatform, index: number) => {
    const isSelected = selectedPlatform === platform.id;
    const isConnected = platform.connected;
    
    // Calculate floating transform based on animation value
    const translateY = floatingAnim[index % floatingAnim.length].interpolate({
      inputRange: [0, 1],
      outputRange: [0, -4],
    });
    
    return (
      <Animated.View
        key={platform.id}
        style={[
          styles.platformItemContainer,
          { transform: [{ translateY }] }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.platformItem,
            { width: PLATFORM_SIZE, height: PLATFORM_SIZE },
            isSelected && { 
              borderColor: primaryColor, 
              backgroundColor: `${primaryColor}15`,
              shadowColor: primaryColor,
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6
            }
          ]}
          onPress={() => onSelectPlatform(platform)}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: platform.icon }} 
            style={styles.platformIcon} 
            resizeMode="contain"
          />
          <StyledText style={[
            styles.platformName,
            isSelected && { color: primaryColor, fontWeight: 'bold' }
          ]}>
            {platform.name}
          </StyledText>
          
          {/* Connected indicator */}
          {isConnected && (
            <View style={[
              styles.connectedIndicator,
              { backgroundColor: '#4CAF50' }
            ]}>
              <Check size={12} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.platformGrid}>
        {platforms.map((platform, index) => renderPlatform(platform, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
    maxWidth: width - 40,
  },
  platformItemContainer: {
    width: (width - 120) / 3,
    alignItems: 'center',
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))'
      },
      default: {}
    })
  },
  platformItem: {
    borderRadius: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      },
      default: {}
    }),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  platformIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
    borderRadius: 6,
  },
  platformName: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  connectedIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});