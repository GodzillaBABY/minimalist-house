import { observable } from 'mobx'

const counterStore = observable({
  location: {},
  counterStore() {
    this.counter++
  },
  increment() {
    this.counter++
  },
  decrement() {
    this.counter--
  },
  incrementAsync(location) {
    this.location = location
  }

})
export default counterStore