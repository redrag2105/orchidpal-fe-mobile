import { useGoogleAuth } from '@/hooks'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import React from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Google icon SVG component
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, marginRight: 12 }}>
      <Text style={{ fontSize: size - 4, fontWeight: '700' }}>G</Text>
    </View>
  )
}

export default function LoginScreen() {
  const router = useRouter()

  const handleAuthSuccess = (token: string) => {
    console.log('Authentication successful!')
    router.replace('/(dashboard)')
  }

  const { signInWithGoogle, isLoading, error } = useGoogleAuth(handleAuthSuccess)

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      Alert.alert('Sign-in failed', 'Unable to sign in with Google. Please try again.')
    }
  }

  // Show error alert when error changes
  React.useEffect(() => {
    if (error) {
      Alert.alert('Sign-in Error', error)
    }
  }, [error])

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
              {/* Welcome text */}
              <View style={styles.welcomeBlock}>
                <Text style={styles.welcomeTitle}>Welcome back</Text>
                <Text style={styles.welcomeSubtitle}>
                  Sign in with your Google account to access your orchid garden.
                </Text>
              </View>

              {/* Google Sign-In button */}
              <TouchableOpacity
                style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
                onPress={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size='small' color='#374151' />
                ) : (
                  <>
                    <GoogleIcon size={20} />
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Terms text */}
              <Text style={styles.termsText}>By signing in, you agree to our Terms of Service and Privacy Policy.</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>First time here?</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('New Account', 'Signing in with Google will automatically create your account.')
              }
            >
              <Text style={styles.footerLink}>Learn more</Text>
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
    backgroundColor: '#f5f3f0'
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
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
    elevation: 2
  },
  brandBlock: {
    marginBottom: 18
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  logoMark: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8c4a7a',
    fontStyle: 'italic'
  },
  brandName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#368358'
  },
  brandTagline: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.45)'
  },
  brandBody: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.65)',
    lineHeight: 20
  },
  cardWrapper: {
    flexGrow: 1,
    marginTop: 12
  },
  card: {
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.96)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4
  },
  welcomeBlock: {
    marginBottom: 24,
    alignItems: 'center'
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.55)',
    textAlign: 'center',
    lineHeight: 20
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2
  },
  googleButtonDisabled: {
    opacity: 0.6
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151'
  },
  termsText: {
    marginTop: 20,
    fontSize: 11,
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'center',
    lineHeight: 16
  },
  footerRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.45)'
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#368358',
    textDecorationLine: 'underline'
  }
})
