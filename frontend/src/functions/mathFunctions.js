// Establecer número con dos decimales
export const financial = (number, decimals = 2) => {
  return Number.parseFloat(number).toFixed(decimals);
};
