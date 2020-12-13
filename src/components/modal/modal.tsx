import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import './modal.less'

interface HtModalProps {
  animationType?: 'slide' | 'fade' | 'slideRight' | 'none'
  transparent?: boolean
  visible?: boolean
  cancelable?: boolean
  // Android only
  onBackPress?: () => void
  backgroundColor?: string
}

interface IState { }

export default class HtModal extends Taro.Component<HtModalProps, IState> {
  static defaultProps = {
    animationType: 'none',
    transparent: false,
    visible: false
  }

  dismiss = () => { }

  chooseAnimationType = (animationType, visible) => {
    let animateClassName = ''
    switch (animationType) {
      case 'slide':
        animateClassName = visible ? 'ht-modal-animate-slide-in' : 'ht-modal-animate-slide-out'
        break;
      case 'slideRight':
        animateClassName = visible ? 'ht-modal-animate-slide-in-right' : 'ht-modal-animate-slide-out-right'
        break;
      case 'fade':
        animateClassName = visible ? 'ht-modal-animate-fade-in' : 'ht-modal-animate-fade-out'
        break;
      default:
        animateClassName = ''
        break;
    }
    return animateClassName
  }

  render() {
    const { animationType, transparent, visible, backgroundColor = 'rgba(0, 0, 0, 0.3)' } = this.props

    return (
      <View
        className={`ht-modal ${transparent ? '' : 'ht-modal-bg'}`}
        style={visible ? { backgroundColor: backgroundColor } : { display: 'none' }}
      >
        <View className={`ht-modal-body ${this.chooseAnimationType(animationType, visible)}`}>
          {this.props.children}
        </View>
      </View>
    )
  }
}
