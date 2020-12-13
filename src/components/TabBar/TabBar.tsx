import Taro, { Component } from '@tarojs/taro'

import './TabBar.less'
import { View, Image } from '@tarojs/components'

class TabBar extends Component {
  static defaultProps = {
    current: 0,
    background: '#fff',
    color: '#999',
    tintColor: '#6190e8',
    fixed: false,
    onClick: () => { },
    tabList: []
  }
  constructor(props) {
    super(props)
  }
  render() {
    return (<View className='bar'>
      {/* <View className='bar-index'>
        <Image className='bar-index'></Image>
      </View>
      <View className='bar-my'>
        <Image className='bar-my' src={}></Image>
      </View> */}
    </View>)
  }
}
export default TabBar
