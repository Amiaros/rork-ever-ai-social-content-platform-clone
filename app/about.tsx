import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, Platform } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Card } from '@/components/Card';
import { useThemeStore } from '@/store/themeStore';
import { useLanguageStore } from '@/store/languageStore';
import { Button } from '@/components/Button';
import { ExternalLink, Mail, Github, Linkedin, Twitter } from 'lucide-react-native';
import { IMAGES } from '@/constants/images';
import { Stack } from 'expo-router';

export default function AboutScreen() {
  const { primaryColor } = useThemeStore();
  const { t } = useLanguageStore();

  return (
    <>
      <Stack.Screen options={{ 
        title: t('about.title'),
        headerShown: true,
      }} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: IMAGES.logo }} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Card gradient style={styles.card}>
          <View style={styles.headerContainer}>
            <Image 
              source={{ uri: IMAGES.logo }} 
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.sectionTitle}>{t('about.title')}</Text>
          </View>
          <Text style={styles.paragraph}>
            {t('about.description')}
          </Text>
          <Text style={styles.paragraph}>
            {t('about.mission')}
          </Text>
        </Card>
        
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('about.founder')}</Text>
          <View style={styles.founderContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }} 
              style={styles.founderImage} 
            />
            <View style={styles.founderInfo}>
              <Text style={styles.founderName}>{t('about.founderName')}</Text>
              <Text style={styles.founderRole}>{t('about.founderRole')}</Text>
              <View style={styles.socialLinks}>
                <Button 
                  title={t('about.contact')} 
                  onPress={() => Linking.openURL('mailto:everai@rexent.com')} 
                  variant="outline" 
                  size="small"
                  icon={<Mail size={16} color={primaryColor} />}
                  style={styles.socialButton}
                />
                <Button 
                  title="LinkedIn" 
                  onPress={() => Linking.openURL('https://linkedin.com')} 
                  variant="outline" 
                  size="small"
                  icon={<Linkedin size={16} color={primaryColor} />}
                  style={styles.socialButton}
                />
                <Button 
                  title="Twitter" 
                  onPress={() => Linking.openURL('https://twitter.com')} 
                  variant="outline" 
                  size="small"
                  icon={<Twitter size={16} color={primaryColor} />}
                  style={styles.socialButton}
                />
              </View>
            </View>
          </View>
        </Card>
        
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{t('about.technology')}</Text>
          <Text style={styles.paragraph}>
            {t('about.techDescription')}
          </Text>
          <View style={styles.techList}>
            <View style={styles.techItem}>
              <Text style={styles.techName}>{t('about.techItems.ai')}</Text>
              <Text style={styles.techDescription}>{t('about.techItems.aiDesc')}</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techName}>{t('about.techItems.reactNative')}</Text>
              <Text style={styles.techDescription}>{t('about.techItems.reactNativeDesc')}</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techName}>{t('about.techItems.expo')}</Text>
              <Text style={styles.techDescription}>{t('about.techItems.expoDesc')}</Text>
            </View>
          </View>
        </Card>
        
        <View style={styles.footer}>
          <Text style={styles.copyright}>{t('about.copyright')}</Text>
          <Text style={styles.version}>{t('common.version')}</Text>
        </View>
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
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paragraph: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  founderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  founderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  founderInfo: {
    flex: 1,
  },
  founderName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  founderRole: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  socialButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  techList: {
    marginTop: 8,
  },
  techItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  techName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  techDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  copyright: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  version: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});