import { useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      // Devuelve el estado previo.
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      // Devuelve el estado previo y solo modifica los datos de products. Payload contiene todos los productos del backend.
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state; // Devuelve el estado actual.
  }
};

function HomeScreen() {
  // Definición de un Reducer.
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  //const [products, setProducts] = useState([]);
  useEffect(() => {
    // Función para tomar los datos que hay en el api/products del servidor.
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured Products</h1>

      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
