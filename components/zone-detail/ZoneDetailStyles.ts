import { FONTS, THEME } from '@/constants/theme'
import { StyleSheet } from 'react-native'

export const zoneStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.paper },
  scrollContent: { paddingBottom: 60 },
  overviewContainer: { width: '100%', height: 380, position: 'relative' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  coverGradient: { position: 'absolute', top: 0, height: 120, left: 0, right: 0 },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(253, 252, 248, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4
  },
  overviewContent: { marginBottom: 24 },
  zoneName: {
    fontSize: 36,
    fontWeight: '800',
    fontFamily: FONTS.serif,
    color: THEME.ink,
    letterSpacing: -0.5,
    lineHeight: 42
  },
  zoneCity: { fontSize: 16, color: THEME.inkMuted, marginTop: 4, fontFamily: FONTS.sans },
  body: {
    padding: 24,
    gap: 32,
    backgroundColor: THEME.paper,
    borderTopRightRadius: 80,
    marginTop: -40,
    paddingTop: 32
  },
  section: { gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  sheetBackground: { backgroundColor: THEME.paper, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetIndicator: { width: 40, height: 5, backgroundColor: THEME.paperDeep, borderRadius: 3, marginTop: 12 },
  sheetContent: { padding: 24, paddingBottom: 40 },
  sheetTitle: { fontSize: 28, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  inputLabel: {
    fontSize: 13,
    fontFamily: FONTS.sans,
    color: THEME.inkLight,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 8,
    marginBottom: 8
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: THEME.ink,
    borderWidth: 1,
    borderColor: 'rgba(20,40,29,0.1)',
    fontFamily: FONTS.sans
  },
  assignButtonBig: {
    backgroundColor: THEME.forest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 999,
    gap: 12,
    shadowColor: THEME.forest,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
    width: '100%'
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
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(159, 95, 128, 0.1)',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 8
  },
  aiButtonText: {
    color: THEME.orchidMain,
    fontWeight: '700',
    fontFamily: FONTS.sans,
    fontSize: 15
  },
  aiCard: {
    backgroundColor: 'rgba(255, 244, 230, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(240, 169, 52, 0.3)',
    borderRadius: 20,
    padding: 16,
    marginTop: 12
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  aiCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.orchidMain,
    fontFamily: FONTS.sans,
    marginLeft: 6
  },
  aiNote: {
    fontSize: 14,
    color: THEME.ink,
    lineHeight: 20,
    fontFamily: FONTS.sans,
    marginBottom: 12
  },
  aiLogicContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  aiLogicTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.inkMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  aiLogicText: {
    fontSize: 14,
    color: THEME.ink,
    lineHeight: 20,
    fontFamily: FONTS.sans,
    marginBottom: 4
  },
  aiActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12
  },
  aiActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999
  },
  aiButtonDismiss: {
    backgroundColor: 'transparent'
  },
  aiButtonDismissText: {
    color: THEME.inkLight,
    fontWeight: '600',
    fontSize: 14
  },
  aiButtonApprove: {
    backgroundColor: THEME.orchidMain
  },
  aiButtonApproveText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  }
})
