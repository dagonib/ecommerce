export const getError = (error) => {
  return error.response && error.response.data.message // server.js: res.status(404).send({ message: 'Product Not Found' });
    ? error.response.data.message
    : error.message;
};
