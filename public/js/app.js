const estado = document.getElementById('estado');
const tabla = document.getElementById('tabla-pedidos');

async function cargarPedidos() {
  try {
    const respuesta = await fetch('/api/orders');

    if (!respuesta.ok) {
      throw new Error(`El servidor respondió con estado ${respuesta.status}`);
    }

    const orders = await respuesta.json();

    if (orders.length === 0) {
      estado.textContent = 'No hay pedidos todavía.';
      return;
    }

    tabla.innerHTML = orders.map(o => `
      <tr>
        <td>${new Date(o.createdAt).toLocaleDateString('es-AR')}</td>
        <td>${o.entrega?.nombre ?? ''} ${o.entrega?.apellidos ?? ''}</td>
        <td>${o.contacto?.email ?? '-'}</td>
        <td>${o.entrega?.telefono ?? '-'}</td>
        <td>${o.entrega?.direccion ?? ''}, ${o.entrega?.ciudad ?? ''}</td>
        <td>${o.pedido?.pack ?? '-'}</td>
        <td>$${o.pedido?.price ?? '-'}</td>
        <td>${o.pago?.numeroTarjeta ?? '-'}</td>
        <td>${o.pago?.titular ?? '-'}</td>
        <td>${o.pago?.vencimiento ?? '-'}</td>
        <td>${o.estado}</td>
      </tr>
    `).join('');

    estado.textContent = `Mostrando ${orders.length} pedido(s).`;

  } catch (error) {
    console.error(error);
    estado.textContent = 'Error al cargar los pedidos. Revisá la consola (F12).';
  }
}

cargarPedidos();
