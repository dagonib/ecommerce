import { createContext, useReducer } from 'react';

export const Store = createContext();

// Definición del estado inicial
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    // Estado inicial de shippingAddress.
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},

    // Estado inicial de paymentMethod.
    paymentMethod: localStorage.getItem('paymentMethod')
      ? JSON.parse(localStorage.getItem('paymentMethod'))
      : '',

    // El estado inicial viene del localStorage. Si existe cartItems en el localStorage entonces obtiene el array sino se obtiene uno vacio.
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // add to cart
      // Se mantiene 'cart' tal y como está y se le añade el nuevo item.
      // Variable del producto añadido.
      const newItem = action.payload; // Producto seleccionado

      // Busca en el array cartItems un producto con el id del newItem (nuevo producto).
      // Si existe tendrá el valor del newItem, sino no tendrá valor.
      const existItem = state.cart.cartItems.find(
        // Producto existente en el cartItems
        (item) => item._id === newItem._id
      );

      // No lo entiendo
      // Si ya existe este producto en el cart,
      // es necesario utilizar la función map en el array cartItem
      // para actualizar el actual item con el new item,
      // de otra forma se mantiene el item previo en el cart.
      const cartItems = existItem
        ? state.cart.cartItems.map(
            (item) => (item._id === existItem._id ? newItem : item) // Si el item del array cartItems es igual al existItem, lo sustituye, sino mantiene los valores del array. No es necesaria esta parte pq en cualquier caso que el array igual.
          )
        : [...state.cart.cartItems, newItem]; // se añade el nuevo item.

      // Guardar el cartItems en el localStorage.
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };

    case 'CART_REMOVE_ITEM': {
      // Se utilizan las llaves en este caso para que no utilice las variables del caso anterior.
      // Con la función filter se crea un nuevo array cartItems en el que se elimina el item cuando coincide el id.
      // Si se cumple la condición, el elemento se mantiene en el array.
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );

      // Guardar el cartItems en el localStorage.
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };

    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' },
      };

    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  // Definición del useReducer.
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
