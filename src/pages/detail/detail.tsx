import Taro, { Component, Config, navigateTo } from '@tarojs/taro'
import { View, Button, Text, Image, ScrollView, Swiper, SwiperItem, Map, Input } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
// import { AtIcon } from 'taro-ui'
import { getRoomDetail, like, cancelLike, postUser } from '../../api/room'
import Modal from '../../components/modal/modal'
import './detail.less'

type PageStateProps = {
  counterStore: {
    counter: number,
    increment: Function,
    decrement: Function,
    incrementAsync: Function
  }
}

interface Detail {
  props: PageStateProps;
  state: any
}
// 冰箱，洗衣机，独立淋浴间，榻榻米，沙发，台灯，全身镜，衣柜，多功能柜，茶几，音响，自助快递柜，公共办公空间
// 电视改为投影
const labelMap =
{
  '冰箱': `${require('../../assets/bingxiang.jpg')}`,
  '独立淋浴间': `${require('../../assets/shower.png')}`,
  '榻榻米': `${require('../../assets/tatami.png')}`,
  '沙发': `${require('../../assets/sofa.png')}`,
  '台灯': `${require('../../assets/taideng.png')}`,
  '全身镜': `${require('../../assets/mirror.png')}`,
  '衣柜': `${require('../../assets/yigui.png')}`,
  '多功能柜': `${require('../../assets/guizi.png')}`,
  '茶几': `${require('../../assets/chaji.png')}`,
  '音响': `${require('../../assets/yinxiang.png')}`,
  '自助快递柜': `${require('../../assets/kuaidi.png')}`,
  '公共办公空间': `${require('../../assets/bangong.png')}`,
  '投影': `${require('../../assets/touying.png')}`,
  '洗衣机': `${require('../../assets/xiyiji.png')}`,
  '空调': `${require('../../assets/kongtiao.png')}`,
  '橱柜': `${require('../../assets/chugui.png')}`,
  'wifi': `${require('../../assets/wifi.png')}`,
  '电子锁': `${require('../../assets/dianzi.png')}`,
}

@inject('counterStore')
@observer
class Detail extends Component {
  onTap: any
  constructor(props) {
    super(props)
    this.state = {
      roomData: {
        address: '广东省深圳市福田区东园路150号广东省深圳市福田区东园路150号',
        contactPhone: '15818512126',
        contactWechat: 'Bosstan',
        districts: '流沙东接到',
        farAway: '600',
        id: 8,
        latitude: 39.990633,
        longitude: 116.483038,
        matchingTag: '冰箱,洗衣机',
        name: '勺找房-福田上步南店',
        nearby: '距离1号线300米；小区离沃尔玛步行400米；',
        price: 4900,
        roomImages: [
          'https://tgi1.jia.com/123/203/23203900.jpg',
          'https://tgi1.jia.com/123/203/23203900.jpg',
        ],
        "roomTag": "string",
        vrUrl: ''
      },
      markers: [{
        longitude: 116.483038,
        latitude: 39.990633
      }],
      roomListParmas: { districts: 'all', location: '116.483038,39.990633', page: 1, type: 1, per_page: 999 },
      likeFlg: false,
      phone: '',
      phonePop: false,
      phoneFlg: false,
      phoneType: 0,//1:点击like；2:点击拨打电话
      user: ''
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
    defaultTitle: ''
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
    this.init()
  }

  componentDidHide() { }
  onShareAppMessage(res) {
    const { roomData } = this.state
    if (res.from === 'button') {
      const shareParams = {
        title: roomData.name,
        imageUrl: roomData.roomImages[0],
        path: `/pages/detail/detail?id=${roomData.id}`
      }
      // 来自页面内转发按钮

      return shareParams
    }
  }
  init = () => {
    const { id } = this.$router.params
    const phoneStore = Taro.getStorageSync('phone')
    const userStore = Taro.getStorageSync('user')
    let phone
    if (phoneStore) {
      this.setState({ phoneFlg: true, user: userStore, phone: Number(phoneStore) })
      phone = phoneStore
    } else {
      phone = null
    }
    this.getRoomInfo(Number(id), phone)
  }



  decrement = () => {
    const { counterStore } = this.props
    counterStore.decrement()
  }

  incrementAsync = () => {
    const { counterStore } = this.props
    counterStore.incrementAsync()
  }
  getRoomInfo = async (id = 1, phone = null) => {
    try {
      const parmas = { id: id, phone: phone }
      const roomDetailRes = await getRoomDetail(parmas)
      const { data, code } = roomDetailRes
      if (code === 0 && data) {
        const { longitude, latitude } = data
        const markers = [{ longitude: Number(longitude), latitude: Number(latitude) }]
        this.setState({
          roomData: data,
          markers: markers,
          likeFlg: data.likeFlg
        })
      } else {
        Taro.showToast({ title: '网络错误' })
      }
    } catch (e) {
      console.log(e)
      Taro.showToast({ title: '网络错误' })
    }
  }
  clkLike = async (id) => {
    try {
      const { likeFlg, phoneFlg, phone } = this.state
      if (!phoneFlg) {
        this.setState({
          phonePop: true,
          phoneType: 1
        })
        return
      }
      const parmas = { roomId: id, phone: phone }
      if (likeFlg) {
        const likeRes = await cancelLike(parmas)
        const { data, code } = likeRes
        if (code === 0 && data) {
          this.setState({
            likeFlg: false
          }, () => {
            Taro.showToast({ title: '取消收藏成功' })
          })
        } else {
          Taro.showToast({ title: '取消失败' })
        }
      } else {
        const likeRes = await like(parmas)
        const { data, code } = likeRes
        if (code === 0 && data) {
          this.setState({
            likeFlg: true
          }, () => {
            Taro.showToast({ title: '收藏成功' })
          })
        } else {
          Taro.showToast({ title: '收藏失败' })
        }
      }

    } catch (e) {
      console.log(e)
      Taro.showToast({ title: '收藏失败' })
    }
  }
  isIphoneX = () => {
    if (process.env.TARO_ENV === 'h5') {
      return false // window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && testUA('iPhone')
    }
    const { model } = Taro.getSystemInfoSync()
    return model.search('iPhone X') !== -1
  }
  dealLabel = (label) => {
    const labelRes = label.split(',')
    return labelRes
  }
  getLocation = () => {
    const { roomData: { latitude, longitude, address } } = this.state
    Taro.getLocation({
      type: 'wgs84',
      success: (res) => {
        Taro.openLocation({//​使用微信内置地图查看位置。
          latitude: Number(latitude) ? Number(latitude) : 31.0938140000,//要去的纬度-地址
          longitude: Number(longitude) ? Number(longitude) : 121.5039390000,//要去的经度-地址
          name: address ? address : "O'MALL华侨城商业中心",
          address: address ? address : '华侨城商业中心'
        })
      }
    })
  }

  freeCall = () => {
    const { phoneFlg, phone } = this.state
    if (!phoneFlg) {
      this.setState({
        phonePop: true,
        phoneType: 2
      })
      return
    }
    const { roomData: { contactPhone } } = this.state
    Taro.makePhoneCall({
      phoneNumber: contactPhone, fail: () => {
        Taro.showToast({ title: '呼叫失败' })
      }
    })
  }

  copyWechat = () => {
    Taro.setClipboardData({
      data: 'wechat', success: (res) => {
        Taro.showToast({ title: '微信号已复制', icon: 'none' })
      }, fail: () => {
        Taro.showToast({ title: '复制失败' })
      }
    })
  }
  onConfirm = () => {
    const { phone, phoneType, roomData } = this.state
    if (!phone) {
      Taro.showToast({ title: '请输入电话号码！' })
      return
    } else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
      Taro.showToast({ title: '手机号码有误！' })
      return
    }
    Taro.setStorageSync('phone', phone)
    Taro.showToast({ title: '手机号记录成功' })
    this.setState({ phoneFlg: true },
      () => {
        if (phoneType === 1) {
          this.clkLike(roomData.id)
        } else if (phoneType === 2) {
          this.freeCall()
        }
        this.postUser(phone)
      })
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
  getUserInfo = (e) => {
    const userRes = e.currentTarget.userInfo
    Taro.setStorageSync('user', userRes)
    this.setState({ user: userRes })
    this.postUser('', userRes.gender)

  }
  postUser = async (phone = '', sex = '') => {
    try {
      let sexP, phoneP, parmas
      const { roomData: { id } } = this.state
      if (phone) {
        phoneP = phone
        const user = Taro.getStorageSync('user')
        if (user) {
          sexP = user.gender == 1 ? '男' : '女'
        } else {
          sexP = '/'
        }
        parmas = { phone: phoneP, roomId: id, sex: sexP }
      } else if (sex) {
        let sexP = sex == '1' ? '男' : '女'
        phoneP = Taro.getStorageSync('phone') || '/'
        parmas = { phone: phoneP, roomId: id, sex: sexP }
      }

      const userRes = await postUser(parmas)
      const { code, data } = userRes
      if (code === 0) {
        console.log('上传成功')
      }
    } catch (e) {
      console.log(e)
    }

  }
  goToVr = () => {
    const { vrUrl = '' } = this.state.roomData
    Taro.navigateTo({ url: `/pages/vr/vr?url=${vrUrl}` })
  }
  render() {
    const { counterStore: { counter } } = this.props
    const { roomData, markers, likeFlg, phone, phonePop, phoneType, user } = this.state
    const { latitude, longitude, matchingTag, vrUrl } = roomData
    let latitudeN = Number(latitude)
    let longitudeN = Number(longitude)
    // const [longitudeN, latitudeN] = [125.617722, 43.254822]
    // const [latitudeN, longitudeN] = [, ]
    console.log('map', typeof (latitudeN), longitude)


    return (<ScrollView scrollY className='detail'>
      <View className='share-box'>
        <View className='share-box-item' onClick={() => this.clkLike(roomData.id)}>
          <Image className='share-box-icon like-icon' src={likeFlg ? require('../../assets/liked.png') : require('../../assets/like.png')}></Image>
        </View>
        <Button openType={'share'} className='share-box-item'>
          <Image className='share-box-icon share-icon' src={require('../../assets/share.png')}></Image>
        </Button>
      </View>
      <Swiper
        className='detail-swiper'
        indicatorColor='rgba(255,255,255,0.4)'
        indicatorActiveColor='rgba(255,255,255,0.75)'
        circular
        indicatorDots
        autoplay>
        {roomData.roomImages.map(item => {
          return (<SwiperItem>
            <View className='swiper-item'>
              <Image className='swiper-item-img' mode='widthFix' src={item}></Image>
            </View>
          </SwiperItem>)
        })}
        {/* <SwiperItem>
          <View className='swiper-item'>
            <Image className='swiper-item-img' mode='widthFix' src={'https://tgi1.jia.com/123/203/23203900.jpg'}></Image>
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='swiper-item'>
            <Image className='swiper-item-img' mode='widthFix' src={'https://tgi1.jia.com/123/203/23203900.jpg'}></Image>
          </View>
        </SwiperItem> */}
      </Swiper>
      <View className='detail-main'>
        <View className='detail-title'>
          <Text className='detail-title-txt'>{roomData.name}</Text>
          {vrUrl && <View className='detail-vr'
            onClick={this.goToVr}
          >
            VR看房
           <Image className='detail-vr-img' src={require('../../assets/right-arrow1.png')}></Image>
          </View>}
        </View>
        <View className='detail-price'>
          <View className='price'>{roomData.price}</View>
          <View className='unit'>元/月起</View>
        </View>
        <View className='nearby'>
          <Image className='nearby-img' src={require('../../assets/nearby.png')}></Image>
          <Text className='nearby-txt'>{roomData.nearby}</Text></View>
        <View className='location'>
          <View className='location-l'><Image className='location-img' src={require('../../assets/location.png')}></Image>
            <Text className='location-txt'>{roomData.address}</Text></View>
          <View className='location-btn'
            onClick={this.getLocation}
          >到店指引</View>
        </View>{
          matchingTag && <View className='detail-match'>
            <Text className='detail-match-txt'>配套设施</Text>
            <View className='detail-match-box' >
              {matchingTag.map(item => {
                return (<View className='detail-match-item'>
                  <Image className='icon' src={`${labelMap[item] ? labelMap[item] : ''}`}></Image>
                  {labelMap[item] && <Text className='txt'>{item}</Text>}
                </View>)
              })}
            </View>
          </View>
        }
        <View className='map'>
          <View className='map-title'>周边配套和交通</View>
          <View className='map-location'>
            <Image className='map-location-img' src={require('../../assets/location.png')}></Image>
            <Text className='map-location-txt'>{roomData.address}</Text>
            <View className='map-location-btn'
              onClick={this.getLocation}
            >查看路线 ></View>
          </View>
          {/* <View className='map-cover'
            onClick={this.getLocation}
          >
            <Image className='map-cover-img' src={require('../../assets/expbj.jpg')}  ></Image>
          </View> */}
          <Map className='map-map'
            markers={markers}
            show-location
            include-points={markers}
            onClick={this.getLocation}
            latitude={latitudeN} longitude={longitudeN} />
        </View>
      </View>

      <View className='detail-contact'>
        <View className='detail-contact-box'>
          <View className='detail-contact-tel' onClick={this.freeCall}>
            <Text className='txt'>电话咨询</Text>
          </View>
          {/* <View className='detail-contact-wechat' onClick={this.copyWechat}>
            <Text className='txt'>微信联系</Text>
          </View>         */}
          {user ? <Button openType={'contact'}
            show-message-card={true}
            className='detail-contact-wechat'
          >微信联系</Button> : <Button
            openType={'getUserInfo'}
            onGetUserInfo={this.getUserInfo}
            className='detail-contact-wechat'
          >微信联系</Button>}
          {/* <Button openType={'contact'} show-message-card={true} className='detail-contact-wechat' onClick={this.onCancel}>微信联系</Button> */}
        </View>

      </View>
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
    </ScrollView>)
  }
}

export default Detail
