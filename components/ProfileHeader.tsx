import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import { useLanguageStore } from '@/store/languageStore';
import { Button } from './Button';
import { User } from 'lucide-react-native';
import { IMAGES } from '@/constants/images';

interface ProfileHeaderProps {
  onEditProfile?: () => void;
}

export const ProfileHeader = ({ onEditProfile }: ProfileHeaderProps) => {
  const { user } = useUserStore();
  const { t } = useLanguageStore();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Not logged in</Text>
      </View>
    );
  }

  // Determine default profile picture if none is set
  const profilePicture = user.photoUrl || IMAGES.defaultProfileMale;

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profilePicture }} style={styles.avatar} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.platformsCount}>
            {t('profile.connectedPlatforms').replace('{count}', user.connectedPlatforms.length.toString())}
          </Text>
        </View>
      </View>
      {onEditProfile && (
        <Button 
          title={t('profile.editProfile')} 
          onPress={onEditProfile} 
          variant="outline" 
          size="small" 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  platformsCount: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
});