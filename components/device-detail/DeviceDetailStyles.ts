import { FONTS, THEME } from '@/components/devices/theme'
import { StyleSheet } from 'react-native'

export const deviceStyles = StyleSheet.create({
  viewMoreBtn: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)'
  },
  viewMoreText: {
    fontSize: 14,
    color: THEME.forest,
    fontWeight: '600'
  },
  container: {
    flex: 1,
    backgroundColor: THEME.paper
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.paperDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: FONTS.serif,
    color: THEME.ink
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
    gap: 16
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconOffline: {
    backgroundColor: THEME.paperDark
  },
  deviceSerial: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: FONTS.sans,
    color: THEME.ink
  },
  statusText: {
    fontSize: 14,
    color: THEME.inkMuted,
    fontWeight: '500'
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  statusOnline: {
    backgroundColor: '#4caf50'
  },
  statusOffline: {
    backgroundColor: '#9e9e9e'
  },
  divider: {
    height: 1,
    backgroundColor: THEME.paperDeep,
    marginVertical: 20
  },
  statsRow: {
    justifyContent: 'space-between'
  },
  statBox: {
    gap: 4
  },
  statLabel: {
    fontSize: 13,
    color: THEME.inkLight,
    fontWeight: '500'
  },
  statValue: {
    fontSize: 15,
    color: THEME.ink,
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: FONTS.serif,
    color: THEME.ink,
    marginTop: 8,
    marginBottom: 4
  },
  activeZoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 121, 95, 0.08)',
    padding: 16,
    borderRadius: 16,
    gap: 12
  },
  activeZoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.forest
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: THEME.paperDeep,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center'
  },
  outlineButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink
  },
  unassignedPrompt: {
    textAlign: 'center',
    color: THEME.inkLight,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20
  },
  primaryButton: {
    backgroundColor: THEME.forest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    gap: 8,
    width: '100%'
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  infoLabel: {
    fontSize: 15,
    color: THEME.inkLight
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink
  },
  logItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'flex-start',
    gap: 16
  },
  logIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.paperDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  logEvent: {
    fontSize: 15,
    color: THEME.ink,
    lineHeight: 22
  },
  logTime: {
    fontSize: 13,
    color: THEME.inkMuted,
    marginTop: 4
  },
  logDivider: {
    height: 1,
    backgroundColor: THEME.paperDeep,
    marginLeft: 68,
    marginRight: 20
  },
  toast: {
    backgroundColor: THEME.forest,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 6
  },
  toastDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.gold },
  toastTitle: { color: 'white', fontWeight: '600', fontSize: 15 },
  sheetBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32
  },
  sheetIndicator: {
    backgroundColor: THEME.paperDeep,
    width: 48,
    height: 5,
    borderRadius: 3,
    marginTop: 10
  },
  sheetContent: {
    padding: 24,
    paddingBottom: 40
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.ink,
    fontFamily: FONTS.serif,
    marginBottom: 8
  },
  sheetDesc: {
    fontSize: 15,
    lineHeight: 22,
    color: THEME.inkMuted,
    marginBottom: 24
  },
  sheetListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.paperDeep,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1
  },
  sheetThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: THEME.paperDeep
  },
  sheetItemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.ink,
    marginBottom: 4
  },
  sheetItemSub: {
    fontSize: 14,
    color: THEME.inkMuted
  }
})
