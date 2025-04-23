import React, { useState } from 'react'
import { StyleSheet, Linking } from 'react-native'
import MyModal from './MyModal'
import MyText from './MyText'
import MyTouchableOpacity from './MyTouchableOpacity'
import { COLORS } from '../constants/Colors'
import { getPatientProfile, updateSurveyAnswered } from '../services/apiAuth'

function SurveyModal({
  visible,
  onClose,
  patientId,
}: {
  visible: boolean
  onClose: () => void
  patientId: string
}) {
  const [hasClickedSurvey, setHasClickedSurvey] = useState(false)

  const handleOpenSurvey = async () => {
    const surveyUrl =
      'https://docs.google.com/forms/d/e/1FAIpQLSdNjmDYiPGlim-KuzxSzm7zyFLrSn4kGZBxl8a0Z8vd_cUYJA/viewform?usp=sharing'
    Linking.openURL(surveyUrl)
    setHasClickedSurvey(true)
    await updateSurveyAnswered(patientId)
  }

  return (
    <MyModal visible={visible} title="Survey Request" onRequestClose={onClose}>
      {hasClickedSurvey ? (
        <MyText size="h4" style={{ textAlign: 'center', marginBottom: 16 }}>
          Thank you for taking the time to fill out our survey! Your feedback is
          greatly appreciated.
        </MyText>
      ) : (
        <>
          <MyText size="h4" style={{ textAlign: 'center', marginBottom: 16 }}>
            We kindly ask you to fill out a Google Form survey for our research
            study:
            <MyText size="h4" style={{ fontWeight: 'bold' }}>
              {' '}
              Development of a Mobile-Based System for Hypertension Risk
              Assessment.
            </MyText>
          </MyText>

          <MyTouchableOpacity
            style={[styles.modalBtn, { backgroundColor: COLORS.primary[500] }]}
            onPress={handleOpenSurvey}
          >
            <MyText size="h4" style={{ color: 'white' }}>
              Open Survey
            </MyText>
          </MyTouchableOpacity>
        </>
      )}

      <MyTouchableOpacity style={styles.modalBtn} onPress={onClose}>
        <MyText size="h4" style={{ color: COLORS.primary[500] }}>
          Close
        </MyText>
      </MyTouchableOpacity>
    </MyModal>
  )
}

const styles = StyleSheet.create({
  modalBtn: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
})

export default SurveyModal
