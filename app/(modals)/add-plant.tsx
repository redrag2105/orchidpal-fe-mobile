import { FONTS, THEME } from '@/components/dashboard/theme'
import { CancelConfirmModal } from '@/components/iot/device-setup'
import * as Haptics from 'expo-haptics'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  Droplets,
  Edit3,
  Leaf,
  MapPin,
  Search,
  Thermometer,
  X
} from 'lucide-react-native'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import Animated, { FadeIn, SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated'

import { useAssignPlantToZone } from '@/hooks/mutations/useAssignPlantToZone'
import { useCreatePlant } from '@/hooks/mutations/useCreatePlant'
import { useSpecies } from '@/hooks/queries/useSpecies'
import { useZones } from '@/hooks/queries/useZones'

const { width, height } = Dimensions.get('window')

type PlantData = {
  nickname: string
  species_id: string
  zone_id: string | null
  planted_at: string
  image_url: string
}

const TOTAL_STEPS = 6

export default function AddPlantStoryScreen() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  const [plantData, setPlantData] = useState<PlantData>({
    nickname: '',
    species_id: '',
    zone_id: null,
    planted_at: new Date().toISOString(),
    image_url: 'https://images.unsplash.com/photo-1599388102462-8e7c1a84fbe3?auto=format&fit=crop&q=80&w=300'
  })

  const [savedNickname, setSavedNickname] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: speciesRes, isLoading: isSpeciesLoading } = useSpecies()
  const speciesList = speciesRes?.data || []

  const { data: zonesList, isLoading: isZonesLoading } = useZones()
  const { mutateAsync: createPlantMutate, isPending: isSubmitting } = useCreatePlant()
  const { mutateAsync: assignPlantMutate } = useAssignPlantToZone()

  const currentSpecies = speciesList.find((s) => s.id === plantData.species_id)
  const currentZone = (zonesList || []).find((z) => z.id === plantData.zone_id)

  // Animations based on direction
  const enteringAnim = direction === 'forward' ? SlideInRight.duration(400) : SlideInLeft.duration(400)
  const exitingAnim = direction === 'forward' ? SlideOutLeft.duration(400) : SlideOutRight.duration(400)

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)

  const goToStep = (targetStep: number) => {
    Keyboard.dismiss()
    setDirection(targetStep > step ? 'forward' : 'backward')
    if (targetStep > step) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }
    setTimeout(() => setStep(targetStep), 50)
  }

  const nextStep = () => {
    if (step === 2) setSavedNickname(plantData.nickname || '')
    if (step < TOTAL_STEPS) goToStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) goToStep(step - 1)
    else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setIsConfirmModalVisible(true)
    }
  }

  const handleFinish = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    try {
      const payload = {
        species_id: plantData.species_id,
        nickname: plantData.nickname,
        planted_at: plantData.planted_at.split('T')[0], // yyyy-mm-dd
        image_url: plantData.image_url
      }

      // 1. Create plant without zone_id
      const res = await createPlantMutate(payload as any)
      const newPlantId = res?.data?.id || res?.id || ''

      // 2. Assign plant to zone if chosen
      if (plantData.zone_id && newPlantId) {
        await assignPlantMutate({ plant_id: newPlantId, zone_id: plantData.zone_id })
      }

      router.replace(`/plant/${newPlantId}`)
    } catch (err) {
      console.error(err)
      router.back()
    }
  }

  const renderProgressBar = () => {
    return (
      <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 60, gap: 8 }}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: index < step ? THEME.forest : 'rgba(255, 255, 255, 0.4)'
            }}
          />
        ))}
      </View>
    )
  }

  const renderHeader = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 16 }}>
        <TouchableOpacity onPress={prevStep} style={{ padding: 8 }}>
          <ChevronLeft size={28} color={THEME.ink} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            setIsConfirmModalVisible(true)
          }}
          style={{ padding: 8 }}
        >
          <X size={28} color={THEME.ink} />
        </TouchableOpacity>
      </View>
    )
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        const filteredSpecies = speciesList.filter(
          (s) =>
            s.common_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase())
        )

        return (
          <Animated.View key='step1' entering={enteringAnim} exiting={exitingAnim} style={{ flex: 1, padding: 24 }}>
            <Text style={{ fontFamily: FONTS.serif, fontSize: 32, color: THEME.ink, marginBottom: 24 }}>
              Which green friend are you welcoming today?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 24
              }}
            >
              <Search size={20} color={THEME.forest} />
              <TextInput
                placeholder='Search species...'
                placeholderTextColor={THEME.inkMuted}
                style={{ flex: 1, marginLeft: 12, fontSize: 16, fontFamily: FONTS.sans, color: THEME.ink }}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {isSpeciesLoading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' color={THEME.forest} />
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                keyboardShouldPersistTaps='always'
                contentContainerStyle={{ paddingBottom: 24 }}
              >
                {filteredSpecies.map((species) => {
                  const isActive = plantData.species_id === species.id
                  return (
                    <TouchableOpacity
                      key={species.id}
                      onPress={() => {
                        Haptics.selectionAsync()
                        setPlantData({ ...plantData, species_id: species.id! })
                        if (!isActive) {
                          setTimeout(() => nextStep(), 350)
                        }
                      }}
                      style={{
                        backgroundColor: isActive ? THEME.forestLight : 'rgba(255,255,255,0.8)',
                        borderRadius: 16,
                        marginBottom: 16,
                        borderWidth: 2,
                        borderColor: isActive ? THEME.forest : 'transparent',
                        overflow: 'hidden',
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOpacity: 0.05,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 4 }
                      }}
                    >
                      {species.image_url ? (
                        <Image
                          source={{ uri: species.image_url }}
                          style={{ width: 80, height: 80, borderTopLeftRadius: 14, borderBottomLeftRadius: 14 }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 80,
                            height: 80,
                            backgroundColor: 'rgba(74, 121, 95, 0.1)',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <Leaf size={32} color={THEME.forest} />
                        </View>
                      )}
                      <View style={{ padding: 16, flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: FONTS.sans,
                            fontSize: 18,
                            fontWeight: '600',
                            color: isActive ? THEME.paper : THEME.ink
                          }}
                        >
                          {species.common_name}
                        </Text>
                        <Text
                          style={{
                            fontFamily: FONTS.sans,
                            fontSize: 13,
                            color: isActive ? 'rgba(255,255,255,0.9)' : THEME.inkMuted,
                            marginTop: 4,
                            fontStyle: 'italic'
                          }}
                        >
                          {species.scientific_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            )}

            {!!plantData.species_id && (
              <Animated.View entering={FadeIn} style={{ marginTop: 12, paddingBottom: 8 }}>
                <TouchableOpacity
                  onPress={nextStep}
                  style={{
                    backgroundColor: THEME.forest,
                    paddingVertical: 18,
                    borderRadius: 30,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 10
                  }}
                >
                  <Text style={{ fontFamily: FONTS.sans, fontSize: 16, color: THEME.paper, fontWeight: '600' }}>
                    Continue with {currentSpecies?.common_name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        )

      case 2:
        const hasValidName = !!plantData.nickname
        const isUnchanged = hasValidName && plantData.nickname === savedNickname && savedNickname !== ''

        return (
          <Animated.View
            key='step2'
            entering={enteringAnim}
            exiting={exitingAnim}
            style={{ flex: 1, padding: 24, justifyContent: 'center' }}
          >
            <Text
              style={{ fontFamily: FONTS.serif, fontSize: 32, color: THEME.ink, marginBottom: 40, textAlign: 'center' }}
            >
              What's the name of{'\n'}your new friend?
            </Text>

            <TextInput
              placeholder='Enter name...'
              placeholderTextColor='rgba(20, 40, 29, 0.3)'
              style={{
                fontSize: 30,
                fontFamily: FONTS.serif,
                color: THEME.ink,
                textAlign: 'center',
                borderBottomWidth: 1,
                borderBottomColor: THEME.inkMuted,
                paddingBottom: 16,
                marginBottom: 40
              }}
              value={plantData.nickname}
              onChangeText={(text) => setPlantData({ ...plantData, nickname: text })}
              autoFocus
            />

            <TouchableOpacity
              onPress={nextStep}
              disabled={!hasValidName}
              style={{
                backgroundColor: hasValidName ? THEME.forest : 'rgba(255,255,255,0.3)',
                paddingVertical: 18,
                borderRadius: 30,
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 18,
                  color: hasValidName ? THEME.paper : THEME.inkMuted,
                  fontWeight: '600'
                }}
              >
                {isUnchanged ? 'Keep this name' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )

      case 3:
        const pickImage = async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
          })
          if (!result.canceled && result.assets && result.assets.length > 0) {
            setPlantData({ ...plantData, image_url: result.assets[0].uri })
          }
        }

        return (
          <Animated.View
            key='step3'
            entering={enteringAnim}
            exiting={exitingAnim}
            style={{ flex: 1, padding: 24, justifyContent: 'center' }}
          >
            <Text
              style={{ fontFamily: FONTS.serif, fontSize: 32, color: THEME.ink, marginBottom: 40, textAlign: 'center' }}
            >
              Add a photo of{'\n'}
              {plantData.nickname || 'your plant'}!
            </Text>

            <TouchableOpacity onPress={pickImage} style={{ alignSelf: 'center', marginBottom: 40 }}>
              {plantData.image_url && !plantData.image_url.includes('unsplash') ? (
                <Image
                  source={{ uri: plantData.image_url }}
                  style={{ width: 200, height: 200, borderRadius: 100, borderWidth: 4, borderColor: 'white' }}
                />
              ) : (
                <View
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: THEME.forest,
                    borderStyle: 'dashed'
                  }}
                >
                  <Camera size={48} color={THEME.forest} style={{ marginBottom: 12 }} />
                  <Text style={{ fontFamily: FONTS.sans, color: THEME.forest, fontSize: 16 }}>Tap to choose photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={nextStep}
              style={{ backgroundColor: THEME.forest, paddingVertical: 18, borderRadius: 30, alignItems: 'center' }}
            >
              <Text style={{ fontFamily: FONTS.sans, fontSize: 18, color: THEME.paper, fontWeight: '600' }}>
                {plantData.image_url && !plantData.image_url.includes('unsplash') ? 'Looks great' : 'Skip for now'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )

      case 4:
        return (
          <Animated.View
            key='step3'
            entering={enteringAnim}
            exiting={exitingAnim}
            style={{ flex: 1, padding: 24, justifyContent: 'center' }}
          >
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderRadius: 24,
                padding: 32,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.05,
                shadowRadius: 15
              }}
            >
              {currentSpecies?.image_url ? (
                <Image
                  source={{ uri: currentSpecies?.image_url }}
                  style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 24 }}
                />
              ) : (
                <Leaf size={48} color={THEME.forest} style={{ marginBottom: 24 }} />
              )}

              <Text
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 24,
                  color: THEME.ink,
                  marginBottom: 8,
                  textAlign: 'center'
                }}
              >
                {plantData.nickname || 'New Friend'}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 16,
                  color: THEME.inkMuted,
                  marginBottom: 32,
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}
              >
                {currentSpecies?.common_name}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 24,
                  marginBottom: 24,
                  minHeight: 60,
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                <View
                  style={{ alignItems: 'center', flex: 1, backgroundColor: THEME.paper, padding: 12, borderRadius: 16 }}
                >
                  <Thermometer size={24} color={THEME.orchidMain} style={{ marginBottom: 8 }} />
                  <Text
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 15,
                      color: THEME.ink,
                      fontWeight: '700',
                      textAlign: 'center'
                    }}
                  >
                    {currentSpecies?.ideal_temp_min}-{currentSpecies?.ideal_temp_max}Â°C
                  </Text>
                  <Text style={{ fontFamily: FONTS.sans, fontSize: 12, color: THEME.inkMuted, marginTop: 4 }}>
                    Temp
                  </Text>
                </View>
                <View
                  style={{ alignItems: 'center', flex: 1, backgroundColor: THEME.paper, padding: 12, borderRadius: 16 }}
                >
                  <Droplets size={24} color={'#4ba3e3'} style={{ marginBottom: 8 }} />
                  <Text
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 15,
                      color: THEME.ink,
                      fontWeight: '700',
                      textAlign: 'center'
                    }}
                  >
                    {currentSpecies?.ideal_humid_min}-{currentSpecies?.ideal_humid_max}%
                  </Text>
                  <Text style={{ fontFamily: FONTS.sans, fontSize: 12, color: THEME.inkMuted, marginTop: 4 }}>
                    Humidity
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 14,
                  color: THEME.inkMuted,
                  marginBottom: 32,
                  textAlign: 'center',
                  lineHeight: 20
                }}
              >
                {currentSpecies?.care_instruction ||
                  'No special care instructions. Make sure to occasionally check the soil!'}
              </Text>

              <TouchableOpacity
                onPress={nextStep}
                style={{
                  backgroundColor: THEME.forest,
                  width: '100%',
                  paddingVertical: 18,
                  borderRadius: 30,
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontFamily: FONTS.sans, fontSize: 16, color: THEME.paper, fontWeight: '600' }}>
                  Use recommended settings
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )

      case 5:
        return (
          <Animated.View key='step4' entering={enteringAnim} exiting={exitingAnim} style={{ flex: 1, padding: 24 }}>
            <Text style={{ fontFamily: FONTS.serif, fontSize: 32, color: THEME.ink, marginBottom: 32, marginTop: 40 }}>
              Where will it be placed?
            </Text>

            {isZonesLoading ? (
              <ActivityIndicator size='large' color={THEME.forest} />
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                {(zonesList || [])
                  .filter((z) => !z.has_plant)
                  .map((zone) => {
                    const isActive = plantData.zone_id === zone.id
                    return (
                      <TouchableOpacity
                        key={zone.id}
                        onPress={() => {
                          Haptics.selectionAsync()
                          setPlantData({ ...plantData, zone_id: zone.id })
                          setTimeout(nextStep, 350)
                        }}
                        style={{
                          backgroundColor: isActive ? THEME.forest : 'rgba(255,255,255,0.8)',
                          padding: 20,
                          borderRadius: 20,
                          marginBottom: 16,
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <View
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(74, 121, 95, 0.1)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 16
                          }}
                        >
                          <MapPin size={24} color={isActive ? THEME.paper : THEME.forest} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontFamily: FONTS.sans,
                              fontSize: 18,
                              fontWeight: '700',
                              color: isActive ? THEME.paper : THEME.ink,
                              marginBottom: 4
                            }}
                          >
                            {zone.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: FONTS.sans,
                              fontSize: 14,
                              color: isActive ? 'rgba(255,255,255,0.8)' : THEME.inkMuted
                            }}
                          >
                            {zone.location_city || 'No Location'} â€¢ {zone.exposure || 'Unknown Exposure'}
                          </Text>
                        </View>
                        {isActive && <CheckCircle2 size={24} color={THEME.paper} />}
                      </TouchableOpacity>
                    )
                  })}

                {!zonesList?.length && (
                  <Text
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 16,
                      color: THEME.inkMuted,
                      textAlign: 'center',
                      marginVertical: 20
                    }}
                  >
                    No zones created yet.
                  </Text>
                )}

                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    setPlantData({ ...plantData, zone_id: null })
                    nextStep()
                  }}
                  style={{ paddingVertical: 20, alignItems: 'center', marginTop: 16 }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 16,
                      color: THEME.inkMuted,
                      textDecorationLine: 'underline'
                    }}
                  >
                    I'll set up a Zone later
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </Animated.View>
        )

      case 6:
        return (
          <Animated.View
            key='step5'
            entering={enteringAnim}
            exiting={exitingAnim}
            style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}
          >
            <View>
              <Text
                style={{ fontFamily: FONTS.serif, fontSize: 32, color: THEME.ink, marginBottom: 40, marginTop: 20 }}
              >
                Awesome!{'\n'}Let's double check
              </Text>

              <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 20, padding: 20, gap: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: THEME.inkMuted, marginBottom: 4 }}>
                      Nickname
                    </Text>
                    <Text style={{ fontFamily: FONTS.sans, fontSize: 20, fontWeight: '600', color: THEME.ink }}>
                      {plantData.nickname}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => goToStep(2)} style={{ padding: 8 }}>
                    <Edit3 size={20} color={THEME.forest} />
                  </TouchableOpacity>
                </View>

                <View style={{ height: 1, backgroundColor: 'rgba(20, 40, 29, 0.1)' }} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: THEME.inkMuted, marginBottom: 4 }}>
                      Species
                    </Text>
                    <Text style={{ fontFamily: FONTS.sans, fontSize: 18, color: THEME.ink }}>
                      {currentSpecies?.common_name}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => goToStep(1)} style={{ padding: 8 }}>
                    <Edit3 size={20} color={THEME.forest} />
                  </TouchableOpacity>
                </View>

                <View style={{ height: 1, backgroundColor: 'rgba(20, 40, 29, 0.1)' }} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: THEME.inkMuted, marginBottom: 4 }}>
                      Zone
                    </Text>
                    <Text style={{ fontFamily: FONTS.sans, fontSize: 18, color: THEME.ink }}>
                      {currentZone?.name || 'Not assigned'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => goToStep(5)} style={{ padding: 8 }}>
                    <Edit3 size={20} color={THEME.forest} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleFinish}
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? THEME.inkMuted : THEME.forest,
                paddingVertical: 20,
                borderRadius: 30,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 12,
                shadowColor: THEME.forest,
                shadowOpacity: 0.3,
                shadowRadius: 15,
                shadowOffset: { width: 0, height: 8 },
                marginBottom: 20
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator color={THEME.paper} />
              ) : (
                <>
                  <CheckCircle2 color={THEME.paper} size={24} />
                  <Text style={{ fontFamily: FONTS.sans, fontSize: 18, color: THEME.paper, fontWeight: '600' }}>
                    Confirm & Start Growing
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        )
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <LinearGradient colors={[THEME.paper, THEME.paperDeep]} style={{ flex: 1 }}>
        {renderProgressBar()}
        {renderHeader()}
        {renderStep()}
      </LinearGradient>

      <CancelConfirmModal
        visible={isConfirmModalVisible}
        title='Discard Changes?'
        message='Are you sure you want to stop adding this plant? Your progress will be lost.'
        cancelText='Keep Editing'
        confirmText='Discard'
        onCancel={() => setIsConfirmModalVisible(false)}
        onConfirm={() => {
          setIsConfirmModalVisible(false)
          router.back()
        }}
      />
    </KeyboardAvoidingView>
  )
}
