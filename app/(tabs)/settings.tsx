import React from 'react';
import { View, StyleSheet, ScrollView, Switch, Linking, Platform, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/userStore';
import { useLanguageStore } from '@/store/languageStore';
import { Language } from '@/i18n';
import { useThemeStore } from '@/store/themeStore';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  Shield, 
  LogOut, 
  Info,
  HelpCircle
} from 'lucide-react-native';
import { Stack } from 'expo-router';
import { StyledText } from '@/components/FontProvider';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useUserStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { darkMode, toggleDarkMode, primaryColor, setPrimaryColor } = useThemeStore();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as Language);
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const handleEverAi = () => {
    router.push('/everai');
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: t('settings.title'),
        headerShown: true,
      }} />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <StyledText style={styles.title}>{t('settings.title')}</StyledText>
        
        <Card glass style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={primaryColor} />
            <StyledText style={styles.sectionTitle}>{t('settings.account')}</StyledText>
          </View>
          
          <Button
            title={t('profile.editProfile')}
            onPress={() => router.push('/profile/edit')}
            variant="outline"
            style={styles.settingButton}
          />
          
          <Button
            title={t('settings.security')}
            onPress={() => {}}
            variant="outline"
            style={styles.settingButton}
          />
        </Card>
        
        <Card glass style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={primaryColor} />
            <StyledText style={styles.sectionTitle}>{t('settings.appearance')}</StyledText>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              {darkMode ? (
                <Moon size={20} color={primaryColor} style={styles.settingIcon} />
              ) : (
                <Sun size={20} color={primaryColor} style={styles.settingIcon} />
              )}
              <StyledText style={styles.settingLabel}>{t('settings.darkMode')}</StyledText>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#767577', true: `${primaryColor}80` }}
              thumbColor={darkMode ? primaryColor : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.colorOptions}>
            <StyledText style={styles.colorTitle}>{t('settings.primaryColor')}</StyledText>
            <View style={styles.colorGrid}>
              {['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'].map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    primaryColor === color && styles.selectedColor
                  ]}
                  onPress={() => setPrimaryColor(color)}
                />
              ))}
            </View>
          </View>
        </Card>
        
        <Card glass style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={20} color={primaryColor} />
            <StyledText style={styles.sectionTitle}>{t('settings.language')}</StyledText>
          </View>
          
          <View style={styles.languageOptions}>
            {['en', 'es', 'fr', 'de', 'pt'].map(lang => (
              <Button
                key={lang}
                title={lang.toUpperCase()}
                onPress={() => handleLanguageChange(lang)}
                variant={language === lang ? 'primary' : 'outline'}
                style={styles.languageButton}
              />
            ))}
          </View>
        </Card>
        
        <Card glass style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={primaryColor} />
            <StyledText style={styles.sectionTitle}>{t('settings.notifications')}</StyledText>
          </View>
          
          <View style={styles.settingRow}>
            <StyledText style={styles.settingLabel}>{t('settings.pushNotifications')}</StyledText>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: `${primaryColor}80` }}
              thumbColor={true ? primaryColor : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
          
          <View style={styles.settingRow}>
            <StyledText style={styles.settingLabel}>{t('settings.emailNotifications')}</StyledText>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: `${primaryColor}80` }}
              thumbColor={false ? primaryColor : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </Card>
        
        <Card glass style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={primaryColor} />
            <StyledText style={styles.sectionTitle}>{t('settings.about')}</StyledText>
          </View>
          
          <Button
            title={t('about.title')}
            onPress={handleAbout}
            variant="outline"
            style={styles.settingButton}
            icon={<Info size={16} color={primaryColor} />}
          />
          
          <Button
            title="Ever AI"
            onPress={handleEverAi}
            variant="outline"
            style={styles.settingButton}
            icon={<Info size={16} color={primaryColor} />}
          />
          
          <Button
            title={t('settings.help')}
            onPress={() => {}}
            variant="outline"
            style={styles.settingButton}
            icon={<HelpCircle size={16} color={primaryColor} />}
          />
          
          <View style={styles.versionContainer}>
            <StyledText style={styles.versionText}>{t('common.version')}</StyledText>
          </View>
        </Card>
        
        <Button
          title={t('common.logout')}
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          icon={<LogOut size={20} color="#fff" />}
        />
      </ScrollView>
    </>
  );
}

// Add TouchableOpacity import at the top


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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 8,
  },
  settingLabel: {
    color: COLORS.text,
    fontSize: 16,
  },
  settingButton: {
    marginBottom: 12,
    justifyContent: 'flex-start',
  },
  colorOptions: {
    marginTop: 8,
    marginBottom: 16,
  },
  colorTitle: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    margin: 4,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  languageButton: {
    margin: 4,
    minWidth: 60,
  },
  versionContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  versionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 40,
  },
});