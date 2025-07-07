import React from 'react';
import { Tabs } from 'expo-router';
import { useThemeStore } from '@/store/themeStore';
import { useLanguageStore } from '@/store/languageStore';
import { Home, PenTool, BarChart2, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { primaryColor } = useThemeStore();
  const { t } = useLanguageStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopColor: '#222',
          height: Platform.OS === 'ios' ? 90 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -5,
        },
        headerStyle: {
          backgroundColor: '#111',
          borderBottomColor: '#222',
          borderBottomWidth: 1,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.title'),
          tabBarLabel: t('home.title'),
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: t('create.title'),
          tabBarLabel: t('create.title'),
          tabBarIcon: ({ color }) => <PenTool size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: t('analytics.title'),
          tabBarLabel: t('analytics.title'),
          tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          tabBarLabel: t('settings.title'),
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}