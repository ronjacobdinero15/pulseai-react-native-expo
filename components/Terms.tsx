import MyText from '@/components/MyText'
import { COLORS } from '@/constants/colors'
import { StyleSheet, View } from 'react-native'

function Terms() {
  return (
    <View style={styles.container}>
      <MyText>
        Terms and Conditions for{' '}
        <MyText style={{ fontWeight: 'bold' }}>
          Development of a Mobile-Based System for Hypertension Risk Assessment.
        </MyText>
      </MyText>

      <MyText>Last Updated: February 27, 2025</MyText>

      <View>
        <MyText style={styles.title}>1. Acceptance of Terms</MyText>
        <MyText style={styles.paragraph}>
          By accessing or using the mobile-based system for hypertension risk
          assessment (PulseAI), you agree to comply with and be bound by these
          Terms and Conditions. If you do not agree, please refrain from using
          this application.
        </MyText>
      </View>

      <View>
        <MyText style={styles.title}>2. Description of Service</MyText>
        <MyText style={styles.paragraph}>
          This mobile application, titled{' '}
          <MyText style={styles.title}>
            Development of a Mobile-Based System for Hypertension Risk
            Assessment
          </MyText>
          , is a research-driven academic prototype designed to analyze
          user-provided health metrics{' '}
          <MyText style={styles.italic}>
            (i.e., daily blood pressure reading, age, gender, vices, height,
            weight, comorbidities, parental history of hypertension, lifestyle)
          </MyText>{' '}
          to generate a preliminary hypertension risk evaluation. By identifying
          patterns in the inputted data, PulseAI serves as an analytical tool to
          support medical practitioners in understanding potential risk
          indicators and trends.
        </MyText>
      </View>

      <View>
        <MyText style={styles.title}>3. User Eligibility</MyText>
        <View style={styles.paragraph}>
          <MyText>
            &bull;You must be at least 18 years old or the age of majority in
            your jurisdiction.
          </MyText>
          <MyText>
            &bull;Do not use PulseAI during a medical emergency. Seek immediate
            professional care.
          </MyText>
        </View>
      </View>

      <View>
        <MyText style={styles.title}>4. User Responsibilities</MyText>
        <View style={styles.paragraph}>
          <MyText>&bull;Provide accurate and complete information.</MyText>
          <MyText>
            &bull;Do not misuse this application for unauthorized purposes.
          </MyText>
          <MyText>
            &bull;You are solely responsible for decisions made based on the
            system’s output.
          </MyText>
        </View>
      </View>

      <View>
        <MyText style={styles.title}>5. Privacy and Data Use</MyText>
        <View style={styles.paragraph}>
          <View>
            <MyText>&bull;Data Collected: </MyText>
            <MyText style={{ paddingLeft: 40 }}>
              &#9702; Personal health information{' '}
              <MyText style={styles.italic}>
                (i.e., daily blood pressure reading, age, gender, vices, height,
                weight, comorbidities, parental history of hypertension,
                lifestyle)
              </MyText>{' '}
              is collected.
            </MyText>
          </View>
          <View>
            <MyText>&bull;Anonymization: </MyText>
            <MyText style={{ paddingLeft: 40 }}>
              &#9702; Data is anonymized and aggregated for academic research.
            </MyText>
          </View>
          <View>
            <MyText>&bull;Consent: </MyText>
            <MyText style={{ paddingLeft: 40 }}>
              &#9702; By using this application, you consent to the use of your
              data for research and thesis development.
            </MyText>
          </View>
        </View>
      </View>

      <View>
        <MyText style={styles.title}>6. Intellectual Property</MyText>
        <View style={styles.paragraph}>
          <MyText>
            &bull;All content, code, logos, and design are owned by the
            developers or the affiliated academic institution.
          </MyText>
          <MyText>
            &bull;Users may not copy, modify, or distribute this mobile
            application without written permission.
          </MyText>
        </View>
      </View>

      <View>
        <MyText style={styles.title}>7. Disclaimers</MyText>
        <View style={styles.paragraph}>
          <View>
            <MyText>&bull;Academic Use Only: </MyText>
            <MyText style={{ paddingLeft: 40 }}>
              &#9702; This application is a prototype for thesis research.
              Results are not medically validated.
            </MyText>
          </View>
          <View>
            <MyText>&bull;No Medical Advice: </MyText>
            <MyText style={{ paddingLeft: 40 }}>
              &#9702; This application does not diagnose, treat, or prevent
              hypertension. Consult a healthcare professional for medical
              decisions.
            </MyText>
          </View>
          <View>
            <MyText>&bull;"As Is" Basis: </MyText>
            <MyText style={{ paddingLeft: 40 }}>
              &#9702; This application is provided without warranties of
              accuracy, reliability, or fitness for any purpose.
            </MyText>
          </View>
        </View>
      </View>

      <View>
        <MyText style={styles.title}>8. Limitation of Liability</MyText>
        <View style={styles.paragraph}>
          <MyText>
            &bull;The developers and affiliated institution are not liable for:
          </MyText>
          <MyText style={{ paddingLeft: 40 }}>
            &#9702; Incorrect risk assessments or reliance on the system's
            outputs.
          </MyText>
          <MyText style={{ paddingLeft: 40 }}>
            &#9702; Indirect, incidental, or consequential damages arising from
            use.
          </MyText>
        </View>
      </View>

      <View>
        <MyText style={styles.title}>9. Termination</MyText>
        <View style={styles.paragraph}>
          <MyText>
            &bull;Access may be terminated if users violate these terms or for
            academic project closure. Data may be retained for research but will
            remain anonymized.
          </MyText>
        </View>
      </View>

      <View>
        <MyText style={styles.title}>10. Changes to Terms</MyText>
        <View style={styles.paragraph}>
          <MyText>
            &bull;Terms may be updated periodically. Continued use after changes
            constitutes acceptance.
          </MyText>
        </View>
      </View>

      <View>
        <MyText style={styles.title}>11. Contact Information</MyText>
        <View style={styles.paragraph}>
          <MyText>For questions, contact our developer at this email:</MyText>
          <MyText>&bull;ronjacobdinero15@gmail.com</MyText>
        </View>
      </View>

      <View>
        <MyText style={styles.title}>12. Entire Agreement</MyText>
        <View style={styles.paragraph}>
          <MyText>
            These terms constitute the entire agreement between you and the
            developers regarding the use of this application.
          </MyText>
        </View>
      </View>

      <View style={styles.divider} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  paragraph: {
    paddingLeft: 20,
  },
  bulleted: {},
  divider: {
    height: 2,
    backgroundColor: COLORS.secondary[200],
    borderRadius: 50,
  },
  italic: {
    fontStyle: 'italic',
  },
})

export default Terms
