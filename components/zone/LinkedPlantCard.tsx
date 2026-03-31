import { AddDeviceButton } from '@/components/devices/AddDeviceButton'
import { HStack } from '@/components/ui/hstack'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { THEME } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { ChevronRight, Droplets, Thermometer } from 'lucide-react-native'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

type LinkedPlantCardProps = {
  linkedPlant?: any // TODO: strongly type this
  onAddPlant: () => void
}

export function LinkedPlantCard({ linkedPlant, onAddPlant }: LinkedPlantCardProps) {
  const router = useRouter()
  const wikiInfo = linkedPlant?.species_wiki

  if (!linkedPlant) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>No plant assigned to this zone.</Text>
        <AddDeviceButton title='Add Plant to Zone' onPress={onAddPlant} />
      </View>
    )
  }

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => router.push(`/plant/${linkedPlant.id}`)}>
      <HStack style={{ gap: 16 }}>
        <Image
          source={{
            uri: linkedPlant.image_url || wikiInfo?.image_url || 'https://via.placeholder.com/150'
          }}
          style={styles.plantThumb}
        />
        <VStack style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.plantNickname}>{linkedPlant.nickname}</Text>
          <Text style={styles.plantSpecies}>{wikiInfo?.common_name}</Text>
          {!!wikiInfo && (
            <HStack style={styles.idealConditions}>
              <View style={styles.conditionPill}>
                <Thermometer size={12} color={THEME.inkLight} />
                <Text style={styles.conditionText}>
                  {wikiInfo.ideal_temp_min}-{wikiInfo.ideal_temp_max}°C
                </Text>
              </View>
              <View style={styles.conditionPill}>
                <Droplets size={12} color={THEME.inkLight} />
                <Text style={styles.conditionText}>
                  {wikiInfo.ideal_humid_min}-{wikiInfo.ideal_humid_max}%
                </Text>
              </View>
            </HStack>
          )}
        </VStack>
        <ChevronRight size={24} color={THEME.inkLight} />
      </HStack>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    shadowColor: THEME.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 3
  },
  emptyText: {
    fontSize: 15,
    color: THEME.inkLight,
    marginBottom: 20,
    textAlign: 'center'
  },
  plantThumb: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: THEME.paperDeep
  },
  plantNickname: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.ink
  },
  plantSpecies: {
    fontSize: 14,
    color: THEME.inkLight,
    fontStyle: 'italic',
    marginBottom: 8
  },
  idealConditions: {
    gap: 8
  },
  conditionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.paperDeep,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6
  },
  conditionText: {
    fontSize: 12,
    color: THEME.inkLight,
    fontWeight: '600'
  }
})
