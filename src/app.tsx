import Taro, { Component, Config, getApp } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'

import Index from './pages/index'
import counterStore from './store/counter'
import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = {
  counterStore
}

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  constructor(props) {
    super(props)
    this.state = {
      location: {}
    }
  }
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/detail/detail',
      'pages/my/my',
      'pages/like/like'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    permission: {
      'scope.userLocation': {
        'desc': '是否同意勺找房调用你的位置信息' // 高速公路行驶持续后台定位
      }
    }
  }

  componentDidMount() { }

  componentDidShow() {
    // this.onloadUserLocation()
  }

  componentDidHide() { }

  componentDidCatchError() { }
  /** 监听用户刷新授权地理位置 */

  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
