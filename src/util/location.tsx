import counterStore from '../store/counter'
import Taro from '@tarojs/taro'

export default {
  onloadUserLocation(callback) {
    var that = this;
    this.getUserLoadtionAddress(res => {
      console.log("调用地址", res);
      if (res === 0) {
        Taro.showToast({
          icon: 'none',
          title: '建议授权地理位置', // 用户还是未授权提示内容，可进一步处理
        })
      } else {
        this.getLoadtion(res => {
          console.log("授权地理位置成功");
          callback(res)
          // that.setState({
          //   logcation: res,
          // })   //授权成功，可直接刷新一些请求
        })
      }
    });
  },
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  getUserLoadtionAddress(callback) {
    var that = this;
    console.log("进入授权地址");
    Taro.getSetting({
      success(e) {
        console.log("检查是否已经授权", e);
        if (!e.authSetting['scope.userLocation']) {
          that.getUserLoadtion(res => {
            console.log('/* 用户点击了取消，引导用户去授权页面 */', res);
            if (res.errMsg === "authorize:fail auth deny" || res.errMsg === "authorize:fail") {
              Taro.showModal({
                title: "请求获得定位权限",
                content: "获得你的地理位置能够更好的为你推荐本地信息",
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    that.getOpenseting(res => {
                      if (res === 1) {
                        that.getLoadtion(_res => {
                          console.log("授权位置成功========>", _res);
                          if (callback) callback(_res);
                        })
                      } else {
                        if (callback) callback(res);
                      }
                    })
                  }
                },
                fail(res) {
                  console.log(`showModal调用失败`);
                },
              });
            } else {
              that.getLoadtion(res => {
                console.log("授权位置成功========>", res);
                if (callback) callback(res);
              })
            }
          })
        } else {
          console.log("用户莫名奇妙的授权了");
          that.getLoadtion(res => {
            console.log("授权位置成功========>", res);
            if (callback) callback(res);
          })
        }
      }
    });
  },
  /* 获取用户的授权 */
  getUserLoadtion(callback) {
    Taro.authorize({
      scope: "scope.userLocation",
      success(e) {
        // 用户同意授权用户信息
        console.log("用户授权地理位置=============>", e);
        if (callback) callback(e);
      },
      fail(e) {
        if (callback) callback(e);
      }
    });
  },
  /* 获取用户的地理位置 */
  getLoadtion(callback) {
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        if (callback) callback(res);
      }
    });
  },
  /* 打开设置界面 监听用户是否授权 */
  getOpenseting(callback) {
    Taro.openSetting({
      success(e) {
        console.log("是否授权", e.authSetting['scope.userLocation'])
        var isLoadtion;
        if (e.authSetting['scope.userLocation']) {
          isLoadtion = 1;//未打开授权
        } else {
          isLoadtion = 0;//打开授权
        }
        console.log('/* 打开设置界面 监听用户是否授权 */', isLoadtion);
        if (callback) callback(isLoadtion);
      }
    });
  },

  /*储存位置信息*/
  getLocationCB(location) {
    Taro.setStorageSync('location', location)
    // this.setState({ location })
    counterStore.incrementAsync(location)
  }
}