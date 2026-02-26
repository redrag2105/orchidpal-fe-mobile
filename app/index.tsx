import { useRouter } from 'expo-router'
import { ArrowRight } from 'lucide-react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// Refined welcome screen with production vibe, no demo hints
export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.root}>
      {/* Background accent */}
      <View style={styles.bgOrb} />

      <View style={styles.container}>
        {/* Brand header */}
        <View style={styles.headerRow}>
          <View style={styles.brandLeft}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoMark}>*</Text>
            </View>
            <View>
              <Text style={styles.brandName}>OrchidPal</Text>
              <Text style={styles.brandTagline}>Expert IoT Sanctuary</Text>
            </View>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Agritech • Pro</Text>
          </View>
        </View>

        {/* Hero card */}
        <View style={styles.heroCard}>
          <Text style={styles.pill}>IoT • Expert System • Orchid</Text>

          <Text style={styles.heroTitle}>
            The Orchid{' '}
            <Text style={styles.heroAccent}>
              Whisperer
              <Text style={styles.heroDot}>.</Text>
            </Text>
          </Text>

          <Text style={styles.heroBody}>
            Translate live sensor data into calm, precise actions for your most delicate plants. Designed
            with growers and experts in the loop.
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.primaryButtonText}>Get started</Text>
              <ArrowRight size={16} color='white' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.secondaryButtonText}>View dashboard</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Realtime telemetry</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaLabel}>Rule engine</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaLabel}>Expert console</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already onboarded?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Sign in to your garden</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f3f0',
  },
  bgOrb: {
    position: 'absolute',
    top: -120,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: '#f3e5f5',
    opacity: 0.7,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  logoMark: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8c4a7a',
    fontStyle: 'italic',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#368358',
  },
  brandTagline: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.4)',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.55)',
  },
  heroCard: {
    borderRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 22,
    backgroundColor: 'rgba(255,255,255,0.94)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#f0f6f2',
    fontSize: 11,
    fontWeight: '600',
    color: '#4a795f',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4a795f',
    lineHeight: 34,
    marginBottom: 10,
  },
  heroAccent: {
    fontStyle: 'italic',
    color: '#8c4a7a',
  },
  heroDot: {
    color: '#b674a4',
  },
  heroBody: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.7)',
    lineHeight: 20,
    marginBottom: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#1f2933',
    marginRight: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.75)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaLabel: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#368358',
    marginHorizontal: 6,
  },
  footerRow: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.45)',
    marginRight: 4,
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#368358',
    textDecorationLine: 'underline',
  },
})

