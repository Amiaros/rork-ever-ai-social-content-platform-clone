import React, { createContext, useContext, ReactNode, forwardRef } from 'react';
import { Text, TextStyle, TextProps, TextInput, TextInputProps } from 'react-native';
import { useThemeStore } from '@/store/themeStore';

// Create context for font family
const FontContext = createContext<string | undefined>(undefined);

// Provider component
export const FontProvider = ({ children }: { children: ReactNode }) => {
  const { font } = useThemeStore();
  
  // For now, only use system fonts to avoid Metro issues
  const fontFamily = font === 'system' ? undefined : undefined;
  
  return (
    <FontContext.Provider value={fontFamily}>
      {children}
    </FontContext.Provider>
  );
};

// Custom Text component that uses the font family from context
export const StyledText = (props: TextProps) => {
  const fontFamily = useContext(FontContext);
  const { style, ...otherProps } = props;
  
  // Apply font family only if it exists
  const fontStyle = fontFamily ? { fontFamily } : {};
  
  return (
    <Text 
      style={[fontStyle, style]} 
      {...otherProps} 
    />
  );
};

// Custom TextInput component that uses the font family from context
// Using forwardRef to properly handle refs
export const StyledTextInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
  const fontFamily = useContext(FontContext);
  const { style, ...otherProps } = props;
  
  // Apply font family only if it exists
  const fontStyle = fontFamily ? { fontFamily } : {};
  
  return (
    <TextInput 
      ref={ref}
      style={[fontStyle, style]} 
      {...otherProps} 
    />
  );
});

// Set display name for debugging
StyledTextInput.displayName = 'StyledTextInput';

// Hook to get the current font style
export const useFontStyle = (): TextStyle => {
  const fontFamily = useContext(FontContext);
  return fontFamily ? { fontFamily } : {};
};