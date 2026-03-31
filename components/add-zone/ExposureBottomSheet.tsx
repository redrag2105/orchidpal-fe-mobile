import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText
} from '@/components/ui/actionsheet'
import { THEME } from '@/constants/theme'
import React from 'react'
import { Text, View } from 'react-native'
import { EXPOSURE_OPTIONS, type ExposureType } from '@/types/add-zone.types'

interface ExposureBottomSheetProps {
  showExposure: boolean
  setShowExposure: (show: boolean) => void
  exposure: ExposureType
  setExposure: (val: ExposureType) => void
}

export function ExposureBottomSheet({
  showExposure,
  setShowExposure,
  exposure,
  setExposure
}: ExposureBottomSheetProps) {
  return (
    <Actionsheet isOpen={showExposure} onClose={() => setShowExposure(false)}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <View className='w-full px-5 py-2.5'>
          {EXPOSURE_OPTIONS.map((opt) => (
            <ActionsheetItem
              key={opt.value}
              onPress={() => {
                setExposure(opt.value)
                setShowExposure(false)
              }}
              style={[
                { paddingVertical: 12, borderRadius: 8, marginBottom: 8 },
                exposure === opt.value && { backgroundColor: 'rgba(74, 121, 95, 0.1)' }
              ]}
            >
              <View className='flex-1'>
                <ActionsheetItemText
                  style={[
                    { fontSize: 16, fontWeight: '500', color: THEME.ink },
                    exposure === opt.value && { color: THEME.forest, fontWeight: '700' }
                  ]}
                >
                  {opt.label}
                </ActionsheetItemText>
                <Text style={{ fontSize: 13, color: THEME.inkLight, marginTop: 4 }}>{opt.description}</Text>
              </View>
            </ActionsheetItem>
          ))}
        </View>
      </ActionsheetContent>
    </Actionsheet>
  )
}
