/* =====================================================
   HOME MOSAICOS SARANDÍ
   CARRITO + PRODUCTOS + DETALLE
===================================================== */


/* =====================================================
   CARGAR PRODUCTOS
===================================================== */

fetch("./data/productos.json")

    .then(respuesta => {

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar productos.json");
        }

        return respuesta.json();

    })

    .then(productos => {

        const contenedor =
            document.getElementById("contenedor-productos");

        if (!contenedor) return;

        productos.forEach(prod => {

            contenedor.innerHTML += `

                <article
                    class="producto-card"

                    data-id="p${prod.id}"

                    data-nombre="${prod.nombre}"

                    data-precio="${prod.precio}"

                    data-imagen="./assets/productos/${prod.imagen}"

                    data-medidas="${prod.medidas}"

                    data-descripcion="${prod.descripcion}"
                >

                    <div class="producto-card-image">

                        <img
                            src="./assets/productos/${prod.imagen}"

                            alt="${prod.nombre}"

                            loading="lazy"
                        >

                    </div>


                    <h5>
                        ${prod.nombre}
                    </h5>


                    <p class="precio">
                        $ ${prod.precio.toLocaleString("es-AR")}
                    </p>


                    <div class="producto-medidas">

                        <span>
                            MEDIDA ORIENTATIVA
                        </span>

                        <strong>
                            ${prod.medidas}
                        </strong>

                        <span class="a-medida">
                            ✦ FABRICACIÓN A MEDIDA
                        </span>

                    </div>


                    <div class="producto-card-actions">

                        <button
                            class="btn-detalle"
                            type="button">

                            VER DETALLE

                        </button>


                        <button
                            class="boton-agregar"
                            type="button">

                            AGREGAR

                        </button>

                    </div>

                </article>

            `;

        });


        conectarBotones();

        conectarDetalles();

    })

    .catch(error => {

        console.error(
            "Error cargando productos:",
            error
        );

    });



/* =====================================================
   CARRITO
===================================================== */

let carrito =
    JSON.parse(
        localStorage.getItem("carrito")
    ) || [];


carrito = carrito.map(producto => {

    return {

        ...producto,

        cantidad:
            producto.cantidad || 1

    };

});


/* =====================================================
   GUARDAR
===================================================== */

function guardarCarritoLocal() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


/* =====================================================
   AGREGAR PRODUCTO
===================================================== */

function agregarAlCarrito(
    nombre,
    precio,
    imagen,
    id
) {

    let productoExistente =
        carrito.find(
            prod => prod.id === id
        );


    if (productoExistente) {

        productoExistente.cantidad += 1;

    } else {

        carrito.push({

            nombre: nombre,

            precio: Number(precio),

            imagen: imagen,

            id: id,

            cantidad: 1

        });

    }


    guardarCarritoLocal();

    CarritoCantidad();

    CalcularTotal();

    MostrarCarrito();


    /* Abrir automáticamente */

    const listaCarrito =
        document.getElementById(
            "carrito-lista"
        );

    if (listaCarrito) {

        listaCarrito.classList.add(
            "mostrar"
        );

    }

}


/* =====================================================
   BOTONES AGREGAR
===================================================== */

function conectarBotones() {

    document
        .querySelectorAll(".boton-agregar")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const tarjeta =
                        boton.closest(
                            ".producto-card"
                        );


                    const nombre =
                        tarjeta.dataset.nombre;


                    const precio =
                        tarjeta.dataset.precio;


                    const imagen =
                        tarjeta.dataset.imagen;


                    const id =
                        tarjeta.dataset.id;


                    agregarAlCarrito(
                        nombre,
                        precio,
                        imagen,
                        id
                    );


                    const textoOriginal =
                        boton.textContent;


                    boton.textContent =
                        "AGREGADO ✓";


                    boton.classList.add(
                        "agregado"
                    );


                    boton.disabled = true;


                    setTimeout(() => {

                        boton.textContent =
                            textoOriginal;

                        boton.classList.remove(
                            "agregado"
                        );

                        boton.disabled =
                            false;

                    }, 1000);

                }
            );

        });

}


/* =====================================================
   CANTIDAD
===================================================== */

function CarritoCantidad() {

    const cantidad =
        carrito.reduce(
            (total, producto) =>
                total + producto.cantidad,
            0
        );


    const contador =
        document.getElementById(
            "carrito-numero"
        );


    if (contador) {

        contador.textContent =
            cantidad;

    }

}


/* =====================================================
   TOTAL
===================================================== */

function CalcularTotal() {

    const total =
        carrito.reduce(

            (acumulado, producto) =>

                acumulado +
                (
                    producto.precio *
                    producto.cantidad
                ),

            0
        );


    const elemento =
        document.getElementById(
            "carrito-total"
        );


    if (elemento) {

        elemento.textContent =
            `$${total.toLocaleString("es-AR")}`;

    }


    return total;

}


/* =====================================================
   MOSTRAR CARRITO
===================================================== */

function MostrarCarrito() {

    const contenedor =
        document.getElementById(
            "carrito-items"
        );


    if (!contenedor) return;


    contenedor.innerHTML = "";


    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <p>
                    Tu carrito está vacío.
                </p>

                <small>
                    Elegí una pieza para comenzar.
                </small>

            </div>

        `;

        return;

    }


    carrito.forEach(
        (producto, indice) => {

            const item =
                document.createElement(
                    "div"
                );


            item.classList.add(
                "carrito-item"
            );


            item.dataset.id =
                producto.id;


            item.innerHTML = `

                <img
                    src="${producto.imagen}"
                    class="carrito-img"
                    alt="${producto.nombre}"
                >


                <div class="carrito-detalle">

                    <p>
                        ${producto.nombre}
                    </p>

                    <span>
                        $${producto.precio.toLocaleString("es-AR")}
                        ×
                        ${producto.cantidad}
                    </span>

                    <strong>
                        $${(
                            producto.precio *
                            producto.cantidad
                        ).toLocaleString("es-AR")}
                    </strong>

                </div>


                <button
                    class="carrito-sumar"
                    type="button">

                    +

                </button>


                <button
                    class="carrito-restar"
                    type="button">

                    −

                </button>


                <button
                    class="carrito-eliminar"
                    type="button">

                    ×

                </button>

            `;


            /* SUMAR */

            item
                .querySelector(
                    ".carrito-sumar"
                )
                .addEventListener(
                    "click",
                    () => {

                        const productoEncontrado =
                            carrito.find(
                                p =>
                                    p.id ===
                                    producto.id
                            );


                        productoEncontrado.cantidad += 1;


                        guardarCarritoLocal();

                        MostrarCarrito();

                        CalcularTotal();

                        CarritoCantidad();

                    }
                );


            /* RESTAR */

            item
                .querySelector(
                    ".carrito-restar"
                )
                .addEventListener(
                    "click",
                    () => {

                        const productoEncontrado =
                            carrito.find(
                                p =>
                                    p.id ===
                                    producto.id
                            );


                        productoEncontrado.cantidad -= 1;


                        if (
                            productoEncontrado.cantidad <= 0
                        ) {

                            carrito =
                                carrito.filter(
                                    p =>
                                        p.id !==
                                        producto.id
                                );

                        }


                        guardarCarritoLocal();

                        MostrarCarrito();

                        CalcularTotal();

                        CarritoCantidad();

                    }
                );


            /* ELIMINAR */

            item
                .querySelector(
                    ".carrito-eliminar"
                )
                .addEventListener(
                    "click",
                    () => {

                        carrito =
                            carrito.filter(
                                p =>
                                    p.id !==
                                    producto.id
                            );


                        guardarCarritoLocal();

                        MostrarCarrito();

                        CalcularTotal();

                        CarritoCantidad();

                    }
                );


            contenedor.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   BOTÓN CARRITO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const iconoCarrito =
            document.getElementById(
                "icono-carrito"
            );


        const listaCarrito =
            document.getElementById(
                "carrito-lista"
            );


        const cerrarCarrito =
            document.getElementById(
                "carrito-cerrar"
            );


        /* ABRIR */

        if (
            iconoCarrito &&
            listaCarrito
        ) {

            iconoCarrito.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    listaCarrito.classList.add(
                        "mostrar"
                    );

                }
            );

        }


        /* CERRAR */

        if (
            cerrarCarrito &&
            listaCarrito
        ) {

            cerrarCarrito.addEventListener(
                "click",
                () => {

                    listaCarrito.classList.remove(
                        "mostrar"
                    );

                }
            );

        }


        /* CERRAR CON ESC */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    listaCarrito?.classList.remove(
                        "mostrar"
                    );

                }

            }
        );

    }
);


/* =====================================================
   VACIAR
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const vaciar =
            document.getElementById(
                "carrito-vaciar"
            );


        if (!vaciar) return;


        vaciar.addEventListener(
            "click",
            () => {

                carrito = [];

                guardarCarritoLocal();

                MostrarCarrito();

                CalcularTotal();

                CarritoCantidad();

            }
        );

    }
);


/* =====================================================
   DETALLE DE PRODUCTOS
===================================================== */

function conectarDetalles() {

    document
        .querySelectorAll(".btn-detalle")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    const tarjeta =
                        boton.closest(
                            ".producto-card"
                        );


                    abrirDetalleProducto(
                        tarjeta
                    );

                }
            );

        });

}


/* =====================================================
   ABRIR MODAL
===================================================== */

function abrirDetalleProducto(
    tarjeta
) {

    const modal =
        document.getElementById(
            "producto-modal"
        );


    const imagen =
        document.getElementById(
            "modal-product-img"
        );


    const nombre =
        document.getElementById(
            "modal-product-nombre"
        );


    const medidas =
        document.getElementById(
            "modal-product-medidas"
        );


    const descripcion =
        document.getElementById(
            "modal-product-descripcion"
        );


    const whatsapp =
        document.getElementById(
            "modal-whatsapp"
        );


    const agregar =
        document.getElementById(
            "modal-agregar"
        );


    if (!modal) return;


    const nombreProducto =
        tarjeta.dataset.nombre;


    const precio =
        tarjeta.dataset.precio;


    const imagenProducto =
        tarjeta.dataset.imagen;


    const medidasProducto =
        tarjeta.dataset.medidas;


    const descripcionProducto =
        tarjeta.dataset.descripcion;


    imagen.src =
        imagenProducto;

    imagen.alt =
        nombreProducto;


    nombre.textContent =
        nombreProducto;


    medidas.textContent =
        medidasProducto;


    descripcion.textContent =
        descripcionProducto;


    /* WHATSAPP */

    const mensaje =
        `Hola! Quiero consultar por ${nombreProducto}. Me gustaría saber las medidas disponibles y opciones de fabricación a medida.`;

    whatsapp.href =
        `https://wa.me/5491178445258?text=${encodeURIComponent(mensaje)}`;


    /* AGREGAR DESDE MODAL */

    agregar.onclick = () => {

        agregarAlCarrito(
            nombreProducto,
            precio,
            imagenProducto,
            tarjeta.dataset.id
        );


        modal.classList.remove(
            "active"
        );

    };


    modal.classList.add(
        "active"
    );

}


/* =====================================================
   CERRAR MODAL
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const modal =
            document.getElementById(
                "producto-modal"
            );


        const cerrar =
            document.getElementById(
                "producto-modal-cerrar"
            );


        if (
            modal &&
            cerrar
        ) {

            cerrar.addEventListener(
                "click",
                () => {

                    modal.classList.remove(
                        "active"
                    );

                }
            );

        }

    }
);


/* =====================================================
   INICIALIZAR
===================================================== */

MostrarCarrito();

CalcularTotal();

CarritoCantidad();
