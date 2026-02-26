import { useRouter } from 'expo-router'
import { ChevronLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Production-style login screen (no demo hints)
export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('p@g.c')
  const [password, setPassword] = useState('123')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    if (email.trim() === 'p@g.c' && password === '123') {
      router.replace('/(dashboard)')
    } else {
      Alert.alert('Sign-in failed', 'The credentials you entered are not valid.')
    }
  }

  const handleForgotPassword = () => {
    Alert.alert('Forgot password', 'Password recovery will be available in a later version.')
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ChevronLeft size={20} color='#1f2937' />
            </TouchableOpacity>
          </View>

          {/* Brand */}
          <View style={styles.brandBlock}>
            <View style={styles.brandRow}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoMark}>*</Text>
              </View>
              <View>
                <Text style={styles.brandName}>OrchidPal</Text>
                <Text style={styles.brandTagline}>Secure access to your garden</Text>
              </View>
            </View>
            <Text style={styles.brandBody}>
              Sign in to review live telemetry, care modes, and expert recommendations across your orchids.
            </Text>
          </View>

          {/* Card */}
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              {/* Email */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Email</Text>
                <View style={styles.fieldRow}>
                  <Mail size={18} color='#9ca3af' />
                  <TextInput
                    style={styles.input}
                    placeholder='you@example.com'
                    placeholderTextColor='#9ca3af'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.fieldBlock}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotText}>Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldRow}>
                  <Lock size={18} color='#9ca3af' />
                  <TextInput
                    style={styles.input}
                    placeholder='••••••••'
                    placeholderTextColor='#9ca3af'
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} color='#6b7280' /> : <Eye size={18} color='#6b7280' />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Primary button */}
              <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                <Text style={styles.primaryButtonText}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Need an OrchidPal account?</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Request access', 'Account provisioning is handled by the OrchidPal admin team.')
              }
            >
              <Text style={styles.footerLink}>Contact administrator</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: {
    flex: 1,
    backgroundColor: '#f5f3f0',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  brandBlock: {
    marginBottom: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoMark: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8c4a7a',
    fontStyle: 'italic',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#368358',
  },
  brandTagline: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.45)',
  },
  brandBody: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.65)',
    lineHeight: 20,
  },
  cardWrapper: {
    flexGrow: 1,
    marginTop: 12,
  },
  card: {
    borderRadius: 28,
    paddingVertical: 22,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.96)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: 'rgba(0,0,0,0.55)',
    marginBottom: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(248,248,248,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#111827',
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#368358',
  },
  primaryButton: {
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  footerRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.45)',
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#368358',
    textDecorationLine: 'underline',
  },
})

