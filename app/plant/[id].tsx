import { useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, MapPin, Calendar, HeartPulse, ShieldCheck, ChevronRight, Edit3, Settings, Camera } from 'lucide-react-native'
import React, { useState, useRef, useMemo, useCallback } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, TextInput } from 'react-native'
import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { useToast, Toast, ToastTitle } from '@/components/ui/toast'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { THEME, FONTS } from '@/components/dashboard/theme'
import { MOCK_ZONES, MOCK_PLANTS, WIKI_DATA } from '../(dashboard)/garden'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { AddDeviceButton } from '@/components/devices/AddDeviceButton'
import { CancelConfirmModal } from '@/components/iot/device-setup'

import { useFocusEffect } from 'expo-router';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const toast = useToast()
  
  const [plant, setPlant] = useState(MOCK_PLANTS.find((p: any) => p.id === id));
  
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    cancelText: 'Cancel',
    confirmText: 'Confirm',
    onConfirm: () => {}
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, confirmText = 'Confirm', cancelText = 'Cancel') => {
    setConfirmModal({ visible: true, title, message, onConfirm, confirmText, cancelText });
  };

  useFocusEffect(
    useCallback(() => {
      const p = MOCK_PLANTS.find((p: any) => p.id === id);
      if (p) setPlant(p);
    }, [id])
  );
  
  if (!plant) return null;

  const currentZone = MOCK_ZONES.find((z: any) => z.id === plant.zone_id);
  const wikiInfo = plant.species_wiki;
  
  const emptyZones = MOCK_ZONES.filter((z: any) => !z.plant_id);

  const assignSheetRef = useRef<BottomSheet>(null);
  const editProfileSheetRef = useRef<BottomSheet>(null);
  const assignSnapPoints = useMemo(() => ['50%', '67%'], []);
  const editProfileSnapPoints = useMemo(() => ['50%'], []);
  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.3} />
  ), []);

  const handleOpenAssign = () => assignSheetRef.current?.expand();
  const handleOpenEditProfile = () => {
    setEditForm({ nickname: plant.nickname, imageUrl: plant.image_url });
    editProfileSheetRef.current?.expand();
  };

  const [editForm, setEditForm] = useState({ nickname: '', imageUrl: '' });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setEditForm(prev => ({ ...prev, imageUrl: result.assets[0].uri }));
    }
  };

  const handleSaveProfile = () => {
    // In a real app we'd call an API here
    const updatedPlant = { ...plant, nickname: editForm.nickname, image_url: editForm.imageUrl };
    // update mock to reflect immediately in screen as well as list
    const pIndex = MOCK_PLANTS.findIndex((p: any) => p.id === plant.id);
    if(pIndex !== -1) {
      MOCK_PLANTS[pIndex] = updatedPlant;
    }
    setPlant(updatedPlant);
    showToast("Plant profile updated successfully.");
    editProfileSheetRef.current?.close();
  };
  
  const showToast = (message: string) => {
    toast.show({
      placement: "bottom",
      duration: 1500,
      render: ({ id }) => (
        <Toast nativeID={id} action="success" variant="solid" style={styles.toast}>
          <View style={styles.toastDot} />
          <ToastTitle style={styles.toastTitle}>{message}</ToastTitle>
        </Toast>
      )
    })
  }

  const handleConfirmLink = (zoneId: string) => {
    showConfirm(
      "Confirm Assignment",
      "Are you sure you want to assign this plant to this zone?",
      () => {
        setPlant({ ...plant, zone_id: zoneId });
        assignSheetRef.current?.close();
        showToast("Plant has been successfully assigned to the zone.");
      },
      "Assign",
      "Cancel"
    );
  };

  const isProfileChanged = editForm.nickname !== plant.nickname || editForm.imageUrl !== plant.image_url;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Image source={{ uri: plant.image_url }} style={styles.coverImage} />

          <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft color={THEME.ink} size={24} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleOpenEditProfile} style={styles.headerButton}>
              <Settings size={24} color={THEME.ink} />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.profileBox}>
            <HStack style={{ alignItems: 'center', gap: 10 }}>
              <Text style={styles.nickname}>{plant.nickname}</Text>
            </HStack>
            <Text style={styles.species}>{plant.species_wiki.common_name}</Text>
            <View style={[styles.statusTag, plant.health_status === 'GOOD' ? styles.statusHealthy : styles.statusWarning]}>
              <HeartPulse size={12} color={plant.health_status === 'GOOD' ? THEME.forest : THEME.gold} />
              <Text style={[styles.statusText, plant.health_status === 'GOOD' ? styles.statusHealthyText : styles.statusWarningText]}>
                {plant.health_status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>

          {/* Bio Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Botanical Info</Text>
            <View style={styles.card}>
              <HStack style={{ alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <ShieldCheck size={20} color={THEME.forest} />
                <Text style={styles.cardTitle}>Species Profile</Text>
              </HStack>
              <Text style={styles.detailLabel}>Scientific Name</Text>
              <Text style={styles.detailValue}>{wikiInfo?.scientific_name || plant.species_wiki.common_name}</Text>

              {wikiInfo && (
                <HStack style={{ marginTop: 16, gap: 16 }}>
                  <VStack style={{ flex: 1, backgroundColor: THEME.paperDeep, padding: 12, borderRadius: 12 }}>
                    <Text style={{ fontSize: 13, color: THEME.inkLight, fontWeight: '600', marginBottom: 4 }}>Ideal Temp</Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: THEME.orchidMain }}>
                      {wikiInfo.ideal_temp_min} - {wikiInfo.ideal_temp_max}°C
                    </Text>
                  </VStack>
                  <VStack style={{ flex: 1, backgroundColor: THEME.paperDeep, padding: 12, borderRadius: 12 }}>
                    <Text style={{ fontSize: 13, color: THEME.inkLight, fontWeight: '600', marginBottom: 4 }}>Ideal Humidity</Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#3b82f6' }}>
                      {wikiInfo.ideal_humid_min} - {wikiInfo.ideal_humid_max}%
                    </Text>
                  </VStack>
                </HStack>
              )}

              <Text style={[styles.detailLabel, { marginTop: 16 }]}>Care Instructions</Text>
              <Text style={styles.careText}>{wikiInfo?.care_instruction || 'No specific care instructions found.'}</Text>
            </View>
          </View>

          {/* Management Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zone Assignment</Text>
            <View style={styles.card}>
              {currentZone ? (
                <View>
                  <Text style={styles.detailLabel}>Current Location</Text>
                  <HStack style={styles.currentZoneRow}>
                    <MapPin size={20} color={THEME.orchidMain} />
                    <VStack style={{ flex: 1 }}>
                      <Text style={styles.zoneNameText}>{currentZone.name}</Text>
                      <Text style={styles.zoneCityText}>{currentZone.location_city}</Text>
                    </VStack>
                    <View style={{ backgroundColor: 'rgba(74, 121, 95, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: THEME.forest }}>Active</Text>
                    </View>
                  </HStack>
                  <AddDeviceButton title="Move to another Zone" onPress={handleOpenAssign} />
                </View>
              ) : (
                <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                  <Text style={styles.emptyZoneDesc}>This plant is currently not assigned to any monitoring zone.</Text>
                  <AddDeviceButton title="Assign to a Zone" onPress={handleOpenAssign} />
                </View>
              )}
            </View>
          </View>

          {/* History Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plant History</Text>
            <View style={styles.card}>
              
              {/* Timeline Item 1 */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineLine} />
                <View style={[styles.timelineDot, { backgroundColor: THEME.forest }]} />
                <VStack style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Planted</Text>
                  <Text style={styles.timelineDate}>{plant.planted_at}</Text>
                  <Text style={styles.timelineDesc}>Added to your garden collection.</Text>
                </VStack>
              </View>

              {/* Timeline Item 2 */}
              <View style={[styles.timelineItem, { marginBottom: 0 }]}>
                <View style={[styles.timelineDot, { backgroundColor: plant.health_status === 'GOOD' ? THEME.forest : THEME.gold }]} />
                <VStack style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Health Update</Text>
                  <Text style={styles.timelineDate}>Recently</Text>
                  <Text style={styles.timelineDesc}>
                    Status reported as {plant.health_status}.
                  </Text>
                </VStack>
              </View>

            </View>
          </View>

        </View>
      </ScrollView>

      {/* Assignment Bottom Sheet */}
      <BottomSheet
        ref={assignSheetRef}
        index={-1}
        snapPoints={assignSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Assign Zone</Text>
          <Text style={styles.sheetDesc}>Select an available zone to move this plant to.</Text>

          <VStack style={{ gap: 12, marginTop: 16 }}>
            {emptyZones.length > 0 ? emptyZones.map((z: any) => (
              <TouchableOpacity
                key={z.id}
                style={styles.sheetListItem}
                onPress={() => handleConfirmLink(z.id)}
              >
                <Image source={{ uri: z.image_url }} style={styles.sheetThumb} />
                <VStack style={{ flex: 1 }}>
                  <Text style={styles.sheetItemTitle}>{z.name}</Text>
                  <Text style={styles.sheetItemSub}>{z.location_city}</Text>
                </VStack>
                <ChevronRight size={20} color={THEME.inkLight} />
              </TouchableOpacity>
            )) : (
              <Text style={{ textAlign: 'center', marginTop: 20, color: THEME.inkLight }}>No empty zones available.</Text>
            )}
          </VStack>
        </BottomSheetScrollView>
      </BottomSheet>
      {/* Edit Profile Bottom Sheet */}
      <BottomSheet
        ref={editProfileSheetRef}
        index={-1}
        snapPoints={editProfileSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.sheetIndicator}
      >
        <BottomSheetScrollView contentContainerStyle={[styles.sheetContent, { paddingBottom: 40 }]}>
          <Text style={styles.sheetTitle}>Edit Profile</Text>
          
          <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginTop: 24, marginBottom: 16 }}>
            {editForm.imageUrl ? (
              <Image source={{ uri: editForm.imageUrl }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: THEME.ink }} />
            ) : (
              <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: THEME.paperDeep, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: THEME.ink, borderStyle: 'dotted' }}>
                <Text style={{ fontSize: 40, fontWeight: '700', color: THEME.inkLight }}>
                  {editForm.nickname ? editForm.nickname.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
            )}
            <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: THEME.paper, borderRadius: 16, padding: 6, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4 }}>
               <Camera size={16} color={THEME.ink} />
            </View>
          </TouchableOpacity>

          <Text style={[styles.detailLabel, { marginTop: 16, marginBottom: 8 }]}>Nickname</Text>
          <TextInput
            style={styles.sheetInput}
            value={editForm.nickname}
            onChangeText={(text) => setEditForm(f => ({ ...f, nickname: text }))}
            placeholder="Enter nickname"
            placeholderTextColor={THEME.inkLight}
          />

          <TouchableOpacity 
            disabled={!isProfileChanged}
            style={[styles.primaryButton, { marginTop: 32 }, !isProfileChanged && { opacity: 0.5 }]} 
            onPress={handleSaveProfile}
          >
            <Text style={styles.primaryButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
      <CancelConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        cancelText={confirmModal.cancelText}
        confirmText={confirmModal.confirmText}
        onCancel={() => setConfirmModal(prev => ({ ...prev, visible: false }))}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal(prev => ({ ...prev, visible: false }));
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.paper },
  scrollContent: { paddingBottom: 60 },
  headerSection: { width: '100%', alignItems: 'center', paddingBottom: 30, backgroundColor: THEME.paperDark },
  coverImage: { width: '100%', height: 260, resizeMode: 'cover' },
  headerSafeArea: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerButton: { width: 44, height: 44, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  profileBox: { width: '85%', backgroundColor: 'white', borderRadius: 24, padding: 24, marginTop: -60, shadowColor: THEME.ink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 24, elevation: 4, alignItems: 'center' },
  nickname: { fontSize: 32, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink, letterSpacing: -0.5 },
  species: { fontSize: 15, color: THEME.inkLight, fontStyle: 'italic', marginTop: 4, marginBottom: 16 },
  statusTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, gap: 8 },
  statusHealthy: { backgroundColor: 'rgba(74, 121, 95, 0.1)' },
  statusWarning: { backgroundColor: 'rgba(212, 165, 116, 0.15)' },
  statusText: { fontSize: 13, fontWeight: '700' },
  statusHealthyText: { color: THEME.forest },
  statusWarningText: { color: THEME.gold },
  body: { padding: 24, gap: 32 },
  section: { gap: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 24, shadowColor: THEME.ink, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 24, elevation: 3 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: THEME.ink },
  detailLabel: { fontSize: 13, color: THEME.inkLight, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 16, color: THEME.ink, marginTop: 6 },
  careText: { fontSize: 15, color: THEME.inkMuted, marginTop: 8, lineHeight: 24 },
  currentZoneRow: { alignItems: 'center', gap: 16, marginTop: 16, marginBottom: 24, backgroundColor: THEME.paperDeep, padding: 16, borderRadius: 20 },
  zoneNameText: { fontSize: 17, fontWeight: '700', color: THEME.ink },
  zoneCityText: { fontSize: 14, color: THEME.inkLight, marginTop: 2 },
  emptyZoneDesc: { fontSize: 15, color: THEME.inkLight, textAlign: 'center', marginBottom: 24, paddingHorizontal: 12, lineHeight: 22 },
  primaryButton: { backgroundColor: THEME.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 999 },
  primaryButtonText: { color: 'white', fontSize: 15, fontWeight: '600' },
  outlineButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: THEME.paperDeep, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 999 },
  outlineButtonText: { color: THEME.ink, fontSize: 15, fontWeight: '600' },
  timelineItem: { position: 'relative', paddingLeft: 28, marginBottom: 28 },
  timelineLine: { position: 'absolute', left: 5, top: 20, bottom: -28, width: 2, backgroundColor: THEME.paperDeep },
  timelineDot: { position: 'absolute', left: 0, top: 4, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: 'white' },
  timelineContent: { gap: 4 },
  timelineTitle: { fontSize: 16, fontWeight: '700', color: THEME.ink },
  timelineDate: { fontSize: 13, color: THEME.inkLight },
  timelineDesc: { fontSize: 15, color: THEME.inkMuted, marginTop: 4, lineHeight: 22 },
  sheetBackground: { backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  sheetIndicator: { width: 48, height: 5, backgroundColor: THEME.paperDeep, borderRadius: 3, marginTop: 10 },
  sheetContent: { padding: 24, paddingBottom: 40 },
  sheetTitle: { fontSize: 24, fontWeight: '700', fontFamily: FONTS.serif, color: THEME.ink },
  sheetDesc: { fontSize: 15, color: THEME.inkLight, marginTop: 4 },    sheetInput: { backgroundColor: THEME.paper, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: THEME.ink, borderWidth: 1, borderColor: THEME.paperDeep, fontFamily: FONTS.sans },  sheetListItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: THEME.paper, borderRadius: 20, gap: 16 },
  sheetThumb: { width: 56, height: 56, borderRadius: 16, backgroundColor: THEME.paperDeep },
  sheetItemTitle: { fontSize: 16, fontWeight: '700', color: THEME.ink },
  sheetItemSub: { fontSize: 14, color: THEME.inkLight, marginTop: 4 },
  toast: { backgroundColor: THEME.forest, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12, marginBottom: 80, flexDirection: 'row', alignItems: 'center', gap: 8, elevation: 6 },
  toastDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.gold },
  toastTitle: { color: 'white', fontWeight: '600', fontSize: 15 }
})
