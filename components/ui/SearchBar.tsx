
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { THEME } from '../dashboard/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

export function SearchBar({ value, onChangeText, placeholder }: { value: string, onChangeText: (text: string) => void, placeholder?: string }) {
  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.container}>
      <View style={styles.inputWrapper}>
        <Search size={20} color={THEME.inkLight} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || 'Search...'}
          placeholderTextColor={THEME.inkMuted}
          autoCapitalize='none'
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn} activeOpacity={0.7}>
            <X size={16} color={THEME.inkLight} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.paper,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: THEME.ink,
  },
  clearBtn: {
    padding: 4,
    marginLeft: 8,
  }
});

