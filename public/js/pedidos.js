(function () {
  // ======================================================
  // CONFIGURACIÓN: cambiá este valor para resaltar otro campo.
  // Opciones válidas: 'email' | 'nombre' | 'apellidos' | 'direccion' | 'codigoPostal' | 'ciudad' | 'telefono' | 'barrio'
  var CAMPO_A_COMPARAR = 'numerotarjeta';
  // ======================================================

  var cells = document.querySelectorAll('td[data-field="' + CAMPO_A_COMPARAR + '"]');
  var counts = {};

  cells.forEach(function (cell) {
    var value = cell.textContent.trim().toLowerCase();
    if (!value) return;
    counts[value] = (counts[value] || 0) + 1;
  });

  cells.forEach(function (cell) {
    var value = cell.textContent.trim().toLowerCase();
    if (!value || counts[value] < 2) return;

    cell.setAttribute('data-dup', 'true');

    var tag = document.createElement('span');
    tag.className = 'dup-tag';
    tag.textContent = 'x' + counts[value];
    cell.appendChild(tag);
  });
})();
