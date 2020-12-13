import Taro, { useCallback } from '@tarojs/taro'
import { View } from '@tarojs/components'
import HtModal from './modal'
import './sheet_modal.less'

import useRef = Taro.useRef;

export interface SheetModalProps {
  animationType?: 'slide' | 'fade' | 'none'
  visible?: boolean
  children?: any
  onCancel?: (e?: any) => void
  cancelable?: boolean
}

/**
 * 基础的Sheet组件，内容空白
 * 已适配RN、小程序
 * 使用示例：
 * <SheetModal animationType='slide' visible={false}>
 *   <CustomComponent />
 * </SheetModal>
 */
export default function SheetModal(props: SheetModalProps) {
  const { animationType = 'slide', visible = false, onCancel, cancelable = true } = props
  const htModal = useRef<HtModal | null>()

  const handleSpaceClick = useCallback((e) => {
    if (!cancelable) {
      return
    }
    if (process.env.TARO_ENV !== 'rn') {
      e.stopPropagation()
    }
    htModal.current && htModal.current.dismiss()
    onCancel && onCancel()
  }, [cancelable, onCancel])

  const handleTouchMove = useCallback((e) => {
    if (process.env.TARO_ENV !== 'rn') {
      e.stopPropagation()
    }
  }, [])

  return (
    <HtModal
      ref={c => {
        htModal.current = c
      }}
      animationType={animationType}
      transparent={false}
      visible={visible}
    >
      <View className='base-sheet-modal-container'>
        <View className='base-sheet-modal-space' onClick={handleSpaceClick} onTouchMove={handleTouchMove} />
        {props.children}
      </View>
    </HtModal>
  )
}
