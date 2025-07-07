import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeneratedContent, ContentType } from '@/types';

interface ContentState {
  generatedContent: GeneratedContent[];
  currentContent: GeneratedContent | null;
  isGenerating: boolean;
  addContent: (content: GeneratedContent) => void;
  setCurrentContent: (content: GeneratedContent | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  markAsPublished: (contentId: string) => void;
  clearCurrentContent: () => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set, get) => ({
      generatedContent: [],
      currentContent: null,
      isGenerating: false,
      addContent: (content: GeneratedContent) => {
        set(state => ({
          generatedContent: [content, ...state.generatedContent],
        }));
      },
      setCurrentContent: (content: GeneratedContent | null) => {
        set({ currentContent: content });
      },
      setIsGenerating: (isGenerating: boolean) => {
        set({ isGenerating });
      },
      markAsPublished: (contentId: string) => {
        set(state => ({
          generatedContent: state.generatedContent.map(content => 
            content.id === contentId 
              ? { ...content, published: true } 
              : content
          ),
          currentContent: state.currentContent?.id === contentId 
            ? { ...state.currentContent, published: true } 
            : state.currentContent
        }));
      },
      clearCurrentContent: () => {
        set({ currentContent: null });
      },
    }),
    {
      name: 'content-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);