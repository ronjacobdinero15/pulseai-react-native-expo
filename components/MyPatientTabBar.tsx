import { COLORS } from '../constants/Colors'
import { AntDesign, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type MyTabBarProps = BottomTabBarProps

function MyPatientTabBar({ state, descriptors, navigation }: MyTabBarProps) {
  type IconProps = {
    color: string
  }

  const icons: { [key: string]: (props: IconProps) => JSX.Element } = {
    index: props => <AntDesign name="pluscircleo" size={26} {...props} />,
    medication: props => (
      <MaterialCommunityIcons name="pill" size={26} {...props} />
    ),
    history: props => <Fontisto name="history" size={26} {...props} />,
    profile: props => <AntDesign name="user" size={26} {...props} />,
  }

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: any) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        if (['_sitemap', '+not-found'].includes(route.name)) return null

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabBarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {icons[route.name]({
              color: isFocused ? COLORS.primary[500] : COLORS.secondary[500],
            })}
            <Text
              style={{
                color: isFocused ? COLORS.primary[500] : COLORS.secondary[500],
                fontSize: 12,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: 'continuous',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
})

export default MyPatientTabBar
