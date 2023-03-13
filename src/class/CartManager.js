const fs = require('fs')

class CartManager {
  #id = 0
  constructor() {
    this.path = './src/files/carts.json'
}


  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const carts = JSON.parse(data)
        return carts
      }
      return []

    } catch (error) {
      console.log(error)
    }
  }

  async getCartById(id) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const carts = JSON.parse(data)
        let cart = carts.find(item => item.id == id)
        if (cart) {
          return cart.products
        } else {
            return 'Not found'
        }
    }
    } catch (error) {
      console.log(error)
    }
  }

  async updateCart(cid, pid, productUpdated) {
    
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const carts = JSON.parse(data)
        let cart = JSON.parse(data).find(item => item.id == cid)
        if (cart) {
          const product = cart.products.find(item => item.id == pid)
          if (product) {
            let cartProducts = cart.products.map(item => {
              if(item.id == pid) {
                item.quantity += productUpdated.quantity
                return item
              } else {
                return item
              }
            })
            cart.products = cartProducts
          } else {
            const product = {
              id: Number(pid),
              quantity: productUpdated.quantity
            }
            cart.products.push(product)
          }
          let cartUpdate = carts.map(item => {
            if (item.id == cid) {
              return cart
            } else {
              return item
            }
          })
          await fs.promises.writeFile(this.path, JSON.stringify(cartUpdate, null, '\t'))
          return `Updated cart - id: ${cid}`          
        }
        return `Cart selected not found`
      } else {
          return 'This cart is not valid'
      }
    } catch (error) {
      console.log(error)
    }
  }

  async deleteCart(id) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const carts = JSON.parse(data)
        let cart = carts.filter(item => item.id != id)
          await fs.promises.writeFile(this.path, JSON.stringify(cart, null, '\t'))
          return `Deleted cart - id: ${id}`
    }
    } catch (error) {
      console.log(error)
    }
  }

  async addCart(products) {

    try {
      const carts = await this.getCarts()
      if (carts.length === 0) {
        this.#id = 1
      } else {
        this.#id = carts[carts.length - 1].id + 1
      }
      
      if(products.length > 0) {
            const cart = {
                id: this.#id,
                products: products
            }
            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
            return `Cart created - id: ${cart.id}`
        
    } else {
        return 'This cart is not valid'
    }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = CartManager