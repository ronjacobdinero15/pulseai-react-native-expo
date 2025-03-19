import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { COLORS } from '../constants/Colors'
import MyText from './MyText'
import Spinner from './Spinner'

type BpIndexTableProps = {
  bpList: {
    readingId: string
    patientId: string
    dateTaken: string
    timeTaken: string
    systolic: string
    diastolic: string
    pulseRate: string
  }[]
  isLoading: boolean
}

function BpIndexTable({ bpList, isLoading }: BpIndexTableProps) {
  if (isLoading) return <Spinner />

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <MyText style={[styles.bpInfo, { fontWeight: 'bold' }]}>Time</MyText>
        <MyText style={[styles.bpInfo, { fontWeight: 'bold' }]}>
          Sys/Dias
        </MyText>
        <MyText style={[styles.bpInfo, { fontWeight: 'bold' }]}>Pulse</MyText>
      </View>

      {bpList.length > 0 ? (
        <FlatList
          data={bpList}
          keyExtractor={item => item.readingId}
          style={styles.patientListContainer}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.patientContainer,
                { borderBottomWidth: bpList.length - 1 === index ? 0 : 1 },
              ]}
            >
              <MyText style={styles.bpInfo}>{item.timeTaken}</MyText>
              <MyText style={styles.bpInfo}>
                {item.systolic}/{item.diastolic}
              </MyText>
              <MyText style={styles.bpInfo}>{item.pulseRate}</MyText>
            </View>
          )}
        />
      ) : (
        <MyText
          size="h2"
          style={{
            padding: 30,
            color: COLORS.secondary[500],
            textAlign: 'center',
          }}
        >
          No such patient found
        </MyText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary[200],
  },
  patientListContainer: {
    flex: 1,
  },
  patientContainer: {
    flexDirection: 'row',
    gap: 10,
    borderBottomColor: COLORS.secondary[200],
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  generateBtn: {
    justifyContent: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
  },
  bpInfo: {
    flex: 1,
    textAlign: 'center',
  },
})

export default BpIndexTable
