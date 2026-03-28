import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Keyboard,
  Alert,
  TouchableOpacity
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { SocialPlatformSelector } from '@/components/SocialPlatformSelector';
import { ContentTypeSelector } from '@/components/ContentTypeSelector';
import { ContentPreview } from '@/components/ContentPreview';
import { useUserStore } from '@/store/userStore';
import { useContentStore } from '@/store/contentStore';
import { SocialPlatform, ContentType, GeneratedContent } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { useLanguageStore } from '@/store/languageStore';
import { Wand2, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { generateContent } from '@/services/aiService';

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { 
    addContent, 
    setCurrentContent, 
    isGenerating, 
    setIsGenerating,
    clearCurrentContent,
  } = useContentStore();
  const { primaryColor } = useThemeStore();
  const { t } = useLanguageStore();
  
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [prompt, setPrompt] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const promptInputRef = useRef<TextInput>(null);

  // Listen for keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        scrollToPromptInput();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const scrollToPromptInput = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleSelectPlatform = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    clearCurrentContent();
    setError(null);
    setGeneratedContent(null);
  };

  const handleSelectContentType = (type: ContentType) => {
    setContentType(type);
    clearCurrentContent();
    setError(null);
    setGeneratedContent(null);
  };

  const handleGenerate = async () => {
    if (!selectedPlatform || !contentType || !prompt.trim()) {
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);
    Keyboard.dismiss();

    try {
      // Scroll down to show loading indicator
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      console.log(`Starting content generation for ${selectedPlatform.name}, type: ${contentType}`);
      console.log(`Prompt: ${prompt.substring(0, 50)}...`);

      // Generate content using AI service
      const generatedText = await generateContent({
        prompt: prompt,
        platform: selectedPlatform.name,
        contentType: contentType
      });
      
      console.log(`Content successfully generated, length: ${generatedText.length} characters`);
      
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: contentType,
        content: generatedText,
        platform: selectedPlatform.name,
        createdAt: new Date().toISOString(),
        published: false,
      };

      addContent(newContent);
      setCurrentContent(newContent);
      setGeneratedContent(newContent);
      
      // Scroll to show generated content
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error generating content:', error);
      setError(error instanceof Error ? error.message : "Error generating content");
      
      Alert.alert(
        t('common.error'),
        "There was an error generating your content. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    if (!generatedContent) return;
    
    setIsPublishing(true);
    
    // Simulate publishing delay
    setTimeout(() => {
      if (generatedContent) {
        const updatedContent = { ...generatedContent, published: true };
        addContent(updatedContent);
        setGeneratedContent(updatedContent);
        
        Alert.alert(
          t('create.publishSuccess'),
          t('create.publishSuccessMessage').replace('{platform}', generatedContent.platform),
          [{ text: t('create.great') }]
        );
      }
      setIsPublishing(false);
    }, 1500);
  };

  const handleRegenerate = () => {
    if (prompt && selectedPlatform && contentType) {
      handleGenerate();
    }
  };

  const handleClearError = () => {
    setError(null);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please log in to create content</Text>
      </View>
    );
  }

  const connectedPlatforms = user.connectedPlatforms;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t('create.title')}</Text>
        
        {connectedPlatforms.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {t('create.noPlatforms')}
            </Text>
            <Button
              title={t('common.connect')}
              onPress={() => router.push('/(tabs)/accounts')}
              variant="outline"
              style={styles.emptyButton}
            />
          </Card>
        ) : (
          <>
            <Card style={styles.stepCard}>
              <Text style={styles.stepTitle}>{t('create.step1')}</Text>
              <SocialPlatformSelector
                selectedPlatform={selectedPlatform?.id || null}
                onSelectPlatform={handleSelectPlatform}
                connectedOnly
                connectedPlatforms={connectedPlatforms}
              />
            </Card>
            
            {selectedPlatform && (
              <Card style={styles.stepCard}>
                <Text style={styles.stepTitle}>{t('create.step2')}</Text>
                <ContentTypeSelector
                  selectedType={contentType}
                  onSelectType={handleSelectContentType}
                />
              </Card>
            )}
            
            {selectedPlatform && contentType && (
              <Card style={styles.stepCard}>
                <Text style={styles.stepTitle}>{t('create.step3')}</Text>
                <TextInput
                  ref={promptInputRef}
                  style={styles.promptInput}
                  value={prompt}
                  onChangeText={setPrompt}
                  placeholder={t('create.promptPlaceholder')}
                  placeholderTextColor={COLORS.textSecondary}
                  multiline
                  numberOfLines={4}
                  onFocus={scrollToPromptInput}
                />
                <Button
                  title={t('create.generateContent')}
                  onPress={handleGenerate}
                  loading={isGenerating}
                  disabled={!prompt.trim()}
                  icon={<Wand2 size={20} color={COLORS.text} />}
                  style={styles.generateButton}
                />
              </Card>
            )}
            
            {error && (
              <View style={styles.errorContainer}>
                <View style={styles.errorHeader}>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity onPress={handleClearError}>
                    <X size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
                <Button
                  title={t('common.tryAgain')}
                  onPress={handleGenerate}
                  variant="outline"
                  style={styles.tryAgainButton}
                />
              </View>
            )}
            
            {isGenerating && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={primaryColor} />
                <Text style={styles.loadingText}>{t('create.generatingContent')}</Text>
              </View>
            )}

            {generatedContent && !isGenerating && (
              <ContentPreview 
                content={generatedContent}
                onPublish={handlePublish}
                onRegenerate={handleRegenerate}
                isPublishing={isPublishing}
              />
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120, // Extra padding at bottom for keyboard
    alignItems: 'center', // Center content horizontally
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start', // Keep title aligned to the left
    width: '100%',
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
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
  stepCard: {
    marginBottom: 16,
    width: '100%',
  },
  stepTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  promptInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
    width: '100%',
  },
  generateButton: {
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: `${COLORS.error}20`,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    flex: 1,
  },
  tryAgainButton: {
    alignSelf: 'flex-end',
    borderColor: COLORS.error,
  },
});