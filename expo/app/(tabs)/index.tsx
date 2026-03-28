import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProfileHeader } from '@/components/ProfileHeader';
import { useUserStore } from '@/store/userStore';
import { useLanguageStore } from '@/store/languageStore';
import { User, PenTool, BarChart2 } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';
import { IMAGES } from '@/constants/images';
import { StyledText } from '@/components/FontProvider';
import { Stack } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, isLoggedIn } = useUserStore();
  const { primaryColor } = useThemeStore();
  const { t } = useLanguageStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn]);

  if (!user) {
    return null;
  }

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: t('home.title'),
        headerShown: true,
      }} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ProfileHeader onEditProfile={handleEditProfile} />
        
        <Card gradient glass style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <Image 
              source={{ uri: IMAGES.logo }} 
              style={styles.logoImage}
            />
            <View style={styles.welcomeTextContainer}>
              <StyledText style={styles.welcomeTitle}>{t('home.welcome')}</StyledText>
              <StyledText style={styles.welcomeText}>
                {t('home.recentContent')}
              </StyledText>
            </View>
          </View>
        </Card>
        
        <StyledText style={styles.sectionTitle}>{t('home.quickActions')}</StyledText>
        
        <View style={styles.actionsContainer}>
          <Card glass style={styles.actionCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}20` }]}>
              <PenTool size={24} color={primaryColor} />
            </View>
            <StyledText style={styles.actionTitle}>{t('create.title')}</StyledText>
            <StyledText style={styles.actionDescription}>
              {t('create.description')}
            </StyledText>
            <Button
              title={t('common.create')}
              onPress={() => router.push('/(tabs)/create')}
              size="small"
              variant="glass"
              style={styles.actionButton}
            />
          </Card>
          
          <Card glass style={styles.actionCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${primaryColor}20` }]}>
              <BarChart2 size={24} color={primaryColor} />
            </View>
            <StyledText style={styles.actionTitle}>{t('analytics.title')}</StyledText>
            <StyledText style={styles.actionDescription}>
              {t('analytics.description')}
            </StyledText>
            <Button
              title={t('common.analytics')}
              onPress={() => router.push('/(tabs)/analytics')}
              size="small"
              variant="glass"
              style={styles.actionButton}
            />
          </Card>
        </View>
        
        <StyledText style={styles.sectionTitle}>{t('home.recentActivity')}</StyledText>
        
        {user.connectedPlatforms.length === 0 ? (
          <Card glass style={styles.emptyCard}>
            <StyledText style={styles.emptyText}>
              {t('home.noActivity')}
            </StyledText>
            <Button
              title={t('common.create')}
              onPress={() => router.push('/(tabs)/create')}
              variant="glass"
              style={styles.emptyButton}
            />
          </Card>
        ) : (
          <Card glass style={styles.activityCard}>
            <StyledText style={styles.activityText}>
              {t('home.connectedPlatforms').replace('{count}', user.connectedPlatforms.length.toString())}
            </StyledText>
            <Button
              title={t('common.create')}
              onPress={() => router.push('/(tabs)/create')}
              variant="glass"
              style={styles.activityButton}
            />
          </Card>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeCard: {
    marginBottom: 24,
    padding: 24,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    color: COLORS.text,
    fontSize: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionCard: {
    width: '100%',
    marginBottom: 16,
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 16,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
  activityCard: {
    padding: 16,
  },
  activityText: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 16,
  },
  activityButton: {
    alignSelf: 'flex-start',
  },
});