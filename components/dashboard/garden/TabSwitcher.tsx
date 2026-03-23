import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { gardenStyles as styles } from './styles';
import { THEME } from '../theme';

interface TabSwitcherProps {
  activeTab: 'zones' | 'plants';
  onTabChange: (tab: 'zones' | 'plants') => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(activeTab === 'zones' ? 0 : 1, {
      damping: 15,
      stiffness: 100,
      mass: 0.5,
    });
  }, [activeTab]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      left: `${translateX.value * 50}%`,
    };
  });

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.tabContainer}>
      <View style={styles.tabSwitcher}>
        <Animated.View 
          style={[
            styles.tabButtonActiveIndicator, 
            animatedIndicatorStyle,
            { backgroundColor: THEME.orchidMain }
          ]} 
        />
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange('zones')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'zones' && { color: '#FFFFFF' }]}>My Zones</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange('plants')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabButtonText, activeTab === 'plants' && { color: '#FFFFFF' }]}>My Plants</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}