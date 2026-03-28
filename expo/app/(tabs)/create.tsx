import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Keyboard,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  Animated
} from 'react-native';
import { COLORS } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ContentTypeSelector } from '@/components/ContentTypeSelector';
import { ContentPreview } from '@/components/ContentPreview';
import { useUserStore } from '@/store/userStore';
import { useContentStore } from '@/store/contentStore';
import { SocialPlatform, ContentType, GeneratedContent } from '@/types';
import { SOCIAL_PLATFORMS } from '@/constants/socialPlatforms';
import { useThemeStore } from '@/store/themeStore';
import { useLanguageStore } from '@/store/languageStore';
import { Wand2, X, ArrowRight, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { generateContent } from '@/services/aiService';
import { StyledText, StyledTextInput } from '@/components/FontProvider';

export default function CreateScreen() {
  const router = useRouter();
  const { user, connectPlatform } = useUserStore();
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
  const [accountId, setAccountId] = useState('');
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [prompt, setPrompt] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAccountInput, setShowAccountInput] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const inputAnim = useState(new Animated.Value(0))[0];
  const scrollViewRef = useRef<ScrollView>(null);
  const inputFieldRef = useRef<View>(null);

  // Listen for keyboard events
  useEffect(() => {
    const keyboardWillShow = (event: any) => {
      setKeyboardVisible(true);
      Animated.timing(inputAnim, {
        toValue: -event.endCoordinates.height / 2,
        duration: 250,
        useNativeDriver: true,
      }).start();
      scrollToInput();
    };

    const keyboardWillHide = () => {
      setKeyboardVisible(false);
      Animated.timing(inputAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    };

    const showListener = Platform.OS !== 'web' ? Keyboard.addListener('keyboardWillShow', keyboardWillShow) : { remove: () => {} };
    const hideListener = Platform.OS !== 'web' ? Keyboard.addListener('keyboardWillHide', keyboardWillHide) : { remove: () => {} };

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [inputAnim]);

  // Scroll to input when account input is shown
  useEffect(() => {
    if (showAccountInput) {
      // Adding a small delay to ensure the component is rendered before scrolling
      setTimeout(() => {
        scrollToInput();
      }, 100);
    }
  }, [showAccountInput]);

  const scrollToInput = () => {
    if (inputFieldRef.current && scrollViewRef.current) {
      inputFieldRef.current.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y, animated: true });
        },
        () => console.log('Measurement failed')
      );
    }
  };

  const handleSelectPlatform = (platform: SocialPlatform) => {
    setSelectedPlatform(platform);
    setShowAccountInput(true);
    clearCurrentContent();
    setError(null);
    setGeneratedContent(null);
    Animated.timing(inputAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleContinueToContentType = () => {
    if (selectedPlatform) {
      setCurrentStep(2);
    }
  };

  const handleAddAccount = () => {
    if (!selectedPlatform || !accountId.trim()) {
      Alert.alert('Error', 'Please enter an account ID');
      return;
    }

    // Connect the platform with the account ID
    connectPlatform({
      ...selectedPlatform,
      connected: true,
      username: accountId.trim()
    });

    setShowAccountInput(false);
    setCurrentStep(2);
    setAccountId('');
  };

  const handleSkipAccount = () => {
    setShowAccountInput(false);
    setCurrentStep(2);
  };

  const handleSelectContentType = (type: ContentType) => {
    setContentType(type);
    setCurrentStep(3);
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
    setCurrentStep(4);
    Keyboard.dismiss();

    try {
      const generatedText = await generateContent({
        prompt: prompt,
        platform: selectedPlatform.name,
        contentType: contentType.id
      });
      
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
      // Navigate to a new screen for content preview (placeholder for navigation)
      // router.push('/content-preview'); // Uncomment when new screen is created
      
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
    
    setTimeout(() => {
      if (generatedContent) {
        const updatedContent = { ...generatedContent, published: true };
        addContent(updatedContent);
        setGeneratedContent(updatedContent);
        
        Alert.alert(
          'Success',
          `Content published to ${generatedContent.platform}!`,
          [{ text: 'Great!' }]
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

  const handleReset = () => {
    setSelectedPlatform(null);
    setContentType(null);
    setPrompt('');
    setGeneratedContent(null);
    setError(null);
    setCurrentStep(1);
    setShowAccountInput(false);
    setAccountId('');
    clearCurrentContent();
  };

  const handleCancelAccountInput = () => {
    setShowAccountInput(false);
    setSelectedPlatform(null);
    setAccountId('');
    Animated.timing(inputAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

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
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <StyledText style={styles.title}>Create Content</StyledText>
          <StyledText style={styles.subtitle}>
            Create engaging content for your social media platforms
          </StyledText>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((step) => (
            <View key={step} style={styles.progressStep}>
              <View style={[
                styles.progressDot,
                currentStep >= step && { backgroundColor: primaryColor },
                currentStep === step && styles.activeDot
              ]}>
                <StyledText style={[
                  styles.progressNumber,
                  currentStep >= step && { color: 'white' }
                ]}>
                  {step}
                </StyledText>
              </View>
              {step < 3 && (
                <View style={[
                  styles.progressLine,
                  currentStep > step && { backgroundColor: primaryColor }
                ]} />
              )}
            </View>
          ))}
        </View>
        
        {/* Step 1: Select Platform */}
        {currentStep === 1 && (
          <Card style={[styles.stepCard, styles.activeStepCard]}>
            <StyledText style={styles.stepTitle}>1. Select Social Media Platform</StyledText>
            <StyledText style={styles.stepSubtitle}>
              Choose the platform where you want to publish your content
            </StyledText>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.socialScrollContainer}
              style={styles.socialScrollView}
            >
              <View style={styles.socialGrid}>
                {SOCIAL_PLATFORMS.map((platform) => {
                  const isSelected = selectedPlatform?.id === platform.id;
                  return (
                    <TouchableOpacity
                      key={platform.id}
                      style={[
                        styles.socialPlatform,
                        isSelected && { 
                          borderColor: platform.color, 
                          backgroundColor: `${platform.color}15`,
                          shadowColor: platform.color,
                          shadowOpacity: 0.6,
                          shadowRadius: 16,
                          elevation: 12,
                          transform: [{ scale: 1.08 }, { translateY: -4 }]
                        }
                      ]}
                      onPress={() => handleSelectPlatform(platform)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.socialIconContainer,
                        isSelected && {
                          backgroundColor: `${platform.color}20`,
                          borderColor: platform.color,
                          borderWidth: 2
                        }
                      ]}>
                        <Image 
                          source={{ uri: platform.icon }}
                          style={[
                            styles.socialIconImage,
                            platform.id === 'twitter' && styles.twitterIcon
                          ]}
                          resizeMode="contain"
                        />
                      </View>
                      <StyledText style={[
                        styles.socialName,
                        isSelected && { color: platform.color, fontWeight: 'bold' }
                      ]}>
                        {platform.name}
                      </StyledText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            
            {selectedPlatform && !showAccountInput && (
              <View style={styles.continueContainer}>
                <Button
                  title="Continue"
                  onPress={handleContinueToContentType}
                  icon={<ArrowRight size={18} color="white" />}
                  style={styles.continueButton}
                />
              </View>
            )}
          </Card>
        )}

        {/* Account Input Modal */}
        {showAccountInput && selectedPlatform && (
          <Animated.View 
            ref={inputFieldRef}
            style={[
              styles.accountInputCard, 
              { 
                opacity: inputAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }), 
                transform: [{ translateY: inputAnim }] 
              }
            ]}
          >
            <Card>
              <View style={styles.inputHeader}>
                <View style={styles.inputHeaderLeft}>
                  <User size={24} color={primaryColor} />
                  <View style={styles.inputHeaderText}>
                    <StyledText style={styles.inputTitle}>
                      Add {selectedPlatform.name} Account
                    </StyledText>
                    <StyledText style={styles.inputSubtitle}>
                      Enter your username or account ID
                    </StyledText>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleCancelAccountInput}
                  style={styles.closeButton}
                >
                  <X size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            
              <StyledTextInput
                style={styles.accountInput}
                value={accountId}
                onChangeText={setAccountId}
                placeholder="@username or account ID"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
              />
            
              <View style={styles.inputButtons}>
                <Button
                  title="Skip"
                  onPress={handleSkipAccount}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="Add Account"
                  onPress={handleAddAccount}
                  disabled={!accountId.trim()}
                  style={styles.addButton}
                />
              </View>
            </Card>
          </Animated.View>
        )}
        
        {/* Step 2: Select Content Type */}
        {currentStep >= 2 && (
          <Card style={[styles.stepCard, currentStep === 2 && styles.activeStepCard]}>
            <View style={styles.stepHeader}>
              <StyledText style={styles.stepTitle}>2. Content Type</StyledText>
              {contentType && (
                <TouchableOpacity onPress={() => {
                  setContentType(null);
                  setCurrentStep(2);
                }}>
                  <StyledText style={[styles.changeText, { color: primaryColor }]}>
                    Change
                  </StyledText>
                </TouchableOpacity>
              )}
            </View>
            
            {contentType ? (
              <View style={styles.selectedItem}>
                <StyledText style={styles.selectedText}>
                  ✓ {contentType.name} selected
                </StyledText>
              </View>
            ) : (
              <ContentTypeSelector
                selectedType={contentType}
                onSelectType={handleSelectContentType}
              />
            )}
          </Card>
        )}
        
        {/* Step 3: Enter Prompt */}
        {currentStep >= 3 && (
          <Card style={[styles.stepCard, currentStep === 3 && styles.activeStepCard]}>
            <StyledText style={styles.stepTitle}>3. Describe Your Content</StyledText>
            <StyledTextInput
              style={styles.promptInput}
              value={prompt}
              onChangeText={setPrompt}
              placeholder="What content would you like to create? Be specific about the topic, tone, and target audience..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={4}
            />
            <View style={styles.generateContainer}>
              <Button
                title="Generate Content"
                onPress={handleGenerate}
                loading={isGenerating}
                disabled={!prompt.trim()}
                icon={<Wand2 size={18} color="white" />}
                style={styles.generateButton}
              />
            </View>
          </Card>
        )}
        
        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorHeader}>
              <StyledText style={styles.errorText}>{error}</StyledText>
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
        
        {/* Loading State */}
        {isGenerating && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={primaryColor} />
            <StyledText style={styles.loadingText}>
              Generating content...
            </StyledText>
            <StyledText style={styles.loadingSubtext}>
              This may take a few moments
            </StyledText>
          </View>
        )}

        {/* Step 4: Generated Content */}
        {generatedContent && !isGenerating && (
          <Card style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <StyledText style={styles.stepTitle}>4. Generated Content</StyledText>
              <TouchableOpacity onPress={handleReset}>
                <StyledText style={[styles.changeText, { color: primaryColor }]}>
                  Start Over
                </StyledText>
              </TouchableOpacity>
            </View>
            
            <ContentPreview 
              content={generatedContent}
              onPublish={handlePublish}
              onRegenerate={handleRegenerate}
              isPublishing={isPublishing}
            />
          </Card>
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
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 22,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeDot: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  progressNumber: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
  stepCard: {
    marginBottom: 16,
    width: '100%',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeStepCard: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}05`,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedItem: {
    padding: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  selectedText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  accountInputCard: {
    marginBottom: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}08`,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  inputSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  accountInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
  promptInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    color: COLORS.text,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  generateContainer: {
    alignItems: 'flex-end',
  },
  generateButton: {
    minWidth: 160,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: `${COLORS.primary}08`,
    borderRadius: 16,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: `${COLORS.primary}20`,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  loadingSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: `${COLORS.error}15`,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: `${COLORS.error}30`,
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
    lineHeight: 20,
  },
  tryAgainButton: {
    alignSelf: 'flex-end',
    borderColor: COLORS.error,
  },
  socialScrollView: {
    marginVertical: 8,
  },
  socialScrollContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  socialGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  socialPlatform: {
    width: 90,
    height: 110,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      },
      default: {}
    }),
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  socialIconImage: {
    width: 28,
    height: 28,
  },
  twitterIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  socialName: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  continueContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  continueButton: {
    minWidth: 140,
  },
});