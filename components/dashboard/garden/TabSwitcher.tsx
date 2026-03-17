import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { gardenStyles as styles } from './styles';

interface TabSwitcherProps {
  activeTab: 'zones' | 'plants';
  onTabChange: (tab: 'zones' | 'plants') => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.tabContainer}>
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'zones' && styles.tabButtonActive]}
          onPress={() => onTabChange('zones')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'zones' && styles.tabButtonTextActive]}>My Zones</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'plants' && styles.tabButtonActive]}
          onPress={() => onTabChange('plants')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'plants' && styles.tabButtonTextActive]}>My Plants</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}