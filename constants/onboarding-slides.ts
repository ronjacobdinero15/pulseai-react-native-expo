type Slide = {
  id: number
  title: string
  description: string
  image: {
    uri: string
  }
}

export const slides: Slide[] = [
  {
    id: 1,
    title: 'Monitor Your Blood Pressure',
    description:
      'Track your blood pressure daily by selecting from the three options: Normal BP, Borderline BP, and Hypertension. Ensure you have a device that correctly monitors blood pressure at home or at the clinic every day',
    image: require('@/assets/images/bp-monitoring.png'),
  },
  {
    id: 2,
    title: 'Generate Detailed Reports',
    description:
      'Generate comprehensive reports based on your daily logs. These reports help your doctor analyze your condition and the effectiveness of prescribed medications. AI insights are provided to assist but not replace professional medical advice',
    image: require('@/assets/images/generated-report.png'),
  },
  {
    id: 3,
    title: 'Consult with Specialists',
    description:
      'Share your reports with hypertension specialists at EAC Medical Center Cavite. They can review and provide better insights into your health condition',
    image: require('@/assets/images/doctors.jpg'),
  },
]
