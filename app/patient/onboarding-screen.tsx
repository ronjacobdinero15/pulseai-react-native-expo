import ButtonLabel from '@/components/ButtonLabel'
import MyText from '@/components/MyText'
import { COLORS } from '@/constants/colors'
import { SLIDES } from '@/constants/onboarding-slides'
import { DIMENSIONS } from '@/constants/sizes'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'

export default function OnboardingScreen() {
  const router = useRouter()

  return (
    <AppIntroSlider
      data={SLIDES}
      renderItem={({ item }) => {
        return (
          <View style={styles.container}>
            <Image
              source={item.image}
              style={styles.img}
              resizeMode="contain"
            />

            <MyText size="h1" style={styles.title}>
              {item.title}
            </MyText>

            <MyText style={styles.description}>{item.description}</MyText>
          </View>
        )
      }}
      activeDotStyle={{
        backgroundColor: COLORS.primary[500],
        width: 30,
      }}
      showSkipButton
      renderNextButton={() => ButtonLabel('Next')}
      renderSkipButton={() => ButtonLabel('Skip')}
      renderDoneButton={() => ButtonLabel('Done')}
      onDone={() => {
        router.replace('/patient/(tabs)')
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  img: {
    width: DIMENSIONS.width - 80,
    height: 350,
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary[500],
  },
  description: {
    textAlign: 'center',
    paddingTop: 5,
  },
})
