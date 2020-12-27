import React, { useState, useEffect } from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {Products, Navbar, Cart, Checkout} from "./components"

import {commerce} from './lib/commerce'

const App = () => {
    const [products, setProducts] = useState([]);

    const [cart, setCart] = useState({});
    const [order, setOrder]= useState({})

    const [errorMSG, setErrorMSG] = useState('')

    const fetchProducts = async ()=>{
        const {data} = await commerce.products.list()
        setProducts(data)
    }


    const fetchCart = async ()=>{
        
        setCart(await commerce.cart.retrieve());
    }
    // Add to Cart
    const AddToCart = async (productId, quantity)=>{
       const {cart} = await commerce.cart.add(productId, quantity)
       setCart(cart)

    }

    // Update Cart
    const updateCartQty =  async (productId, quantity)=>{
        const {cart} = await commerce.cart.update(productId, {quantity}, )
        setCart(cart)
    }

    // Remove from Cart
    const removeFromCart = async (productId)=>{
        const {cart} = await commerce.cart.remove(productId)
        setCart(cart)
    }

    // Empty the Cart
    const handleEmptyCart = async ()=>{
        const {cart} = await commerce.cart.empty()
        setCart(cart)
    }
    

    const refreshCart = async()=> {
        const newCart=  await commerce.cart.refresh()
        setCart(newCart)
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder)=>{
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId,newOrder)
            setOrder(incomingOrder);
            refreshCart();
        } catch (error) {
            setErrorMSG(error.data.error.message)
        }
    }

    


    


    useEffect(()=>{
        fetchProducts();
        fetchCart();
    },[])

    
    
    return (
        <Router>
            
         <div>
            <Navbar totalItems={cart.total_items} />
            <Switch>
                <Route exact path="/">
                         <Products products={products} onAddToCart={AddToCart}/>
                </Route>

                <Route exact path="/cart">
                     <Cart cart={cart}
                     updateCartQty={updateCartQty}
                     removeFromCart={removeFromCart}
                     handleEmptyCart={handleEmptyCart}
                     />
                </Route>    

                <Route exact path="/checkout">
                    <Checkout
                     cart={cart}
                     order={order}
                     onCaptureCheckout={handleCaptureCheckout}
                     error={errorMSG}
                     />
                </Route>


            </Switch>
        </div>
        </Router>
    )
}

export default App

