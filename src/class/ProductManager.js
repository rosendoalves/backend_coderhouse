const fs =  require('fs')

class ProductManager {
  #id = 0
  constructor() {
    this.path = './src/files/products.json'
}


  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const products = JSON.parse(data)
        return products
      }
      return []

    } catch (error) {
      console.log(error)
    }
  }

  async getProductById(id) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const products = JSON.parse(data)
        let product = products.find(item => item.id == id)
        if (product) {
          return product
        } else {
            return 'Not found'
        }
    }
    } catch (error) {
      console.log(error)
    }
  }

  async updateProduct(id, updatedProduct) {

    const {title, description, price, thumbnail, code, stock, status, category} = updatedProduct
    
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const products = JSON.parse(data)
        if(title && description && price && code && stock && status && category ) {
          const product = {
              id: id,
              title: title,
              description: description,
              price: price,
              thumbnail: thumbnail ? thumbnail : '',
              code: code,
              stock: stock,
              status: status,
              category: category
          }
          let productsUpdate = products.map(item => {
            if (item.id == id) {
              return product
            } else {
              return item
            }
          })
            await fs.promises.writeFile(this.path, JSON.stringify(productsUpdate, null, '\t'))
            return `Updated product - id: ${id}`
          } 
          return `Invalid Data`
        }
          return 'This product is not valid'
    } catch (error) {
      console.log(error)
    }
  }

  async deleteProduct(id) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const products = JSON.parse(data)
        let product = products.filter(item => item.id != id)
          await fs.promises.writeFile(this.path, JSON.stringify(product, null, '\t'))
          return `Deleted product - id: ${id}`
    }
    } catch (error) {
      console.log(error)
    }
  }

  async addProduct(product) {

    const {title, description, price, thumbnail, code, stock, status, category} = product

    try {
      const products = await this.getProducts()
      if (products.length === 0) {
        this.#id = 1
      } else {
        this.#id = Number(products[products.length - 1].id) + 1
      }
      
      if(title && description && price && code && stock && status && category ) {
        if(products.find(item => item.code == code)) {
            return 'Cannot repeat the field "code"'
        } else {
            const product = {
                id: this.#id,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail ? thumbnail : '',
                code: code,
                stock: stock,
                status: status,
                category: category
            }
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
            return `Product created - id: ${product.id}`
        }
        
    } else {
        return 'This product is not valid'
    }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = ProductManager