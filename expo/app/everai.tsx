import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, Platform } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Card } from '@/components/Card';
import { useThemeStore } from '@/store/themeStore';
import { useLanguageStore } from '@/store/languageStore';
import { Button } from '@/components/Button';
import { ExternalLink, Mail, Globe, Award, Users, Zap, Lightbulb, Target, Clock } from 'lucide-react-native';
import { IMAGES } from '@/constants/images';
import { Stack } from 'expo-router';

export default function EverAiScreen() {
  const { primaryColor } = useThemeStore();
  const { t } = useLanguageStore();

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Ever AI',
        headerShown: true,
      }} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: IMAGES.logo }} 
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>Ever AI</Text>
          <Text style={styles.heroSubtitle}>AI-Powered Social Media Content Creation</Text>
          <Button
            title="Contact Us"
            onPress={() => Linking.openURL('mailto:everai@rexent.com')}
            variant="primary"
            style={styles.heroButton}
          />
        </View>
        
        <Card gradient style={styles.card}>
          <View style={styles.cardHeader}>
            <Lightbulb size={24} color={primaryColor} />
            <Text style={styles.cardTitle}>Our Vision</Text>
          </View>
          <Text style={styles.paragraph}>
            Ever AI is revolutionizing how creators and businesses manage their social media presence. 
            Our platform uses advanced artificial intelligence to generate high-quality, 
            platform-specific content that resonates with your audience.
          </Text>
          <Text style={styles.paragraph}>
            Founded by Amir Gharegozlou in 2023, Ever AI has quickly grown to become a trusted 
            solution for content creators, marketers, and businesses of all sizes.
          </Text>
        </Card>
        
        <Text style={styles.sectionTitle}>Key Features</Text>
        
        <View style={styles.featuresGrid}>
          <Card style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: `${primaryColor}15` }]}>
              <Zap size={24} color={primaryColor} />
            </View>
            <Text style={styles.featureTitle}>AI-Powered Content</Text>
            <Text style={styles.featureDescription}>
              Generate engaging content tailored to each platform's unique requirements
            </Text>
          </Card>
          
          <Card style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: `${primaryColor}15` }]}>
              <Users size={24} color={primaryColor} />
            </View>
            <Text style={styles.featureTitle}>Multi-Platform Support</Text>
            <Text style={styles.featureDescription}>
              Manage all your social accounts from a single dashboard
            </Text>
          </Card>
          
          <Card style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: `${primaryColor}15` }]}>
              <Target size={24} color={primaryColor} />
            </View>
            <Text style={styles.featureTitle}>Audience Insights</Text>
            <Text style={styles.featureDescription}>
              Understand what resonates with your followers across platforms
            </Text>
          </Card>
          
          <Card style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: `${primaryColor}15` }]}>
              <Clock size={24} color={primaryColor} />
            </View>
            <Text style={styles.featureTitle}>Scheduling</Text>
            <Text style={styles.featureDescription}>
              Plan and schedule your content calendar for optimal engagement
            </Text>
          </Card>
        </View>
        
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Award size={24} color={primaryColor} />
            <Text style={styles.cardTitle}>About the Founder</Text>
          </View>
          <View style={styles.founderContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }} 
              style={styles.founderImage} 
            />
            <View style={styles.founderInfo}>
              <Text style={styles.founderName}>Amir Gharegozlou</Text>
              <Text style={styles.founderRole}>Founder & CEO</Text>
              <Text style={styles.founderBio}>
                With over 15 years of experience in AI and social media marketing, 
                Amir founded Ever AI to solve the challenges he faced managing content 
                across multiple platforms. His vision is to make professional-quality 
                content creation accessible to everyone.
              </Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Globe size={24} color={primaryColor} />
            <Text style={styles.cardTitle}>Contact Information</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Email:</Text>
            <Button
              title="everai@rexent.com"
              onPress={() => Linking.openURL('mailto:everai@rexent.com')}
              variant="text"
              style={styles.contactButton}
            />
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Website:</Text>
            <Button
              title="www.everai.com"
              onPress={() => Linking.openURL('https://www.example.com')}
              variant="text"
              style={styles.contactButton}
            />
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Headquarters:</Text>
            <Text style={styles.contactValue}>San Francisco, California</Text>
          </View>
        </Card>
        
        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2025 Ever AI. All rights reserved.</Text>
          <Text style={styles.version}>Version 1.2.2</Text>
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
  heroSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  heroLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  heroButton: {
    minWidth: 150,
  },
  card: {
    marginBottom: 24,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  paragraph: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureCard: {
    width: '48%',
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  founderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginBottom: 8,
  },
  founderBio: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  contactLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    width: 120,
  },
  contactValue: {
    color: COLORS.text,
    fontSize: 16,
    flex: 1,
  },
  contactButton: {
    padding: 0,
    height: 'auto',
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