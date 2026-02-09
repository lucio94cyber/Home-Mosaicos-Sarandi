//PASO 1
// CARGAR PRODUCTOS DESDE JSON

// 1️⃣ Lee el archivo productos.json
// 2️⃣ Genera el HTML de cada producto
// 3️⃣ Agrega los data-* que usa el carrito
// 4️⃣ Conecta los botones "Agregar"

fetch("./data/productos.json")
    //Convierte el cuerpo de la respuesta a JavaScript real
    .then(respuesta => respuesta.json())
    //es el JSON ya convertido
    .then(productos => {

        const contenedor = document.getElementById("contenedor-productos");

        productos.forEach(prod => {
            // Armado para el llamado de productos el class=producto-card
            // el data se usa porque armamos todo antes desde html para llamar al los productos
            // h5 a button es la visual para usuario
            contenedor.innerHTML += `
                <div class="producto-card"
                    data-id="p${prod.id}"
                    data-nombre="${prod.nombre}"
                    data-precio="${prod.precio}"
                    data-imagen="./assets/productos/${prod.imagen}"
                >
                    <h5>${prod.nombre}</h5>
                    <img src="./assets/productos/${prod.imagen}">
                    <p>$ ${prod.precio.toLocaleString()}</p>
                    <button class="boton-agregar">Agregar</button>
                </div>
            `;
        });

        // para que al momento de seleccionar el producto, lea el click
        conectarBotones();
    })
    .catch(error => {
        console.error("Error cargando productos:", error);
    });


// PASO 2 CONECTAR BOTONES "AGREGAR" - Seleccionar todos los productos y leer el click

// Esta función:
// 1️⃣ Buscamos los botones "Agregar"
// 2️⃣ Leemos los data-* del producto
// 3️⃣ Llamamos al carrito
// 4️⃣ Mostramos el aviso visual

function conectarBotones() {
    document.querySelectorAll(".boton-agregar").forEach(boton => {

        boton.addEventListener("click", () => {

            // Subimos al contenedor del producto
            let tarjeta = boton.parentElement;

            // Leemos los datos del producto desde el HTML, hoy estan en json
            let nombre = tarjeta.dataset.nombre;
            let precio = tarjeta.dataset.precio;
            let imagen = tarjeta.dataset.imagen;
            let id = tarjeta.dataset.id;

            // Agregamos al carrito
            agregarAlCarrito(nombre, precio, imagen, id);

            // Aviso visual "Agregado ✔"
            const textoOriginal = boton.textContent;
            boton.textContent = "Agregado ✔";
            boton.classList.add("agregado");
            boton.disabled = true;

            //ejecutar un bloque de código después de un tiempo determinado.
            setTimeout(() => {
                boton.textContent = textoOriginal;
                boton.classList.remove("agregado");
                boton.disabled = false;
            }, 1000);
        });

    });
}


//PASO 3:Crear el array del carrito + conectarlo con localStorage + El carrito no se pierde al recargar la página
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// PASO 4 Función para guardar el carrito cada vez que cambie 
function guardarCarritoLocal(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//PASO 5 Agrupar productos iguales y manejar cantidades + Asegurando que todos los productos tengan cantidad y Si alguno no tiene cantidad,le pone 1
carrito = carrito.map(producto => {
    return {
        //Copiá TODO lo que ya tiene este producto los 3 puntitos
        ...producto,
        cantidad: producto.cantidad || 1
    };
});

//PASO 6 - Agregar al carrito los productos
function agregarAlCarrito(nombre, precio, imagen, id) {
//Buscar si el producto ya existe con su id
    let productoExistente = carrito.find(prod => prod.id === id);

    if(productoExistente){
        // si, ya existe → sumo cantidad
        productoExistente.cantidad += 1;
    } else {
        // si, no existe → lo agrego
        let producto = {
            nombre: nombre,
            precio: Number(precio),
            imagen: imagen,
            id: id,
            cantidad: 1
        };
        carrito.push(producto);
    }
    //guardarlo en caso de cerrar la pagina
    guardarCarritoLocal();
    // sumar cantidades de productos seleccionados
    CarritoCantidad();
    // calcular el total de todos los productos seleccionados
    CalcularTotal();
    // visualizar el carrito con sus productos elegidos
    MostrarCarrito();
}

// Paso 7 - Sumar las cantidades de productos elegidos
function CarritoCantidad() {
    let cantidad = carrito.reduce(
        (total, producto) => total + producto.cantidad,0);

    //Muestra el número en el ícono
    document.getElementById("carrito-numero").textContent = cantidad;
}

CarritoCantidad();

// PASO 8 — Crear el panel lateral del carrito (HTML + CSS)

// PASO 9 — Mostrar los productos dentro del panel
let iconoCarrito = document.getElementById("icono-carrito");
let listaCarrito = document.getElementById("carrito-lista");

//Abrir el carrito lateral
iconoCarrito.addEventListener("click", function(e){
    //bloquea el comportamiento automático del navegador para que lo manejes vos preventDefault
    e.preventDefault();
    /*classlist.add - Al botón, agregale la etiqueta ‘mostrar’.*/ 
    listaCarrito.classList.add("mostrar");
});

//Para cerrar la carrito lateral
    document.getElementById("carrito-cerrar").addEventListener("click", function(){
    listaCarrito.classList.remove("mostrar");
});

// PASO 10 — Calcular el total y Mostrar Productos del carrito
function CalcularTotal(){
    let total = carrito.reduce((acumulado, producto) => acumulado + (producto.precio * producto.cantidad),0);

    document.getElementById("carrito-total").textContent = `$${total}`;
    return total;
}


CalcularTotal()

// PASO 11 — Mostrar Productos del carrito

function MostrarCarrito(){
    let contenedor = document.getElementById("carrito-items");
    //para leer o modificar el contenido HTML dentro de un elemento en una página web - innerHTML
    contenedor.innerHTML = "";

    carrito.forEach((producto, indice) => {
        let item = document.createElement("div");
        item.classList.add("carrito-item");

        // 1️⃣ guardo el id en el contenedor
        item.dataset.id = producto.id;

        // 2️⃣ creo el HTML
        item.innerHTML = `
            <img src="${producto.imagen}" class="carrito-img">
            <div class="carrito-detalle">
                <p>${producto.nombre}</p>
                <span>$${producto.precio} X ${producto.cantidad} = ${producto.precio * producto.cantidad}</span>
            </div>
            <button class="carrito-sumar">+</button>
            <button class="carrito-restar">-</button>
            <button class="carrito-eliminar">X</button>
        `;

//Botones + / − por producto

        // 3️⃣ botón +
        item.querySelector(".carrito-sumar").addEventListener("click", function () {
            let id = item.dataset.id;
            let producto = carrito.find(p => p.id === id);
            producto.cantidad += 1;

            guardarCarritoLocal();
            MostrarCarrito();
            CalcularTotal();
            CarritoCantidad();
        });

        item.querySelector(".carrito-restar").addEventListener("click", function () {
    // subir al contenedor padre
    let contenedorProducto = this.closest(".carrito-item");
    // leer el id
    let id = contenedorProducto.dataset.id;
    // buscar el producto en el carrito
    let producto = carrito.find(p => p.id === id);
    // restar cantidad
    producto.cantidad -= 1;
    // si llega a 0 → eliminar del carrito
    if (producto.cantidad === 0) {
        carrito = carrito.filter(p => p.id !== id);
    }
    // actualizar todo
    guardarCarritoLocal();
    MostrarCarrito();
    CalcularTotal();
    CarritoCantidad();
});

        // 4️⃣ botón eliminar (ya lo tenías bien)
        item.querySelector(".carrito-eliminar").addEventListener("click", function () {
            eliminarProducto(indice);
        });

        //replica la variable dentro del contenedor en este caso
        contenedor.appendChild(item);
    });
}

// PASO 12 — Botón para eliminar producto individual

function eliminarProducto(indice){
    carrito.splice(indice, 1); // elimina 1 elemento en esa posición

    guardarCarritoLocal();
    MostrarCarrito();
    CalcularTotal();
    CarritoCantidad();
}


// PASO 13 — Botón para “vaciar carrito”

let VaciarCarrito= document.getElementById("carrito-vaciar");

VaciarCarrito.addEventListener("click",function(e){
    // 1️⃣ Vaciar el array
    carrito = [];
 // 2️⃣ Guardar carrito vacío
guardarCarritoLocal()
// 3️⃣ Actualizar interfaz
MostrarCarrito()
CalcularTotal()
CarritoCantidad()
}
)

// Final para que cuando se hace refresh que todo igual

MostrarCarrito();
CalcularTotal();
CarritoCantidad();

//LIBRERIA EXTERNA

Swal.fire({
  title: "Bienvenido a Home Mosaicos Sarandi",
  text: "Elegi tu mueble y escribinos",
});
