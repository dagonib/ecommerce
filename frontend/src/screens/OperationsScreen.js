import axios from 'axios';
import { useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import { financial } from '../functions/mathFunctions';
import { capitalize } from '../functions/languageFunctions';
import Button from 'react-bootstrap/esm/Button';

const reducer = (state, action) => {
  switch (action.type) {
    // Caso: petición
    case 'FETCH_REQUEST':
      // Devuelve el estado previo, inicial.
      return { ...state, loading: true };
    // Caso: petición realizada correctamente.
    case 'FETCH_SUCCESS':
      // Se obtiene la base de datos.
      return { ...state, operations: action.payload, loading: false };
    // Caso: petición fallida.
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function OperationsScreen() {
  // Definición del Reducer.
  const [{ loading, error, operations }, dispatch] = useReducer(reducer, {
    operations: [],
    loading: true,
    error: '',
  });

  // Obtener los datos cada vez que se cargue la página.
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/operations');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <section className="operations">
      <Row className="mb-4">
        <Button>Add</Button>
      </Row>
      <Row>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Type</th>
                <th>Coin</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Cost(USD)</th>
                <th>EUR price</th>
                <th>Cost(EUR)</th>
                <th>Comision(BNB)</th>
                <th>BNB Price</th>
                <th>Comision(EUR)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((operation) => (
                <tr key={operation._id}>
                  <th>{operation._id}</th>
                  <th>{operation.date}</th>
                  <th>{capitalize(operation.type)}</th>
                  <th>{operation.coin}</th>
                  <th>{operation.price}</th>
                  <th>{operation.quantity}</th>
                  <th>{financial(operation.price * operation.quantity)}$</th>
                  <th>{financial(operation.eur_dolar, 3)}</th>
                  <th>
                    {financial(
                      (operation.price * operation.quantity) /
                        operation.eur_dolar
                    )}
                    €
                  </th>
                  <th>{operation.comision_BNB}</th>
                  <th>{financial(operation.EUR_BNB)}</th>
                  <th>
                    {financial(operation.comision_BNB * operation.EUR_BNB)}
                  </th>
                  <th>
                    {financial(
                      Number(
                        (operation.price * operation.quantity) /
                          operation.eur_dolar,
                        2
                      ) + Number(operation.comision_BNB * operation.EUR_BNB)
                    )}
                  </th>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Row>
      <Row>
        <h1>
          Total:{' '}
          {financial(
            operations.reduce(
              (a, c) =>
                a +
                ((c.quantity * c.price) / c.eur_dolar +
                  c.comision_BNB * c.EUR_BNB),
              0
            )
          )}
          €
        </h1>
      </Row>
    </section>
  );
}

export default OperationsScreen;
