function $(arg) {return document.querySelector(arg);}

function addRow(num) {
  var row = document.createElement("tr");
  row.id = `evento-${num}`;
  row.innerHTML = `
    <td><input type="text" id="titulo-${num}"></td>
    <td><select id="dia-${num}">
      <option value="1">Lunes</option>
      <option value="2">Martes</option>
      <option value="3">Miércoles</option>
      <option value="4">Jueves</option>
      <option value="5">Viernes</option>
    </select></td>
    <td><input type="time" id="comienzo-${num}"></td>
    <td><input type="time" id="final-${num}"></td>
    <td><textarea id="desc-${num}"></textarea></td>
    <td><input type="color" id="color-${num}"></td>
    <td><button id="eliminar-${num}"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
  `;
  $("#table tbody").appendChild(row);
  const nn = num;
  $(`#eliminar-${num}`).onclick = function() {deleteRow(nn);};

  $(`#titulo-${num}`).addEventListener("change", saveEvents);
  $(`#dia-${num}`).addEventListener("change", saveEvents);
  $(`#comienzo-${num}`).addEventListener("change", saveEvents);
  $(`#final-${num}`).addEventListener("change", saveEvents);
  $(`#desc-${num}`).addEventListener("change", saveEvents);
  $(`#color-${num}`).addEventListener("change", saveEvents);

  saveEvents();
  n++;
}

function addRowNoSave(num) {
  var row = document.createElement("tr");
  row.id = `evento-${num}`;
  row.innerHTML = `
    <td><input type="text" id="titulo-${num}"></td>
    <td><select id="dia-${num}">
      <option value="1">Lunes</option>
      <option value="2">Martes</option>
      <option value="3">Miércoles</option>
      <option value="4">Jueves</option>
      <option value="5">Viernes</option>
    </select></td>
    <td><input type="time" id="comienzo-${num}"></td>
    <td><input type="time" id="final-${num}"></td>
    <td><textarea id="desc-${num}"></textarea></td>
    <td><input type="color" id="color-${num}"></td>
    <td><button id="eliminar-${num}"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
  `;
  $("#table tbody").appendChild(row);
  const nn = num;
  $(`#eliminar-${num}`).onclick = function() {deleteRow(nn);};

  $(`#titulo-${num}`).addEventListener("change", saveEvents);
  $(`#dia-${num}`).addEventListener("change", saveEvents);
  $(`#comienzo-${num}`).addEventListener("change", saveEvents);
  $(`#final-${num}`).addEventListener("change", saveEvents);
  $(`#desc-${num}`).addEventListener("change", saveEvents);
  $(`#color-${num}`).addEventListener("change", saveEvents);

  n++;
}

function deleteRow(num) {
  $(`#evento-${num}`).remove();
  renumberRows();
}

function renumberRows() {
  rows = document.getElementsByTagName("tr");
  n = rows.length;
  for (var i = 1; i < n; i++) {
    m = rows[i].id.substring(7);
    rows[i].id = `evento-${i}`;
    $(`#titulo-${m}`).id = `titulo-${i}`;
    $(`#dia-${m}`).id = `dia-${i}`;
    $(`#comienzo-${m}`).id = `comienzo-${i}`;
    $(`#final-${m}`).id = `final-${i}`;
    $(`#color-${m}`).id = `color-${i}`;
    $(`#desc-${m}`).id = `desc-${i}`;
    $(`#eliminar-${m}`).id = `eliminar-${i}`;
    const ii = i;
    $(`#eliminar-${i}`).onclick = function() {deleteRow(ii)};
  }
  saveEvents();
}

function saveEvents() {
  events = [];

  for (var i = 1; i < n; i++) {
    events.push({
      titulo: $(`#titulo-${i}`).value,
      dia: $(`#dia-${i}`).value,
      comienzo: $(`#comienzo-${i}`).value,
      final: $(`#final-${i}`).value,
      desc: $(`#desc-${i}`).value,
      color: $(`#color-${i}`).value
    });
  }

  browser.storage.local.set({
    eventos: events
  });
}

let request = browser.storage.local.get("eventos");
request.then((res) => {
  let events = res.eventos;

  for (var i = 0; i < events.length; i++) {
    addRowNoSave(i+1);
    $(`#titulo-${i+1}`).value = events[i].titulo;
    $(`#dia-${i+1}`).value = events[i].dia;
    $(`#comienzo-${i+1}`).value = events[i].comienzo;
    $(`#final-${i+1}`).value = events[i].final;
    $(`#desc-${i+1}`).value = events[i].desc;
    $(`#color-${i+1}`).value = events[i].color;
  }
});

let n = 1;
$("#add-button").addEventListener("click", () => {
  addRow(n);
});
