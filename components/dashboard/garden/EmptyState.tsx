import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Inbox } from 'lucide-react-native';
import { THEME } from '@/components/dashboard/theme';
import { gardenStyles as styles } from './styles';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No items found matching your criteria." }: EmptyStateProps) {
  return (
    <View style={styles.emptyStateContainer}>
      <Inbox size={48} color={THEME.inkLight} strokeWidth={1} />
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );
}