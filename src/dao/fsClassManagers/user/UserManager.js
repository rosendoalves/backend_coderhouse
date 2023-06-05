const fs =  require('fs')

class UserManager {
  #id = 0
  constructor() {
    this.path = `${process.cwd()}/src/files/users.json`
}

  async find() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const users = JSON.parse(data)
        return users
      }
      return []

    } catch (error) {
      console.log(error)
    }
  }

  async findById(id) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const users = JSON.parse(data)
        let user = users.find(item => item.id == id)
        if (user) {
          return user
        } else {
            return 'Not found'
        }
    }
    } catch (error) {
      console.log(error)
    }
  }

  async findOne(email) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const users = JSON.parse(data)
        let user = users.find(item => item.email == email)
        if (user) {
          return user
        } else {
            return ''
        }
    }
    } catch (error) {
      console.log(error)
    }
  }

  async updateOne(id, newUser) {

    const {first_name, last_name, age, email, password, role = 'user'} = newUser
    
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const users = JSON.parse(data)
        if(first_name && last_name && age && email && password && role ) {
          const user = {
              id: Number(id),
              first_name: first_name,
                last_name: last_name,
                age: age,
                email: email,
                password: password,
                role: role
          }
          let usersUpdated = users.map(item => {
            if (item.id == id) {
              return user
            } else {
              return item
            }
          })
            await fs.promises.writeFile(this.path, JSON.stringify(usersUpdated, null, '\t'))
            return `Updated user - id: ${id}`
          } 
          return `Invalid Data`
        }
          return 'This user is not valid'
    } catch (error) {
      console.log(error)
    }
  }

  async deleteOne(id) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const users = JSON.parse(data)
        let user = users.filter(item => item.id != id)
          await fs.promises.writeFile(this.path, JSON.stringify(user, null, '\t'))
          return `Deleted user - id: ${id}`
    }
    } catch (error) {
      console.log(error)
    }
  }
  async deleteMany() {
    try {
      if (fs.existsSync(this.path)) {
        const users = []
          await fs.promises.writeFile(this.path, JSON.stringify(users, null, '\t'))
          return `All users deleted`
    }
    } catch (error) {
      console.log(error)
    }
  }

  async create(newUser) {

    const {first_name, last_name, age, email, password, role = 'user'} = newUser

    try {
      const users = await this.find()
      if (users.length === 0) {
        this.#id = 1
      } else {
        this.#id = Number(users[users.length - 1].id) + 1
      }
      
      if(first_name && last_name && age && email && password) {
            const user = {
                id: this.#id,
                first_name: first_name,
                last_name: last_name,
                age: age,
                email: email,
                password: password,
                role: role
            }
            users.push(user);
            await fs.promises.writeFile(this.path, JSON.stringify(users, null, '\t'))
            return user
        
    } else {
        return 'This user is not valid'
    }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = UserManager