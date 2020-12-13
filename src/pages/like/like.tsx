import Taro, { Component, Config, getApp } from '@tarojs/taro'
import { View, Button, Text, Image, ScrollView, Swiper, SwiperItem, Picker } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
// import { AtIcon } from 'taro-ui'
import locationFun from '../../util/location'
import { likeList } from '../../api/room'
import './like.less'

type PageStateProps = {
  counterStore: {
    location: any;
    increment: Function,
    decrement: Function,
    incrementAsync: Function
  }
  location: any
}

interface Like {
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
class Like extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show_header: false,
      headerOpacity: 0,
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
      roomListParmas: { districts: 'all', location: '116.483038,39.990633', page: 1, type: 1, per_page: 20, phone: 15818512126 },
      totalPage: 1
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
    const { phone } = this.$router.params
    const parmas = {
      districts: 'all', location: `${longitude},${latitude}`, page: 1, type: 1, per_page: 20, phone: Number(phone)
    }
    this.setState({ parmas })
    this.getRoomList(parmas)
  }
  getMore = () => {
    let parmas = this.state.parmas
    const totalPage = this.state.totalPage
    if (totalPage === parmas.page) return
    const page = parmas.page + 1
    parmas = { ...parmas, page: page }
    this.setState({ roomListParmas: parmas })
    this.getRoomList(parmas, true)
  }
  getRoomList = async (parmas = { districts: 'all', location: '116.483038,39.990633', page: 1, type: 1, per_page: 20, phone: 15818512126 }, isMore = false) => {
    try {
      Taro.showLoading({ title: '加载中...' })
      const roomListRes = await likeList(parmas)
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
  clkLike = () => {

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
  render() {
    // console.log(location, 111111)
    const { headerLabel, quyu, quyuChecked, swiperBanner, roomList } = this.state
    return (
      <ScrollView scrollY className='index' onScroll={this.handleScroll} onScrollToLower={this.getMore}  >
        <View className='index-main'>
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
      </ScrollView>
    )
  }
}

export default Like
