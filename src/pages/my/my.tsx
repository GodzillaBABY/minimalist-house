import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Image, ScrollView, Swiper, SwiperItem, Picker } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
// import { AtIcon } from 'taro-ui'
import { getRoomList } from '../../api/room'
import './my.less'

type PageStateProps = {
  counterStore: {
    counter: number,
    increment: Function,
    decrement: Function,
    incrementAsync: Function
  }
}

interface My {
  props: PageStateProps;
  state: any
}
// interface Istate{
//   headerLabel:any
// }
// const bgImg = '/assets/icon_exchange_gift_card.png'
@inject('counterStore')
@observer
class My extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    disableScroll: process.env.TARO_ENV === 'weapp',
    // @ts-ignore
    allowsBounceVertical: 'NO',
    // navigationStyle: 'custom',
    // @ts-ignore
    // transparentTitle: 'auto',
    titlePenetrate: 'YES',
    navigationBarTitleText: '门店详情',
  }

  componentWillMount() {
    // this.getPaddingTop()
  }

  componentWillReact() {
    console.log('componentWillReact')
  }

  componentDidMount() {
    // this.getRoomList(this.state.roomListParmas)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  increment = () => {
    const { counterStore } = this.props
    counterStore.increment()
  }

  decrement = () => {
    const { counterStore } = this.props
    counterStore.decrement()
  }

  incrementAsync = () => {
    const { counterStore } = this.props
    counterStore.incrementAsync()
  }

  getPhoneNum = () => {

  }
  isIphoneX = () => {
    if (process.env.TARO_ENV === 'h5') {
      return false // window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && testUA('iPhone')
    }
    const { model } = Taro.getSystemInfoSync()
    return model.search('iPhone X') !== -1
  }

  render() {
    const { counterStore: { counter } } = this.props
    const { } = this.state
    return (
      <View className='my' >
        <View className='my-header'>
          <Image src={require('../../assets/my-head-img.png')} className='my-header-head'></Image>
          <Text className='my-header-name'>房友</Text>
        </View>
        <View className='my-section-box'>
          <View className='my-section'>
            <Text className='my-section-txt'>我的收藏</Text>
          </View>
          <View className='my-section'>
            <Text className='my-section-txt'>联系我们</Text>
          </View>
        </View>

      </View>
    )
  }
}

export default My
