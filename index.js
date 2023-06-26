let userContainer = document.getElementById("userContainer");
let cardContents = document.getElementById("cardContents");

// Async await
async function obtenerDatos() {
  try {
    let response = await fetch(
      "https://6479f043a455e257fa6415d9.mockapi.io/users/"
    );
    if (!response.ok) {
      throw new Error("Hubo un error en tu API");
    }
    const data = await response.json();

    data.map((item) => {
      const cards = document.createElement("div");
      cards.setAttribute("id", "cardsContent");
      cards.innerHTML = `
        <img src="${item.avatar}">
        <p>Id: ${item.id}</p>
        <h2> ${item.nombre}</h2>
        <h3>${item.email}</h3>
        <h4>${item.address}</h4>
        <div class="button_content">
          <button type="button" class="edit" data-bs-toggle="modal" data-bs-target="#editModal" data-usuario-id="${item.id}">Edit</button>
          <button type="button" class="delete" data-usuario-id="${item.id}">Borrar</button>
        </div>
      `;
      userContainer.appendChild(cards);

      const editButtons = cards.getElementsByClassName("edit");
      editButtons[0].addEventListener("click", () => {
        const imgElement = cards.querySelector("img");
        const nameElement = cards.querySelector("h2");
        const emailElement = cards.querySelector("h3");
        const addressElement = cards.querySelector("h4");

        const imgInput = document.getElementById("image");
        imgInput.type = "text";
        imgInput.value = imgElement.getAttribute("src");
        const nameInput = document.getElementById("name");
        nameInput.type = "text";
        nameInput.value = nameElement.textContent;

        const emailInput = document.getElementById("email");
        emailInput.type = "text";
        emailInput.value = emailElement.textContent;

        const addressInput = document.getElementById("address");
        addressInput.type = "text";
        addressInput.value = addressElement.textContent;

        const guardarBoton = document.getElementById("saveEdit");
        guardarBoton.textContent = "Guardar";

        guardarBoton.addEventListener("click", () => {
          const updatedUser = {
            nombre: nameInput.value,
            avatar: imgInput.value,
            email: emailInput.value,
            address: addressInput.value,
          };

          fetch(
            `https://6479f043a455e257fa6415d9.mockapi.io/users/${item.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedUser),
            }
          )
            .then((res) => res.json())
            .then((data) => {
              console.log("Usuario Actualizado: ", data);

              nameElement.textContent = updatedUser.nombre;
              imgElement.setAttribute("src", updatedUser.avatar);
              emailElement.textContent = updatedUser.email;
              addressElement.textContent = updatedUser.address;
            })
            .catch((err) => console.log(err));
        });
      });
    });

    //llamada al boton que elimina el usuario
    const eliminarBtns = document.querySelectorAll(".delete");
    eliminarBtns.forEach((btn) => {
      btn.addEventListener("click", eliminarUsuario);
    });

    /*
    //llamada al boton que edita el usuario
    const editarBtns = document.querySelectorAll("#saveEdit");
    editarBtns.forEach((btn) => {
      btn.addEventListener("click", editeUser);
    });*/

    //llamada al boton que crea un nuevo usuario
    const addBtns = document.querySelectorAll("#saveUser");
    addBtns.forEach((btn) => {
      btn.addEventListener("click", createUser);
    });
  } catch (error) {
    console.error(error);
  }
}

//funcion para eliminar el usuario por ID
async function eliminarUsuario(event) {
  const btn = event.target;
  const usuarioId = btn.dataset.usuarioId;

  try {
    let response = await fetch(
      `https://6479f043a455e257fa6415d9.mockapi.io/users/${usuarioId}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      Swal.fire(
        "Usuario eliminado!",
        `El usuario con id: ${usuarioId} fue eliminado con exito`,
        "success"
      );
      btn.parentNode.parentNode.remove(); // Elimina el contenedor del usuario de la interfaz
    } else {
      //Si la respuesta es un error, devuelvo un mensaje por pantalla.

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `El usuario con id: ${usuarioId} no pudo ser eliminado`,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

//add user
const addAvatar = document.getElementById("addimage");
const addNombre = document.getElementById("addname");
const addEmail = document.getElementById("addemail");
const addAddress = document.getElementById("addaddress");

const createUser = async (event) => {
  event.preventDefault();

  const newUser = {
    avatar: addAvatar.value,
    nombre: addNombre.value,
    email: addEmail.value,
    address: addAddress.value,
  };

  try {
    const response = await fetch(
      "https://6479f043a455e257fa6415d9.mockapi.io/users/",
      {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      Swal.fire(
        "Usuario agregado!",
        "El usuario fue agregado con éxito",
        "success"
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El usuario no pudo ser agregado con éxito",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// Event listener
document.getElementById("formulario").addEventListener("submit", createUser);

obtenerDatos();
