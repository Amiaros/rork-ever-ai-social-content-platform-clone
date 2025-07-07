import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Card } from '@/components/Card';
import { SocialPlatformSelector } from '@/components/SocialPlatformSelector';
import { AnalyticsChart } from '@/components/AnalyticsChart';
import { useUserStore } from '@/store/userStore';
import { useLanguageStore } from '@/store/languageStore';
import { SocialPlatform, AnalyticsData } from '@/types';
import { StyledText } from '@/components/FontProvider';

// Mock analytics data
const generateMockAnalytics = (platformId: string): AnalyticsData => {
  const getRandomValue = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;
  
  const generateHistory = () => {
    const history = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      history.push({
        date: dateStr,
        value: getRandomValue(100, 1000),
      });
    }
    return history;
  };
  
  return {
    date: new Date().toISOString().split('T')[0],
    views: getRandomValue(500, 5000),
    likes: getRandomValue(100, 1000),
    comments: getRandomValue(50, 500),
    shares: getRandomValue(10, 100),
    platform: platformId,
    posts: getRandomValue(10, 50),
    engagement: getRandomValue(500, 5000),
    followers: getRandomValue(1000, 10000),
    growth: getRandomValue(1, 10),
    history: generateHistory(),
  };
};

export default function AnalyticsScreen() {
  const { user } = useUserStore();
  const { t } = useLanguageStore();
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (selectedPlatform) {
      // In a real app, you would fetch analytics data from an API
      const mockData = generateMockAnalytics(selectedPlatform.id);
      setAnalyticsData(mockData);
    } else {
      setAnalyticsData(null);
    }
  }, [selectedPlatform]);

  const handleSelectPlatform = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <StyledText style={styles.title}>{t('analytics.loginRequired')}</StyledText>
      </View>
    );
  }

  const connectedPlatforms = user.connectedPlatforms;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StyledText style={styles.title}>{t('analytics.title')}</StyledText>
      
      {connectedPlatforms.length === 0 ? (
        <Card style={styles.emptyCard}>
          <StyledText style={styles.emptyText}>
            {t('analytics.noPlatforms')}
          </StyledText>
        </Card>
      ) : (
        <>
          <Card style={styles.platformCard}>
            <StyledText style={styles.sectionTitle}>{t('analytics.selectPlatform')}</StyledText>
            <SocialPlatformSelector
              selectedPlatform={selectedPlatform?.id || null}
              onSelectPlatform={handleSelectPlatform}
              connectedOnly
              connectedPlatforms={connectedPlatforms}
            />
          </Card>
          
          {selectedPlatform && analyticsData ? (
            <View style={styles.analyticsContainer}>
              <StyledText style={styles.platformTitle}>{selectedPlatform.name} {t('analytics.title')}</StyledText>
              
              <View style={styles.overviewCards}>
                <Card style={styles.overviewCard}>
                  <StyledText style={styles.overviewLabel}>{t('analytics.posts')}</StyledText>
                  <StyledText style={styles.overviewValue}>{analyticsData.posts}</StyledText>
                </Card>
                
                <Card style={styles.overviewCard}>
                  <StyledText style={styles.overviewLabel}>{t('analytics.engagement')}</StyledText>
                  <StyledText style={styles.overviewValue}>{analyticsData.engagement}</StyledText>
                </Card>
                
                <Card style={styles.overviewCard}>
                  <StyledText style={styles.overviewLabel}>{t('analytics.followers')}</StyledText>
                  <StyledText style={styles.overviewValue}>{analyticsData.followers}</StyledText>
                </Card>
                
                <Card style={styles.overviewCard}>
                  <StyledText style={styles.overviewLabel}>{t('analytics.growth')}</StyledText>
                  <StyledText style={styles.overviewValue}>{analyticsData.growth}%</StyledText>
                </Card>
              </View>
              
              <AnalyticsChart data={analyticsData} type="engagement" />
              <AnalyticsChart data={analyticsData} type="followers" />
              <AnalyticsChart data={analyticsData} type="posts" />
            </View>
          ) : (
            <Card style={styles.selectPromptCard}>
              <StyledText style={styles.selectPromptText}>
                {t('analytics.selectPrompt')}
              </StyledText>
            </Card>
          )}
        </>
      )}
    </ScrollView>
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
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  platformCard: {
    marginBottom: 16,
    width: '100%',
    padding: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  analyticsContainer: {
    marginTop: 16,
    width: '100%',
  },
  platformTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  overviewCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  overviewCard: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    padding: 16,
  },
  overviewLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  overviewValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectPromptCard: {
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  selectPromptText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});