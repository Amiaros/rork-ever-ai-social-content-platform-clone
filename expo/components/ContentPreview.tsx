import React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { COLORS } from '@/constants/colors';
import { Card } from './Card';
import { GeneratedContent } from '@/types';
import { Button } from './Button';
import { useLanguageStore } from '@/store/languageStore';
import { Send, Copy, Download } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { StyledText } from '@/components/FontProvider';

interface ContentPreviewProps {
  content: GeneratedContent;
  onPublish: () => void;
  onRegenerate: () => void;
  isPublishing?: boolean;
}

export const ContentPreview = ({
  content,
  onPublish,
  onRegenerate,
  isPublishing = false,
}: ContentPreviewProps) => {
  const { t } = useLanguageStore();

  const handleCopyToClipboard = async () => {
    if (content.type.id === 'text') {
      try {
        if (Platform.OS === 'web') {
          // Alternative method for web
          const textArea = document.createElement('textarea');
          textArea.value = content.content;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          try {
            document.execCommand('copy');
            Alert.alert(t('common.success'), "Content copied to clipboard");
          } catch (err) {
            Alert.alert(t('common.error'), "Failed to copy text");
          }
          document.body.removeChild(textArea);
        } else {
          // Use expo-clipboard for native platforms
          await Clipboard.setStringAsync(content.content);
          Alert.alert(t('common.success'), "Content copied to clipboard");
        }
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        Alert.alert(t('common.error'), "Failed to copy text");
      }
    }
  };

  const handleDownload = () => {
    if (Platform.OS === 'web') {
      if (content.type.id === 'text') {
        const blob = new Blob([content.content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `content_${content.id}.txt`;
        link.click();
        window.URL.revokeObjectURL(url);
        Alert.alert(t('common.success'), "Content downloaded");
      } else if (content.type.id === 'image') {
        const link = document.createElement('a');
        link.href = content.content;
        link.download = `content_${content.id}.jpg`;
        link.click();
        Alert.alert(t('common.success'), "Image downloaded");
      } else {
        Alert.alert(t('common.error'), "Download not supported for this content type on web");
      }
    } else {
      Alert.alert(t('common.error'), "Download functionality is not supported on this platform");
    }
  };

  const renderContent = () => {
    switch (content.type.id) {
      case 'text':
        return (
          <View style={styles.textContainer}>
            <ScrollView 
              style={styles.textScrollView}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.textScrollContent}
            >
              <StyledText style={styles.textContent}>{content.content}</StyledText>
            </ScrollView>
            <View style={styles.textActions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleCopyToClipboard}
              >
                <Copy size={16} color={COLORS.text} />
                <StyledText style={styles.actionText}>Copy</StyledText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleDownload}
              >
                <Download size={16} color={COLORS.text} />
                <StyledText style={styles.actionText}>Download</StyledText>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'image':
        return (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: content.content }}
              style={styles.image}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.downloadButton} 
              onPress={handleDownload}
            >
              <Download size={16} color={COLORS.text} />
              <StyledText style={styles.downloadText}>Download Image</StyledText>
            </TouchableOpacity>
          </View>
        );
      case 'video':
        return (
          <View style={styles.videoContainer}>
            <StyledText style={styles.placeholderText}>Video Preview</StyledText>
            <TouchableOpacity 
              style={styles.downloadButton} 
              onPress={handleDownload}
            >
              <Download size={16} color={COLORS.text} />
              <StyledText style={styles.downloadText}>Download Video</StyledText>
            </TouchableOpacity>
          </View>
        );
      case 'audio':
        return (
          <View style={styles.audioContainer}>
            <StyledText style={styles.placeholderText}>Audio Preview</StyledText>
            <TouchableOpacity 
              style={styles.downloadButton} 
              onPress={handleDownload}
            >
              <Download size={16} color={COLORS.text} />
              <StyledText style={styles.downloadText}>Download Audio</StyledText>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Card gradient style={styles.container}>
      <StyledText style={styles.title}>{t('create.preview')}</StyledText>
      <View style={styles.contentContainer}>{renderContent()}</View>
      <View style={styles.actions}>
        <Button
          title={t('common.regenerate')}
          onPress={onRegenerate}
          variant="outline"
          style={styles.regenerateButton}
        />
        <Button
          title={t('common.publish')}
          onPress={onPublish}
          icon={<Send size={16} color={COLORS.text} />}
          loading={isPublishing}
          disabled={content.published}
        />
      </View>
      {content.published && (
        <View style={styles.publishedBadge}>
          <StyledText style={styles.publishedText}>{t('create.published')}</StyledText>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contentContainer: {
    minHeight: 200,
    marginBottom: 16,
  },
  textContainer: {
    position: 'relative',
    height: 300, // Fixed height to ensure scrolling works
  },
  textScrollView: {
    maxHeight: 300,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
  },
  textScrollContent: {
    paddingBottom: 40, // Extra padding to ensure scrollability
    paddingRight: 8,
  },
  textContent: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },
  textActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    zIndex: 10,
  },
  actionButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionText: {
    color: COLORS.text,
    fontSize: 12,
    marginLeft: 4,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  downloadButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  downloadText: {
    color: COLORS.text,
    fontSize: 12,
    marginLeft: 4,
  },
  videoContainer: {
    height: 200,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  audioContainer: {
    height: 100,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  regenerateButton: {
    flex: 1,
    marginRight: 8,
  },
  publishedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: `${COLORS.success}30`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  publishedText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: 'bold',
  },
});