const { faker } = require('@faker-js/faker')

faker.locale = 'es'

const generateProducts = (quantity) => {
  const numOfProducts = quantity ? quantity : 100
  console.log("🚀 ~ file: productMock.js:7 ~ generateProducts ~ numOfProducts:", numOfProducts)

  const products = []
  for (let i = 0; i < numOfProducts; i++) {
    products.push( {
      id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      thumbnail: faker.image.business,
      code: faker.random.numeric(3) + faker.random.alpha(3),
      stock: faker.random.numeric(2),
      status: faker.datatype.boolean(),
      category: faker.commerce.product()
    })
  }
  console.log("🚀 ~ file: productMock.js:9 ~ generateProducts ~ products:", products)

  return products
}

module.exports = generateProducts