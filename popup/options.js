// Guardar las opciones
function saveOptions(e) {
  browser.storage.local.set({
    curso: document.querySelector("#curso").value,
    grupo: document.querySelector("#grupo").value,
    semestre: document.querySelector("#semestre").value,
    lunes: document.querySelector("#lunes").value,
  });
  e.preventDefault();
}

// Asignar el guardado cada vez que se cambien las opciones
document.querySelector("#curso").addEventListener("change", saveOptions);
document.querySelector("#grupo").addEventListener("change", saveOptions);
document.querySelector("#semestre").addEventListener("change", saveOptions);
document.querySelector("#lunes").addEventListener("change", saveOptions);

// Establecer el valor inicial de las entradas a los valores guardados
let stuff = browser.storage.local.get(["curso", "grupo", "semestre", "lunes"]);
stuff.then((res) => {
	document.querySelector("#curso").value = res.curso ? res.curso : "1";
  document.querySelector("#grupo").value = res.grupo ? res.grupo : "0";
	document.querySelector("#semestre").value = res.semestre ? res.semestre : "1";
	document.querySelector("#lunes").value = res.lunes;
});

let createData = {
  url: "../eventos/index.html"
};
document.querySelector("#eventos").addEventListener("click",() => {browser.tabs.create(createData);});
