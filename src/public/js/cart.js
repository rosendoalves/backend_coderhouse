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

    // Calcular el total a pagar
    const total = calculateTotal(cart.products);

    const totalElement = document.querySelector('.total');
    totalElement.textContent = 'Total a pagar: ' + total;
  } else {
    console.error('Error al obtener el cartId');
  }
}

function calculateTotal(products) {
  let total = 0;
  products.forEach(product => {
    total += product.quantity * product.product.price;
  });
  return total;
}

getCartId();

const deleteButtons = document.querySelectorAll('.delete-btn');
deleteButtons.forEach(button => {
  button.addEventListener('click', async () => {
    const productId = button.dataset.productId;
    await deleteProduct(productId);
    await getCartId(); // Volver a cargar el carrito después de eliminar el producto
  });
});

async function deleteProduct(productId) {
  const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    console.log(response)
    // Swal.fire({
    //   text: `Producto eliminado correctamente`,
    //   toast: true,
    //   position: 'top-right'
    // })
    console.log('Producto eliminado correctamente');
    window.location.reload();
  } else {
    console.error('Error al eliminar el producto');
  }
}

function purchase(cartId) {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (response.ok) {
        console.log('Compra realizada exitosamente');
        // Realizar acciones adicionales después de la compra exitosa, si es necesario
      } else {
        console.error('Error al realizar la compra');
      }
    })
    .catch(error => {
      console.error('Error de red:', error);
    });
}

