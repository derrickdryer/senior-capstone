module.exports = {
  isCI: false,
  vendors: [], // Prevents `vendors.map is not a function` error
  isPR: () => false,
};
