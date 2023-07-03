let cartId = ''; 

async function getCartId() {
  const response = await fetch('/owner', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const cart = await response.json();
    cartId = cart._id;
  } else {
    console.error('Error al obtener el cartId');
  }
}

getCartId()

async function addToCart(productId) {
  const quantityInput = document.querySelector(`div[data-product-id="${productId}"] input[name="quantity"]`);
  const quantity = parseInt(quantityInput.value);

  // Realizar la solicitud POST al servidor
  const response = await fetch(`/api/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      products: [
        {
          product: productId,
          quantity: quantity,
        },
      ],
    }),
  });

  if (response.ok) {
    const cart = await response.json(); // Asignar el ID del carrito a la variable
    console.log("🚀 ~ file: cart.js:43 ~ addToCart ~ cart:", cart)
    cartId = cart._id; 
    console.log('Producto agregado al carrito:', cart);
  } else {
    console.error('Error al agregar producto al carrito');
  }
}
console.log("🚀 ~ file: cart.js:2 ~ cartId:", cartId)

async function updateCart(productId) {
  const quantityInput = document.querySelector(`div[data-product-id="${productId}"] input[name="quantity"]`);
  const quantity = parseInt(quantityInput.value);
  console.log("🚀 ~ file: cart.js:60 ~ quantity:", quantity)

  console.log(cartId)
  const response = await fetch(`/api/carts/${cartId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      [{
          product: productId,
          quantity: quantity,
        }]
    ),
  });

  if (response.ok) {
    const cart = await response.json();
    console.log('Carrito actualizado:', cart);
  } else {
    console.error('Error al actualizar el carrito');
  }
}

const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach((button) => {
  const productId = button.getAttribute('data-product-id');
  button.addEventListener('click', () => {
    checkCartExistence(productId);
    console.log('fn check');
  });
});


async function checkCartExistence(productId) {
  if (cartId) {
    console.log('cart id', cartId)
    updateCart(productId);
  } else {
    addToCart(productId);
  }
}
