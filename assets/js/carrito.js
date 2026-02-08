//PASO 1: Crear el array del carrito + conectarlo con localStorage
//El carrito no se pierde al recargar la página
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//PASO 10 — Agrupar productos iguales y manejar cantidades
//Asegurar que todos los productos tengan cantidad y Si alguno no tiene cantidad, le pone 1
carrito = carrito.map(producto => {
    return {
        //Copiá TODO lo que ya tiene este producto los 3 puntitos
        ...producto,
        cantidad: producto.cantidad || 1
    };
});

// Función para guardar el carrito cada vez que cambie 
function guardarCarritoLocal(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

//Paso 2 Seleccionar todos los productos y leer el click

let recorrerBotones = document.querySelectorAll('button.boton-agregar')

    recorrerBotones.forEach(boton => {

        boton.addEventListener("click", function () {

        // 1️⃣ Obtener el contenedor del producto
        let tarjeta = boton.parentElement
        // 2️⃣ Leer los data-* del producto
        let nombre = tarjeta.dataset.nombre;
        let precio = tarjeta.dataset.precio;
        let imagen = tarjeta.dataset.imagen;
        let id = tarjeta.dataset.id;
        // 3️⃣ Llamar a la función agregarAlCarrito con los datos
        agregarAlCarrito(nombre, precio, imagen, id);
    })

})

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

    guardarCarritoLocal();  
    CarritoCantidad();
    CalcularTotal();
    MostrarCarrito();
}


function CarritoCantidad() {
    let cantidad = carrito.reduce(
        (total, producto) => total + producto.cantidad,0);

    //Muestra el número en el ícono
    document.getElementById("carrito-numero").textContent = cantidad;
}

CarritoCantidad();

// PASO 5 — Crear el panel lateral del carrito (HTML + CSS)
// PASO 6 — Mostrar los productos dentro del panel
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
// PASO 7 — Calcular el total y Mostrar Productos del carrito

function CalcularTotal(){
    let total = carrito.reduce((acumulado, producto) => acumulado + (producto.precio * producto.cantidad),0);

    document.getElementById("carrito-total").textContent = `$${total}`;
    return total;
}


CalcularTotal()

// PASO 7 — Mostrar Productos del carrito

function MostrarCarrito(){
    let contenedor = document.getElementById("carrito-items");
    //para leer o modificar el contenido HTML dentro de un elemento en una página web - innerHTML
    contenedor.innerHTML = "";

    carrito.forEach((producto, index) => {
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

//PASO 11 - 1️⃣ Botones + / − por producto

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
            eliminarProducto(index);
        });

        contenedor.appendChild(item);
    });
}

// PASO 9 — Botón para eliminar producto individual

function eliminarProducto(indice){
    carrito.splice(indice, 1); // elimina 1 elemento en esa posición

    guardarCarritoLocal();
    MostrarCarrito();
    CalcularTotal();
    CarritoCantidad();
}


// PASO 8 — Botón para “vaciar carrito”

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

// Agregar aviso de producto al carrito

document.querySelectorAll(".boton-agregar").forEach(boton => {
    boton.addEventListener("click", () => {

        const textoOriginal = boton.textContent;

        //Cambia el texto del botón en pantalla
        boton.textContent = "Agregado ✔";
        //Agrega la clase CSS
        boton.classList.add("agregado");
        boton.disabled = true;

        setTimeout(() => {
            boton.textContent = textoOriginal;
            boton.classList.remove("agregado");
            boton.disabled = false;
            //Ejecutá este código después de 1500 ms (1.5 segundos)”
        }, 1500);

    });
});

//LIBRERIA

Swal.fire({
  title: "Bienvenido a Home Mosaicos Sarandi",
  text: "Elegi tu mueble y escribinos",
});
