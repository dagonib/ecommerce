import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Rating from '../components/Rating';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      // Devuelve el estado previo.
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      // Devuelve el estado previo y solo modifica los datos de products. Payload contiene todos los productos del backend.
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state; // Devuelve el estado actual.
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  // Definición de un Reducer.
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    // Función para tomar los datos que hay en el api/products del servidor.
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    // Compara el id del producto seleccionado con los id(s) de los productos que hay en el array cart.cartItems.
    // Devuelve el producto existente.
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    // Si el producto existe se le suma 1 a la cantidad que hay, sino se pone el valor de 1 a quantity.

    const quantity = existItem ? existItem.quantity + 1 : 1;

    // Comprabar que la cantidad que se solicita comprar es inferior a la que existe en el stock.
    // Se hace una consulta a la BD para obtener el producto escogido
    const { data } = await axios.get(`/api/products/${product._id}`);
    // Si la cantidad en el stock es menor que la requerida, da un mensaje de error.
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity }, // Añade quantity al objeto product.
    });
    navigate('/cart');
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large"
            src={product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
