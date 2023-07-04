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
    Swal.fire({
      text: `Producto eliminado correctamente`,
      toast: true,
      position: 'top-center'
    })
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } else {
    Swal.fire({
      text: `'Error al eliminar el producto`,
      toast: true,
      position: 'top-right'
    })
  }
}

function purchase(cartId) {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Compra realizada exitosamente') {
      let message = `Proceso finalizado bajo el ticket ${data.ticket.code} productos comprados ${data.ticket.products.length}`;
      if (data.productsUnavailable && data.productsUnavailable.length > 0) {
        message += '<br>No se pudo agregar los siguientes productos por falta de stock:';
        data.productsUnavailable.forEach(item => {
          message += `<br>${item.product.title}`;
        });
      }
      
      Swal.fire({
        html: message,
        toast: true,
        position: 'top-center'
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);

      console.log('Compra realizada exitosamente');
      // Realizar acciones adicionales después de la compra exitosa, si es necesario
    } else {
      Swal.fire({
        text: 'Error al realizar la compra',
        toast: true,
        position: 'top-center'
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);

      console.error('Error al realizar la compra');
    }
  })
  .catch(error => {
    console.error('Error de red:', error);
  });
}

