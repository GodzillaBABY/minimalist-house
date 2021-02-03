import Taro, { Component, Config, getApp } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './vr.less'

type PageStateProps = {
  counterStore: {
    location: any;
    increment: Function,
    decrement: Function,
    incrementAsync: Function
  }
  location: any
}

interface Vr {
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
class Vr extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: ''
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
    const { url } = this.$router.params
    console.log(this.$router.params)

    if (this.$router.params && url) {
      this.setState({ url: url })
    }
  }
  render() {
    const { url } = this.state
    return (<View>
      <View className="page-body">
        <WebView src={url}></WebView>
        {/* <WebView src={'https://vr.justeasy.cn/view/tu160d3877134l70.html?from=singlemessage&isappinstalled=0'}></WebView> */}
      </View>
    </View>)
  }
}

export default Vr
