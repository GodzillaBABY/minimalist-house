import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './TabBar.less'

class TabBar extends Component {
  static defaultProps = {
    indexSrc: '',
    mySrc: '',
    goToIndex: () => { },
    goToMy: () => { }
  }
  constructor(props) {
    super(props)
    this.state = {
      updateCurrent: props.current
    }
  }

  render() {
    const { indexSrc, mySrc, goToIndex, goToMy } = this.props
    // const { updateCurrent } = this.state
    return (<View className='bar'>
      <View className='bar-btn'>
        <View className='bar-index' onClick={goToIndex}>
          <Image className='bar-index-img' src={indexSrc}></Image>
        </View>
        <View className='line'>.</View>
        <View className='bar-index' onClick={goToMy}>
          <Image className='bar-my-img' src={mySrc}></Image>
        </View>
      </View>
    </View>)
  }
}
export default TabBar
