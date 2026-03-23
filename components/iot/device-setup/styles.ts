import { Platform, StyleSheet } from 'react-native'
import { THEME, FONTS } from './theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.paper
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: THEME.ink
  },
  headerSpacer: {
    width: 40
  },
  content: {
    flex: 1,
    paddingHorizontal: 20
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 28,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(74, 121, 95, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20
  },
  iconSuccess: {
    backgroundColor: 'rgba(74, 121, 95, 0.1)'
  },
  iconError: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)'
  },
  completeIconContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)'
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.ink,
    textAlign: 'center',
    marginBottom: 10
  },
  stepDescription: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.55)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24
  },
  highlight: {
    color: THEME.orchidMain,
    fontWeight: '600'
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(74,121,95,0.06)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.ink,
    marginBottom: 4
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 19
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.orchidMain,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    gap: 8
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600'
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(74, 121, 95, 0.08)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    gap: 8,
    marginBottom: 12
  },
  secondaryButtonText: {
    color: THEME.forest,
    fontSize: 15,
    fontWeight: '600'
  },
  buttonSpacing: {
    marginTop: 8
  },
  buttonDisabled: {
    opacity: 0.5
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8
  },
  linkButtonText: {
    color: THEME.inkLight,
    fontSize: 13,
    fontWeight: '500'
  },
  // QR Scanner specific
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
    overflow: 'hidden'
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between'
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16
  },
  scannerCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scannerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white'
  },
  scannerPlaceholder: {
    width: 40
  },
  scannerFrameBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative'
  },
  scannerCorner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: THEME.orchidMain
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12
  },
  scannerFooter: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60
  },
  scannerHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20
  },
  // Form fields
  fieldBlock: {
    marginBottom: 14
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1f2937'
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1f2937'
  },
  nicknameInput: {
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12
  },
  nicknameSubmitButton: {
    marginTop: 8
  },
  locationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  locationInput: {
    flex: 1
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 121, 95, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wifiNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(140,74,122,0.08)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10
  },
  wifiName: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.orchidMain,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 20
  },
  helperText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'left',
    marginBottom: 0,
    flex: 1
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12
  },
  statusInfo: {
    flex: 1
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 121, 95, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lastCheckedText: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.35)',
    marginTop: 2
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24
  },
  zoneList: {
    marginBottom: 20
  },
  zoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(248,248,248,0.6)',
    marginBottom: 10
  },
  zoneItemSelected: {
    borderColor: THEME.forest,
    backgroundColor: 'rgba(74,121,95,0.06)'
  },
  zoneRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  zoneRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.forest
  },
  zoneInfo: {
    flex: 1
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937'
  },
  zoneDesc: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 2
  },
  summaryBox: {
    backgroundColor: 'rgba(74,121,95,0.06)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(74,121,95,0.1)'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.55)'
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e'
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#22c55e'
  },
  // Camera styles
  permissionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8
  },
  permissionText: {
    flex: 1,
    fontSize: 12,
    color: '#92400e',
    lineHeight: 16
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black'
  },
  camera: {
    flex: 1
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between'
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  cameraCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cameraTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white'
  },
  scanFrameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative'
  },
  scanCorner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderColor: THEME.orchidMain
  },
  scanCornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12
  },
  scanCornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12
  },
  scanCornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12
  },
  scanCornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12
  },
  cameraFooter: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center'
  },
  cameraHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center'
  },
  // Empty zones placeholder
  emptyZones: {
    paddingVertical: 24,
    alignItems: 'center'
  },
  emptyZonesText: {
    fontSize: 14,
    color: '#6b7280'
  },
  // Input group for forms
  inputGroup: {
    marginBottom: 16
  },
  fieldHint: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4
  },
  // Exposure selector
  exposureSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 8
  },
  exposureValue: {
    fontSize: 15,
    color: '#1f2937',
    marginTop: 2
  },
  exposureOptions: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    overflow: 'hidden'
  },
  exposureOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  exposureOptionSelected: {
    backgroundColor: '#ecfdf5'
  },
  exposureOptionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937'
  },
  exposureOptionLabelSelected: {
    color: THEME.forest
  },
  exposureOptionDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2
  },
  // Plant species selection styles
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12
  },
  loadingText: {
    fontSize: 14,
    color: THEME.inkLight
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8
  },
  emptyText: {
    fontSize: 14,
    color: THEME.inkLight
  },
  speciesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 16
  },
  speciesCard: {
    width: '47%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 121, 95, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(74, 121, 95, 0.12)',
    alignItems: 'center',
    gap: 8
  },
  speciesIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(159, 95, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  speciesName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.ink,
    textAlign: 'center'
  },
  speciesScientific: {
    fontSize: 11,
    fontStyle: 'italic',
    color: THEME.inkLight,
    textAlign: 'center'
  },
  selectedSpeciesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(159, 95, 128, 0.08)',
    marginBottom: 16,
    gap: 12
  },
  speciesIconSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(159, 95, 128, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedSpeciesInfo: {
    flex: 1
  },
  selectedSpeciesName: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.ink
  },
  selectedSpeciesScientific: {
    fontSize: 12,
    fontStyle: 'italic',
    color: THEME.inkLight,
    marginTop: 2
  },
  // Cancel confirmation modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalContent: {
    backgroundColor: THEME.paper,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 20
  },
  modalTitle: {
    fontFamily: FONTS.serif,
    fontSize: 22,
    fontWeight: '700',
    color: THEME.ink,
    textAlign: 'center',
    marginBottom: 12
  },
  modalMessage: {
    fontFamily: FONTS.sans,
    fontSize: 15,
    color: THEME.inkLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28
  },
  modalButtons: {
    gap: 12,
    marginTop: 4
  },
  modalButtonPrimary: {
    backgroundColor: THEME.ink,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4
  },
  modalButtonPrimaryText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONTS.sans
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(20, 40, 29, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center'
  },
  modalButtonSecondaryText: {
    color: THEME.ink,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONTS.sans
  }
})
