import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Image, ScrollView, Swiper, SwiperItem, Picker, Input } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
// import { AtIcon } from 'taro-ui'
import TabBar from '../../components/TabBar/TabBar'
import Modal from '../../components/modal/modal'
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
      phone: '',
      phonePop: false,
      phoneFlg: false
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

  componentDidShow() {
    const phoneStore = Taro.getStorageSync('phone')
    if (phoneStore) {
      this.setState({ phoneFlg: true, phone: phoneStore })
    }
  }

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
  goToMy = () => {
    return
  }
  goToIndex = () => {
    Taro.redirectTo({ url: '../index/index' })
  }
  goToLikeList = () => {
    const { phoneFlg, phone } = this.state
    if (!phoneFlg) {
      this.setState({
        phonePop: true
      })
      return
    }
    Taro.navigateTo({ url: `../like/like?phone=${phone}` })
  }
  onConfirm = () => {
    const { phone } = this.state
    if (!phone) {
      Taro.showToast({ title: '请输入电话号码！' })
      return
    } else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
      Taro.showToast({ title: '手机号码有误！' })
      return
    }
    Taro.setStorageSync('phone', phone)
    Taro.showToast({ title: '手机号记录成功' })
    this.onCancel()
  }
  onCancel = () => {
    this.setState({
      phonePop: false
    })
  }
  inputPhone = (e) => {
    this.setState({
      phone: e.detail.value
    })
  }

  freeCall = () => {
    const { roomData: { contactPhone } } = this.state
    Taro.makePhoneCall({
      phoneNumber: contactPhone, fail: () => {
        Taro.showToast({ title: '呼叫失败' })
      }
    })
  }
  render() {
    const { counterStore: { counter } } = this.props
    const { phonePop } = this.state
    return (
      <View className='my' >
        <View className='my-header'>
          <Image src={require('../../assets/my-head-img.png')} className='my-header-head'></Image>
          <Text className='my-header-name'>房友</Text>
        </View>
        <View className='my-section-box'>
          <View className='my-section' onClick={this.goToLikeList}>
            <Text className='my-section-txt'>我的收藏</Text>
          </View>
          <View className='my-section' onClick={this.freeCall}>
            <Text className='my-section-txt'>联系我们</Text>
          </View>
        </View>
        <TabBar goToMy={this.goToMy} goToIndex={this.goToIndex} indexSrc={`${require('../../assets/index.png')}`} mySrc={`${require('../../assets/my-active.png')}`}></TabBar>
        <Modal
          animationType='slide'
          visible={phonePop}
        >
          <View className='phone'>
            <View className='phone-title'>请输入您的电话号码以收藏房源</View>
            <View className='phone-input'>
              <View className='phone-input-txt'>电话号码：</View><Input onInput={this.inputPhone} maxLength={11} value={phone} type='number' className='phone-input-input' placeholder='请输入您的电话号码'></Input>
            </View>
            <View className='phone-btn'>
              <View className='phone-btn-comfirm' onClick={this.onConfirm}>确定</View>
              <View className='phone-btn-cancel' onClick={this.onCancel}>取消</View>
            </View>
          </View>
        </Modal>

      </View>
    )
  }
}

export default My
