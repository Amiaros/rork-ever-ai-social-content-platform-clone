import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/colors';
import { AnalyticsData } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { useLanguageStore } from '@/store/languageStore';
import { Card } from './Card';

interface AnalyticsChartProps {
  data: AnalyticsData;
  type: 'posts' | 'engagement' | 'followers' | 'growth';
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 64;
const CHART_HEIGHT = 150;
const BAR_WIDTH = 20;

export const AnalyticsChart = ({ data, type }: AnalyticsChartProps) => {
  const { primaryColor } = useThemeStore();
  const { t } = useLanguageStore();

  const getTitle = () => {
    switch (type) {
      case 'posts':
        return t('analytics.posts');
      case 'engagement':
        return t('analytics.engagement');
      case 'followers':
        return t('analytics.followers');
      case 'growth':
        return t('analytics.growth');
      default:
        return '';
    }
  };

  const getValue = () => {
    switch (type) {
      case 'posts':
        return data.posts;
      case 'engagement':
        return data.engagement;
      case 'followers':
        return data.followers;
      case 'growth':
        return `${data.growth}%`;
      default:
        return 0;
    }
  };

  const renderChart = () => {
    if (!data.history || data.history.length === 0) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>{t('common.noData')}</Text>
        </View>
      );
    }

    const maxValue = Math.max(...data.history.map((item) => item.value));
    
    return (
      <View style={styles.chartContainer}>
        {data.history.map((item, index) => {
          const barHeight = (item.value / maxValue) * CHART_HEIGHT;
          return (
            <View key={index} style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: barHeight, 
                    backgroundColor: primaryColor 
                  }
                ]} 
              />
              <Text style={styles.barLabel}>{item.date}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.value}>{getValue()}</Text>
      </View>
      {renderChart()}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barContainer: {
    alignItems: 'center',
    width: BAR_WIDTH,
  },
  bar: {
    width: BAR_WIDTH - 8,
    borderRadius: 4,
  },
  barLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  emptyChart: {
    height: CHART_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});