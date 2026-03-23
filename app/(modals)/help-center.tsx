import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const THEME = { paper: '#fdfcf8', ink: '#14281d', inkLight: '#3a5a40', forest: '#4a795f' };

export default function HelpCenterScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={THEME.ink} />
        </TouchableOpacity>
        <Text style={styles.title}>Help Center</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          <Text style={styles.q}>How do I add a new device?</Text>
          <Text style={styles.a}>Go to the Devices tab or Settings, and tap 'Add New Device'. Follow the on-screen instructions to connect your IoT kit.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.q}>What is AI Chat?</Text>
          <Text style={styles.a}>AI Chat allows you to ask questions about your plants, upload photos for diagnosis, and receive expert botanical advice.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.q}>How do I change my plant's zone?</Text>
          <Text style={styles.a}>Navigate to the Garden tab, select your plant, and choose 'Edit Zone' from the plant details screen.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.paper },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f0efea', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  title: { fontSize: 24, fontWeight: '700', color: THEME.ink },
  content: { padding: 20 },
  heading: { fontSize: 18, fontWeight: '600', color: THEME.ink, marginBottom: 16 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  q: { fontSize: 16, fontWeight: '600', color: THEME.forest, marginBottom: 8 },
  a: { fontSize: 14, color: THEME.inkLight, lineHeight: 20 }
});
