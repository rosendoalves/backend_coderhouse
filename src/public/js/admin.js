const getUsers = async () => {
  const url = '/users';
  const headers = {
    'Content-Type': 'application/json'
  };
  const method = 'GET';
  const body = JSON.stringify();

  try {
    const response = await fetch(url, { headers, method, body });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const deleteUsers = async () => {
  const url = `/users`;
  const headers = {
    'Content-Type': 'application/json'
  };
  const method = 'DELETE';
  const body = JSON.stringify();

  try {
    const response = await fetch(url, { headers, method, body });
    if (response.ok) {
      location.reload();
    } 
  } catch (error) {
    console.log(error);
  }
};

const deleteUsersButton = document.getElementById('deleteUsersButton')
deleteUsersButton.addEventListener('click', () => {
  deleteUsers()
});

const deleteUser = async (userId) => {
  const url = `/users/${userId}`;
  const headers = {
    'Content-Type': 'application/json'
  };
  const method = 'DELETE';
  const body = JSON.stringify();

  try {
    const response = await fetch(url, { headers, method, body });
    if (response.ok) {
      location.reload(); // Recarga la página después de eliminar el usuario
    } else {
      console.log('Error al eliminar el usuario');
    }
  } catch (error) {
    console.log(error);
  }
};

const changeRole = async (userId) => {
  const url = `/users/change-role/${userId}`;
  const headers = {
    'Content-Type': 'application/json'
  };
  const method = 'PUT';
  const body = JSON.stringify();

  try {
    const response = await fetch(url, { headers, method, body });
    if (response.ok) {
      location.reload(); // Recarga la página después de cambiar el rol
    } 
  } catch (error) {
    console.log(error);
  }
};


getUsers()
  .then(data => {
    const tableBody = document.getElementById('data-users');
    data.forEach(user => {
      const row = document.createElement('tr');
      const firstNameCell = document.createElement('td');
      const lastNameCell = document.createElement('td');
      const emailCell = document.createElement('td');
      const roleCell = document.createElement('td');
      const connectionCell = document.createElement('td');
      const optionsCell = document.createElement('td');
      optionsCell.classList.add('users-options'); // Agrega la clase 'users-options' al elemento <td>

      firstNameCell.textContent = user.first_name;
      lastNameCell.textContent = user.last_name;
      emailCell.textContent = user.email;
      connectionCell.textContent = user.last_connection;
      roleCell.textContent = user.role;

      row.appendChild(firstNameCell);
      row.appendChild(lastNameCell);
      row.appendChild(emailCell);
      row.appendChild(roleCell);
      row.appendChild(connectionCell);
      row.appendChild(optionsCell);

      const changeRoleButton = document.createElement('button');
      changeRoleButton.textContent = 'Cambiar Rol';
      changeRoleButton.classList.add('change-role');
      changeRoleButton.addEventListener('click', () => {
        changeRole(user._id); // Pasa el objeto de usuario a la función changeRole()
      });

      const deleteUserButton = document.createElement('button');
      deleteUserButton.textContent = 'Eliminar';
      deleteUserButton.classList.add('delete');
      deleteUserButton.addEventListener('click', () => {
        deleteUser(user._id); // Pasa el objeto de usuario a la función deleteUser()
      });

      optionsCell.appendChild(changeRoleButton);
      optionsCell.appendChild(deleteUserButton);

      tableBody.appendChild(row);
    });
  })
  .catch(error => console.log(error));



