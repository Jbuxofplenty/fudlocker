import React from 'react'
import { Icon } from 'react-native-elements'
import { Colors } from '../../constants'

const ChevronLeft = () => (
  <Icon
    name="chevron-left"
    type="entypo"
    color={Colors.lightGray2}
    containerStyle={{ marginLeft: -15, width: 20 }}
  />
)

export default ChevronLeft
