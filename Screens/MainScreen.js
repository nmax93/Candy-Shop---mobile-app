import React, { Component } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import MainScreenProduct from '../Components/MainScreenComponents/MainScreenProduct'
import TitleBar from '../Components/TitleBar'
import Loading from '../Components/Loading'
import History from '../Components/History'
import Cart from '../Components/Cart'
import PropTypes from 'prop-types'
import { myAPIkey, myDatabase, myCollection, dishesDocument } from '../consts'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gainsboro'
  },
  cart: {
    bottom: 35,
    right: 35,
    position: 'absolute'
  },
  history: {
    bottom: 35,
    left: 35,
    position: 'absolute'
  },
  emptySpace: {
    height: 50,
    width: '100%'
  }
})

export default class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { isReady: false, dishes: [], cart: [] }
    this.getData = this.getData.bind(this)
    this.mapProducts = this.mapProducts.bind(this)
    this.addToCart = this.addToCart.bind(this)
    this.emptyCart = this.emptyCart.bind(this)
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    const url = `https://api.mlab.com/api/1/databases/${myDatabase}/collections/${myCollection}/${dishesDocument}?apiKey=${myAPIkey}`
    fetch(`${url}`)
      .then(res => res.json())
      .then(data => this.setState({ dishes: data.dishes, isReady: true }))
      .catch()
  }

  addToCart(item, selectedAddOns) {
    this.setState(prevState => ({
      cart: [...prevState.cart, { product: item, addOns: selectedAddOns }]
    }))
  }

  emptyCart() {
    this.setState({ cart: [] })
  }

  mapProducts() {
    const { navigation } = this.props
    let count = 0
    const products = this.state.dishes.map(item => {
      return (
        <MainScreenProduct
          key={count++}
          product={item}
          navigation={navigation}
          addToCart={(product, addOns) => this.addToCart(product, addOns)}
        />
      )
    })
    return products
  }

  render() {
    if (this.state.isReady === true) {
      const { navigation } = this.props
      return (
        <View>
          <ScrollView style={styles.container}>
            <TitleBar title={this.state.dishes.length + ' results were found'} />
            {this.mapProducts()}
            <View style={styles.emptySpace} />
          </ScrollView>
          {this.state.cart.length !== 0 && (
            <View style={styles.cart}>
              <Cart
                amount={this.state.cart.length}
                onPress={() =>
                  navigation.navigate('CheckOutScreen', {
                    cart: this.state.cart,
                    emptyCart: this.emptyCart,
                    dishes: this.state.dishes,
                    addToCart: this.addToCart
                  })
                }
              />
            </View>
          )}
          <View style={styles.history}>
            <History onPress={() => navigation.navigate('HistoryScreen')} />
          </View>
        </View>
      )
    }
    return <Loading />
  }
}
