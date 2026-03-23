import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const THEME = { paper: '#fdfcf8', ink: '#14281d', inkLight: '#3a5a40', forest: '#4a795f' };

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={THEME.ink} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Information We Collect</Text>
        <Text style={styles.p}>We collect information from you when you register on our app, place an order, subscribe to our newsletter, respond to a survey, fill out a form, or use our IoT devices.</Text>
        
        <Text style={styles.heading}>How We Use Information</Text>
        <Text style={styles.p}>Any of the information we collect from you may be used in one of the following ways: To personalize your experience, to improve our app, to improve customer service, to process transactions, or to send periodic emails.</Text>
        
        <Text style={styles.heading}>Data Protection</Text>
        <Text style={styles.p}>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</Text>
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
  heading: { fontSize: 18, fontWeight: '600', color: THEME.ink, marginTop: 20, marginBottom: 8 },
  p: { fontSize: 15, color: THEME.inkLight, lineHeight: 22 }
});
