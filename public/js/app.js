// public/js/app.js
//
// Este archivo corre en el NAVEGADOR (no en el servidor).
// Se encarga de pedir los datos a la API y pintarlos en la tabla.

const estado = document.getElementById('estado');
const tabla = document.getElementById('tabla-productos');

async function cargarProductos() {
  try {
    // Pedimos los datos a nuestra propia API
    const respuesta = await fetch('/api/products');

    if (!respuesta.ok) {
      throw new Error(`El servidor respondió con estado ${respuesta.status}`);
    }

    const productos = await respuesta.json();

    if (productos.length === 0) {
      estado.textContent = 'No hay productos cargados todavía.';
      return;
    }

    // Generamos una fila <tr> por cada producto y las insertamos juntas
    tabla.innerHTML = productos.map(p => `
      <tr>
        <td>${p.nombre}</td>
        <td>$${p.precio}</td>
        <td>${p.stock}</td>
        <td>${p.categoria ?? '-'}</td>
      </tr>
    `).join('');

    estado.textContent = `Mostrando ${productos.length} producto(s).`;

  } catch (error) {
    console.error(error);
    estado.textContent = 'Error al cargar los productos. Revisá la consola (F12).';
  }
}

cargarProductos();
