import { THEME } from '@/constants/theme'
import { ChevronRight, Flower2 } from 'lucide-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native'
import type { PlantSpecies } from '../../../types/device.types'
import { styles } from './styles'

interface StepSelectPlantProps {
  species: PlantSpecies[]
  onSelect: (species: PlantSpecies, nickname?: string) => void
  onSkip: () => void
  isLoading: boolean
}

export function StepSelectPlant({ species, onSelect, onSkip, isLoading }: StepSelectPlantProps) {
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpecies | null>(null)
  const [nickname, setNickname] = useState('')
  const [showNicknameInput, setShowNicknameInput] = useState(false)

  const handleSpeciesSelect = (s: PlantSpecies) => {
    setSelectedSpecies(s)
    setShowNicknameInput(true)
  }

  const handleConfirm = () => {
    if (selectedSpecies) {
      onSelect(selectedSpecies, nickname.trim() || undefined)
    }
  }

  const handleBack = () => {
    setShowNicknameInput(false)
    setSelectedSpecies(null)
    setNickname('')
  }

  // Show nickname input after species selection
  if (showNicknameInput && selectedSpecies) {
    return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Flower2 size={48} color={THEME.forest} strokeWidth={1.5} />
        </View>

        <Text style={styles.stepTitle}>Name your plant</Text>
        <Text style={styles.stepDescription}>Give your {selectedSpecies.common_name} a nickname (optional)</Text>

        {/* Selected species preview */}
        <View style={styles.selectedSpeciesPreview}>
          <View style={styles.speciesIconSmall}>
            <Flower2 size={20} color={THEME.orchidMain} />
          </View>
          <View style={styles.selectedSpeciesInfo}>
            <Text style={styles.selectedSpeciesName}>{selectedSpecies.common_name}</Text>
            <Text style={styles.selectedSpeciesScientific}>{selectedSpecies.scientific_name}</Text>
          </View>
        </View>

        <TextInput
          style={[styles.input, styles.nicknameInput]}
          placeholder='e.g., Luna'
          placeholderTextColor={THEME.inkMuted}
          value={nickname}
          onChangeText={setNickname}
          autoFocus
          returnKeyType='done'
        />

        <TouchableOpacity
          style={[styles.primaryButton, styles.nicknameSubmitButton, isLoading && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color='white' size='small' />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Add Plant</Text>
              <ChevronRight size={18} color='white' />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={handleBack}>
          <Text style={styles.linkButtonText}>Choose different species</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Flower2 size={48} color={THEME.forest} strokeWidth={1.5} />
      </View>

      <Text style={styles.stepTitle}>Choose a plant</Text>
      <Text style={styles.stepDescription}>Select the plant species you're monitoring with this device</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={THEME.orchidMain} size='large' />
          <Text style={styles.loadingText}>Loading species...</Text>
        </View>
      ) : !species || species.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Flower2 size={32} color={THEME.inkLight} />
          <Text style={styles.emptyText}>No species available</Text>
        </View>
      ) : (
        <View style={styles.speciesGrid}>
          {species.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.speciesCard}
              onPress={() => handleSpeciesSelect(s)}
              activeOpacity={0.7}
            >
              <View style={styles.speciesIconContainer}>
                <Flower2 size={24} color={THEME.orchidMain} />
              </View>
              <Text style={styles.speciesName} numberOfLines={1}>
                {s.common_name}
              </Text>
              <Text style={styles.speciesScientific} numberOfLines={1}>
                {s.scientific_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.linkButton} onPress={onSkip}>
        <Text style={styles.linkButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  )
}
