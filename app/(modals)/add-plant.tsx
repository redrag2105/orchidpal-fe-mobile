import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ActivityIndicator, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInRight, SlideOutLeft, SlideInLeft, SlideOutRight, Layout } from 'react-native-reanimated';
import { X, ChevronLeft, Search, Leaf, Droplets, Thermometer, MapPin, Edit3, CheckCircle2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { THEME, FONTS } from '@/components/dashboard/theme';

import { MOCK_PLANTS } from '@/app/(dashboard)/garden';

const { width, height } = Dimensions.get('window');

// Mock Data updated with plant_id
const SPECIES_LIST = [
  { id: 'sp_1', name: 'Monstera Deliciosa', type: 'Indoor Herb', wiki: { temp: '18-30°C', humidity: '60-80%' } },
  { id: 'sp_2', name: 'Phalaenopsis Orchid', type: 'Flowering', wiki: { temp: '20-25°C', humidity: '50-70%' } },
  { id: 'sp_3', name: 'Ficus Lyrata', type: 'Indoor Tree', wiki: { temp: '15-25°C', humidity: '40-60%' } },
  { id: 'sp_4', name: 'Zamioculcas Zamiifolia', type: 'Succulent', wiki: { temp: '18-35°C', humidity: '40-50%' } },
];

const ZONES_LIST = [
  { id: 'zone_1', name: 'Living Room', condition: 'Sunny & Warm', plant_id: null },
  { id: 'zone_2', name: 'Balcony', condition: 'Bright Indirect', plant_id: null },
  { id: 'zone_3', name: 'Bookshelf', condition: 'Low Light', plant_id: 'plant_xxx' }, // Not empty
];

type PlantData = {
  id: string;
  nickname: string;
  species_id: string;
  user_id: string;
  zone_id: string | null;
  planted_at: string;
  health_status: string;
};

const TOTAL_STEPS = 5;

export default function AddPlantStoryScreen() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  
  const [plantData, setPlantData] = useState<Partial<PlantData>>({
    id: `plant_${Date.now()}`,
    nickname: '',
    species_id: '',
    zone_id: null,
    planted_at: new Date().toISOString(),
    health_status: 'healthy',
  });
  const [savedNickname, setSavedNickname] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFetchingWiki, setIsFetchingWiki] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSpecies = SPECIES_LIST.find((s) => s.id === plantData.species_id);
  const currentZone = ZONES_LIST.find((z) => z.id === plantData.zone_id);

  // Animations based on direction
  const enteringAnim = direction === 'forward' ? SlideInRight.duration(400) : SlideInLeft.duration(400);
  const exitingAnim = direction === 'forward' ? SlideOutLeft.duration(400) : SlideOutRight.duration(400);

  const goToStep = (targetStep: number) => {
    Keyboard.dismiss();
    setDirection(targetStep > step ? 'forward' : 'backward');
    if (targetStep > step) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setTimeout(() => setStep(targetStep), 50); // slight delay to ensure direction state applies before render
  };

  const nextStep = () => {
    if (step === 2) setSavedNickname(plantData.nickname || '');
    if (step < TOTAL_STEPS) goToStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) goToStep(step - 1);
    else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.back();
    }
  };

  const handleFinish = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('New Plant Created: ', plantData);
      
      // Update global mock list so it appears in Garden screen
      MOCK_PLANTS.unshift({
        id: plantData.id!,
        nickname: plantData.nickname || 'New Friend',
        species_wiki: {
          common_name: currentSpecies?.name || 'Unknown',
          scientific_name: 'Sci ' + (currentSpecies?.name || ''),
          ideal_temp_min: parseInt((currentSpecies?.wiki.temp || '20').split('-')[0]),
          ideal_temp_max: parseInt((currentSpecies?.wiki.temp || '25').split('-')[1]),
          ideal_humid_min: parseInt((currentSpecies?.wiki.humidity || '50').split('-')[0]),
          ideal_humid_max: parseInt((currentSpecies?.wiki.humidity || '70').split('-')[1]),
          care_instruction: 'New plant care'
        },
        image_url: 'https://images.unsplash.com/photo-1599388102462-8e7c1a84fbe3?auto=format&fit=crop&q=80&w=300', // default fern icon or similar
        zone_id: plantData.zone_id || null,
        planted_at: new Date().toISOString().split('T')[0],
        health_status: 'GOOD'
      });

      setIsSubmitting(false);
      // Navigate to plant details and replace the modal
      router.replace(`/plant/${plantData.id}`);
    }, 1500);
  };

  // Trigger wiki skeleton when step 3 loads or species changes
  useEffect(() => {
    if (step === 3) {
      setIsFetchingWiki(true);
      const timer = setTimeout(() => setIsFetchingWiki(false), 500);
      return () => clearTimeout(timer);
    }
  }, [step, plantData.species_id]);

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
              backgroundColor: index < step ? THEME.forest : 'rgba(255, 255, 255, 0.4)',
            }}
          />
        ))}
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 16 }}>
        <TouchableOpacity onPress={prevStep} style={{ padding: 8 }}>
          <ChevronLeft size={28} color={THEME.ink} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.back();
        }} style={{ padding: 8 }}>
          <X size={28} color={THEME.ink} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Animated.View key="step1" entering={enteringAnim} exiting={exitingAnim} style={{ flex: 1, padding: 24 }}>
            <Text style={{ fontFamily: FONTS.serif, fontSize: 32, color: THEME.ink, marginBottom: 24 }}>
              Which green friend are you welcoming today?
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 24 }}>
              <Search size={20} color={THEME.forest} />
              <TextInput
                placeholder="Search species..."
                placeholderTextColor={THEME.inkMuted}
                style={{ flex: 1, marginLeft: 12, fontSize: 16, fontFamily: FONTS.sans, color: THEME.ink }}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} keyboardShouldPersistTaps="always" contentContainerStyle={{ paddingBottom: 24 }}>
              {SPECIES_LIST.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((species) => {
                const isActive = plantData.species_id === species.id;
                return (
                  <TouchableOpacity
                    key={species.id}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setPlantData({ ...plantData, species_id: species.id });
                      if (!isActive) {
                        setTimeout(() => nextStep(), 250);
                      }
                    }}
                    style={{
                      backgroundColor: isActive ? THEME.forestLight : 'rgba(255,255,255,0.4)',
                      padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1,
                      borderColor: isActive ? THEME.forest : 'rgba(255,255,255,0.3)'
                    }}
                  >
                    <Text style={{ fontFamily: FONTS.serif, fontSize: 18, color: isActive ? THEME.paper : THEME.ink }}>
                      {species.name}
                    </Text>
                    <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: isActive ? 'rgba(255,255,255,0.8)' : THEME.inkMuted, marginTop: 4 }}>
                      {species.type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {plantData.species_id && (
              <Animated.View entering={FadeIn} style={{ marginTop: 12, paddingBottom: 8 }}>
                <TouchableOpacity onPress={nextStep} style={{ backgroundColor: THEME.forest, paddingVertical: 18, borderRadius: 30, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}>
                  <Text style={{ fontFamily: FONTS.sans, fontSize: 16, color: THEME.paper, fontWeight: '600' }}>
                    Continue with {currentSpecies?.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        );

      case 2:
        const hasValidName = !!plantData.nickname;
        const isUnchanged = hasValidName && plantData.nickname === savedNickname && savedNickname !== '';
        
        return (
          <Animated.View key="step2" entering={enteringAnim} exiting={exitingAnim} style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
            <Text style={{ fontFamily: FONTS.serif, fontSize: 32, color: THEME.ink, marginBottom: 40, textAlign: 'center' }}>
              What's the name of{'\n'}your new friend?
            </Text>
            
            <TextInput
              placeholder="Enter name..."
              placeholderTextColor="rgba(20, 40, 29, 0.3)"
              style={{ fontSize: 30, fontFamily: FONTS.serif, color: THEME.ink, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: THEME.inkMuted, paddingBottom: 16, marginBottom: 40 }}
              value={plantData.nickname}
              onChangeText={(text) => setPlantData({ ...plantData, nickname: text })}
              autoFocus
            />

            <TouchableOpacity
              onPress={nextStep}
              disabled={!hasValidName}
              style={{
                backgroundColor: hasValidName ? THEME.forest : 'rgba(255,255,255,0.3)',
                paddingVertical: 18, borderRadius: 30, alignItems: 'center'
              }}
            >
              <Text style={{ fontFamily: FONTS.sans, fontSize: 18, color: hasValidName ? THEME.paper : THEME.inkMuted, fontWeight: '600' }}>
                {isUnchanged ? 'Keep this name' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View key="step3" entering={enteringAnim} exiting={exitingAnim} style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 24, padding: 32, alignItems: 'center' }}>
              <Leaf size={48} color={THEME.forest} style={{ marginBottom: 24 }} />
              <Text style={{ fontFamily: FONTS.serif, fontSize: 24, color: THEME.ink, marginBottom: 8, textAlign: 'center' }}>
                {plantData.nickname || 'New Friend'}
              </Text>
              <Text style={{ fontFamily: FONTS.sans, fontSize: 16, color: THEME.inkMuted, marginBottom: 32, textAlign: 'center' }}>
                {currentSpecies?.name}
              </Text>

              <View style={{ flexDirection: 'row', gap: 24, marginBottom: 32, minHeight: 60 }}>
                {isFetchingWiki ? (
                  <ActivityIndicator size="small" color={THEME.forest} style={{ marginHorizontal: 40 }} />
                ) : (
                  <>
                    <View style={{ alignItems: 'center' }}>
                      <Thermometer size={24} color={THEME.orchidMain} style={{ marginBottom: 8 }} />
                      <Text style={{ fontFamily: FONTS.sans, fontSize: 16, color: THEME.ink, fontWeight: '600' }}>
                        {currentSpecies?.wiki.temp}
                      </Text>
                      <Text style={{ fontFamily: FONTS.sans, fontSize: 12, color: THEME.inkMuted }}>Temperature</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Droplets size={24} color={'#4ba3e3'} style={{ marginBottom: 8 }} />
                      <Text style={{ fontFamily: FONTS.sans, fontSize: 16, color: THEME.ink, fontWeight: '600' }}>
                        {currentSpecies?.wiki.humidity}
                      </Text>
                      <Text style={{ fontFamily: FONTS.sans, fontSize: 12, color: THEME.inkMuted }}>Humidity</Text>
                    </View>
                  </>
                )}
              </View>

              <TouchableOpacity
                onPress={nextStep}
                disabled={isFetchingWiki}
                style={{ backgroundColor: isFetchingWiki ? THEME.inkMuted : THEME.forest, width: '100%', paddingVertical: 18, borderRadius: 30, alignItems: 'center' }}
              >
                <Text style={{ fontFamily: FONTS.sans, fontSize: 16, color: THEME.paper, fontWeight: '600' }}>
                  Use recommended settings
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );

      case 4:
        const availableZones = ZONES_LIST.filter(z => z.plant_id === null);
        return (
          <Animated.View key="step4" entering={enteringAnim} exiting={exitingAnim} style={{ flex: 1, padding: 24 }}>
            <Text style={{ fontFamily: FONTS.serif, fontSize: 32, color: THEME.ink, marginBottom: 32, marginTop: 40 }}>
              Where will it be placed?
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
              {availableZones.map((zone) => (
                <TouchableOpacity
                  key={zone.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setPlantData({ ...plantData, zone_id: zone.id });
                    setTimeout(nextStep, 300);
                  }}
                  style={{
                    backgroundColor: plantData.zone_id === zone.id ? THEME.forest : 'rgba(255,255,255,0.6)',
                    padding: 24, borderRadius: 20, marginBottom: 16
                  }}
                >
                  <Text style={{ fontFamily: FONTS.serif, fontSize: 20, color: plantData.zone_id === zone.id ? THEME.paper : THEME.ink, marginBottom: 4 }}>
                    {zone.name}
                  </Text>
                  <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: plantData.zone_id === zone.id ? 'rgba(255,255,255,0.8)' : THEME.inkMuted }}>
                    {zone.condition}
                  </Text>
                </TouchableOpacity>
              ))}

              {availableZones.length === 0 && (
                <Text style={{ fontFamily: FONTS.sans, fontSize: 16, color: THEME.inkMuted, textAlign: 'center', marginVertical: 20 }}>
                  No available zones.
                </Text>
              )}

              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPlantData({ ...plantData, zone_id: null });
                  nextStep();
                }}
                style={{ paddingVertical: 20, alignItems: 'center', marginTop: 16 }}
              >
                <Text style={{ fontFamily: FONTS.sans, fontSize: 16, color: THEME.inkMuted, textDecorationLine: 'underline' }}>
                  I'll set up a Zone later
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View key="step5" entering={enteringAnim} exiting={exitingAnim} style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontFamily: FONTS.serif, fontSize: 32, color: THEME.ink, marginBottom: 40, marginTop: 20 }}>
                Awesome!{'\n'}Let's double check
              </Text>

              <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 20, padding: 20, gap: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: THEME.inkMuted, marginBottom: 4 }}>Nickname</Text>
                    <Text style={{ fontFamily: FONTS.serif, fontSize: 22, color: THEME.ink }}>{plantData.nickname}</Text>
                  </View>
                  <TouchableOpacity onPress={() => goToStep(2)} style={{ padding: 8 }}>
                    <Edit3 size={20} color={THEME.forest} />
                  </TouchableOpacity>
                </View>

                <View style={{ height: 1, backgroundColor: 'rgba(20, 40, 29, 0.1)' }} />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: THEME.inkMuted, marginBottom: 4 }}>Species</Text>
                    <Text style={{ fontFamily: FONTS.serif, fontSize: 20, color: THEME.ink }}>{currentSpecies?.name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => goToStep(1)} style={{ padding: 8 }}>
                    <Edit3 size={20} color={THEME.forest} />
                  </TouchableOpacity>
                </View>

                <View style={{ height: 1, backgroundColor: 'rgba(20, 40, 29, 0.1)' }} />
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontFamily: FONTS.sans, fontSize: 14, color: THEME.inkMuted, marginBottom: 4 }}>Zone</Text>
                    <Text style={{ fontFamily: FONTS.serif, fontSize: 20, color: THEME.ink }}>
                      {currentZone?.name || 'Not assigned'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => goToStep(4)} style={{ padding: 8 }}>
                    <Edit3 size={20} color={THEME.forest} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleFinish}
              disabled={isSubmitting}
              style={{
                backgroundColor: THEME.forest, width: '100%', paddingVertical: 18, borderRadius: 30,
                flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 20
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator color={THEME.paper} />
              ) : (
                <>
                  <CheckCircle2 size={24} color={THEME.paper} />
                  <Text style={{ fontFamily: FONTS.sans, fontSize: 18, color: THEME.paper, fontWeight: '600' }}>
                    Confirm
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <LinearGradient
        colors={[THEME.paper, THEME.forestLight, THEME.paperDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, position: 'absolute', width, height, opacity: 0.8 }}
      />
      <View style={{ flex: 1 }}>
        {renderProgressBar()}
        {renderHeader()}
        <View style={{ flex: 1, overflow: 'hidden' }}>
          {renderStep()}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}