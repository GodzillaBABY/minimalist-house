import Taro, { Component, Config, getApp } from '@tarojs/taro'
import { View, Button, Text, Image, ScrollView, Swiper, SwiperItem, Picker } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
// import { AtIcon } from 'taro-ui'
import locationFun from '../../util/location'
import { getRoomList, getBanner } from '../../api/room'
import TabBar from '../../components/TabBar/TabBar'
import './index.less'

type PageStateProps = {
  counterStore: {
    location: any;
    increment: Function,
    decrement: Function,
    incrementAsync: Function
  }
  location: any
}

interface Index {
  props: PageStateProps;
  state: any
}
// interface Istate{
//   headerLabel:any
// }
// const bgImg = '/assets/icon_exchange_gift_card.png'

const app = getApp();
@inject('counterStore')
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show_header: false,
      headerOpacity: 0,
      banner: {
        bgImages: '',
        wheelImages: ['']
      },
      headerLabel: [
        '品牌公寓', '精准查找', '快速看房', '无中介费'
      ],
      quyu: ['全部区域', '流沙南街道', '流沙东街道', '流沙西街道'],
      quyuChecked: '全部区域',
      swiperBanner: ['../../assets/expbj.jpg', '../../assets/expbj.jpg'],
      roomList: [
        // {
        //   address: "广东省汕头市金平区月华工业区",
        //   contactPhone: "wefeewfewf",
        //   contactWechat: "sdfsd",
        //   districts: "流沙西街道",
        //   farAway: null,
        //   id: 8,
        //   latitude: "23.423246",
        //   longitude: "116.692257",
        //   matchingTag: "公共办公区域,公共办公区域",
        //   name: "dsd",
        //   nearby: "dsfwewfef",
        //   price: 1,
        //   roomImages: null,
        //   roomTag: "lk"
        // }
        // ,
        // {
        //   name: '南山云城公寓',
        //   address: '罗湖区深南东路2011号',
        //   label: ['冰箱', '投影仪'],
        //   price: '4999',
        //   location: '2.64km'
        // }
      ],
      roomListParmas: { districts: 'all', location: '116.483038,39.990633', page: 1, type: 0, per_page: 20 },
      totalPage: 1,
      rentFlg: false,
      rentC: false
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
    navigationStyle: 'custom',
    // @ts-ignore
    transparentTitle: 'auto',
    titlePenetrate: 'YES',
    navigationBarTitleText: '',
    defaultTitle: ''
  }

  componentWillMount() {
    // this.getPaddingTop()
  }

  componentWillReact() {
    console.log('componentWillReact')
  }

  componentDidMount() {

  }

  componentWillUnmount() { }

  componentDidShow() {
    // console.log(this.props.counterStore)
    locationFun.onloadUserLocation(this.init)
  }
  componentDidHide() { }
  init = async (res) => {
    const { longitude, latitude } = res
    const parmas = {
      districts: 'all', location: `${longitude},${latitude}`, page: 1, type: 0, per_page: 20
    }
    this.setState({ parmas })
    this.getBanner()
    this.getRoomList(parmas)
  }
  getMore = () => {
    let parmas = this.state.roomListParmas
    const totalPage = this.state.totalPage
    if (totalPage === parmas.page) return
    const page = parmas.page + 1
    parmas = { ...parmas, page: page }
    this.setState({ roomListParmas: parmas })
    this.getRoomList(parmas, true)
  }
  getBanner = async () => {
    try {
      const bannerRes = await getBanner()
      const { data, code } = bannerRes
      if (code === 0 && data) {
        this.setState({
          banner: data
        })
      } else {
        Taro.showToast({ title: '网络错误' })
      }
    } catch (e) {
      console.log(e)
      Taro.showToast({ title: '网络错误' })
    }
  }
  getRoomList = async (parmas = { districts: 'all', location: '116.483038,39.990633', page: 1, type: 1, per_page: 20 }, isMore = false) => {
    try {
      Taro.showLoading({ title: '加载中...' })
      const roomListRes = await getRoomList(parmas)
      const roomList = this.state.roomList
      const { data, code } = roomListRes
      if (code === 0 && data) {
        this.setState({
          totalPage: data.pages,
          roomList: isMore ? roomList.concat(data.records) : data.records
        })
      } else {
        Taro.showToast({ title: '网络错误' })
      }
      Taro.hideLoading()
    } catch (e) {
      console.log(e)
      Taro.hideLoading()
      Taro.showToast({ title: '网络错误' })
    }
  }
  quyuChange = (e) => {

    let parmas = this.state.roomListParmas, districts
    districts = e.detail.value == 0 ? 'all' : e.detail.value
    parmas = { ...parmas, districts: districts }
    this.setState({
      quyuChecked: this.state.quyu[e.detail.value],
      parmas: parmas
    })
    this.getRoomList(parmas)
  }
  // 页面滚动
  handleScroll = e => {
    const { scrollTop } = e.detail;
    // console.log('~~~~~~Scroll~~~~~~', scrollTop)
    let headerOpacity = scrollTop * 0.008;
    let show_header = false;

    if (headerOpacity < 0) {
      headerOpacity = 0;
    }
    if (headerOpacity > 1) {
      headerOpacity = 1;
    }

    if (scrollTop > 300) {
      show_header = true;
    } else {
      show_header = false;
    }
    this.setState({
      show_header
    });
    this.setState({
      headerOpacity
    });
  };

  goToDetail = (id) => {
    // this.onloadUserLocation()
    Taro.navigateTo({ url: `/pages/detail/detail?id=${id}` })
  }

  isIphoneX = () => {
    if (process.env.TARO_ENV === 'h5') {
      return false // window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && testUA('iPhone')
    }
    const { model } = Taro.getSystemInfoSync()
    return model.search('iPhone X') !== -1
  }

  getPaddingTop = () => {
    let customStyle
    const infoData = Taro.getSystemInfoSync() || {};
    const { statusBarHeight = 80 } = infoData || {};
    const domHeight = (statusBarHeight + 42) || 80
    customStyle = {
      // height: `${domHeight}px`,
      top: `${domHeight}px`
    }
    return customStyle
  }
  goToMy = () => {
    Taro.redirectTo({ url: '../my/my' })
  }
  goToIndex = () => {
    return
  }
  // dealLabel = (label) => {
  //   if (!label) return
  //   const labelRes = label.split(',')
  //   return labelRes
  // }
  // 渲染Header
  renderHeader = () => {
    const { headerOpacity, show_header } = this.state;
    const isVR = this.isIphoneX();
    let customStyle = {};
    const infoData = Taro.getSystemInfoSync() || {};
    const { statusBarHeight = 80 } = infoData || {};
    const domHeight = (statusBarHeight + 42) || 80
    customStyle = {
      height: `${domHeight}px`,
      paddingTop: `${domHeight - 42}px`
    }
    return show_header ? (
      <View
        className="my-header"
        style={{
          width: "100%",
          opacity: headerOpacity,
          ...customStyle
        }}
      >
        <View className="my-header-txt-wrapper">
          <Text className="my-header-txt">勺找房</Text>
        </View>
      </View>
    ) : null;
  };
  rentClk = () => {
    const { roomListParmas, rentFlg } = this.state
    let params, type
    if (!rentFlg) {
      params = { ...roomListParmas, type: 1 }
      type = true
    } else {
      params = { ...roomListParmas, type: 2 }
      type = false
    }
    this.setState({ rentFlg: type, rentC: true, roomListParmas: params })
    this.getRoomList(params)
  }
  render() {
    // console.log(location, 111111)
    const { headerLabel, quyu, quyuChecked, banner, swiperBanner, roomList, rentFlg, rentC } = this.state
    const { bgImages = `${require}('../../assets/expbj.jpg')`, wheelImages = [`${require}('../../assets/expbj.jpg')`, `${require}('../../assets/expbj.jpg')`] } = banner
    console.log(rentFlg, 'rent')
    return (
      <ScrollView scrollY className='index' onScroll={this.handleScroll} onScrollToLower={this.getMore}  >
        {this.renderHeader()}
        <View className='index-header'>
          <Image className='index-header-banner' src={bgImages ? bgImages : require('../../assets/expbj.jpg')}></Image>
          <View className='index-header-main'>
            <View className='index-header-info'>
              <View className='info-logo'>
                <Image className='info-logo-img' src={require('../../assets/header-logo.jpg')}></Image>
              </View>
              <View className='info-txt'>
                <View className='info-txt-name'>勺找房</View>
                <View className='info-txt-des'>城市梦想家</View>
              </View>
            </View>
            <View className='index-header-label'>
              {headerLabel.map(item => {
                return (<View className='label-box'>
                  <Text className='label-box-txt'>{item}</Text>
                </View>)
              })}
            </View>
          </View>
        </View>
        <View className='index-main'>
          <View className='index-main-banner'>
            <Swiper
              className='index-main-banner-swiper'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              indicatorDots
              autoplay>
              {
                wheelImages.map(item => {
                  return (<SwiperItem>
                    <View className='swiper-item'>
                      <Image className='swiper-item-img' src={item ? item : require('../../assets/expbj.jpg')}></Image>
                    </View>
                  </SwiperItem>)
                })
              }
              {/* <SwiperItem>
                <View className='swiper-item'>
                  <Image className='swiper-item-img' src={require('../../assets/expbj.jpg')}></Image>
                </View>
              </SwiperItem>
              <SwiperItem>
                <View className='swiper-item'>
                  <Image className='swiper-item-img' src={require('../../assets/expbj.jpg')}></Image>
                </View>
              </SwiperItem> */}
            </Swiper>
          </View>
          <View className='index-tab' style={this.getPaddingTop()}>
            <View className='index-tab-item'>
              <Picker mode='selector' className='selector-quyu' range={quyu} onChange={this.quyuChange}>
                <View className='picker'>
                  {quyuChecked}
                </View>
              </Picker>
            </View>
            <View className='index-tab-item' onClick={this.rentClk}>租金排序
            {rentC ? (rentFlg ? <Image className='rent-img' src={require('../../assets/up-active.png')}></Image> : <Image className='rent-img' src={require('../../assets/down-active.png')}></Image>) : <Image className='rent-img' src={require('../../assets/up.png')}></Image>}
            </View>
          </View>
          <View className='index-content'>
            {roomList.map(item => {
              const img = item.roomImages ? item.roomImages[0] : ''
              return (<View className='index-content-item' onClick={() => this.goToDetail(item.id)}>
                {/* <Image className='index-content-item-img' src={require('../../assets/expbj.jpg')}></Image> */}
                <View className='index-content-item-pic'>
                  <Image className='index-content-item-img' src={img}></Image>
                </View>
                <View className='index-content-item-r'>
                  <View className='title'>{item.name}</View>
                  <View className='address'>{item.address}</View>
                  <View className='label'>
                    {(item.matchingTag).map((label, index) => {
                      return (<View>
                        {index < 3 && <View className='label-item'>
                          <Text className='label-item-txt'>{label}</Text>
                        </View>}
                      </View>)
                    })}
                  </View>
                  <View className='money'>
                    <View className='money-money'>{item.price}<Text className='money-unit'>元/月起</Text>
                    </View>
                    {item.farAway && <View className='money-location'>
                      <View className='location-img-box'>
                        <Image className='money-location-img' src={require('../../assets/location.png')}></Image>
                        <Text>{Number(item.farAway) / 1000} km</Text>
                      </View>
                    </View>}
                  </View>
                  <View className='nearby'></View>
                </View>
              </View>)
            })}
          </View>
        </View>
        <TabBar goToMy={this.goToMy} goToIndex={this.goToIndex} indexSrc={`${require('../../assets/index-active.png')}`} mySrc={`${require('../../assets/my.png')}`}></TabBar>
      </ScrollView>
    )
  }
}

export default Index
