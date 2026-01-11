// Envio a Whatsapp
// PASO 1 – Capturar el click del botón

document.getElementById("carrito-whatsapp").addEventListener("click", enviarPedidoWhatsApp);

//PASO 2 - Crear la función que arma el mensaje

function enviarPedidoWhatsApp() {

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let mensaje = "Hola! Quiero hacer el siguiente pedido:\n\n";

    carrito.forEach(producto => {
        mensaje += `• ${producto.nombre} x ${producto.cantidad} - $${producto.precio * producto.cantidad}\n`;
    });

    mensaje += `\nTotal: $${CalcularTotal()}`;

    const telefono = "5491164227116"; // <-- poné el WhatsApp real acá

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
}
