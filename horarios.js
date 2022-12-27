let primerlunes;
var e = browser.storage.local.get("lunes");
e.then((res) => {
	primerlunes = new Date(res.lunes);
});

let bars = [];

let $ = function(id) {return document.getElementById(id);}

let myEvents = function() {
	let request = browser.storage.local.get("eventos");
	request.then((res) => {
		let events = res.eventos;
		console.log(events);
		for (let i = 0; i < events.length; i++) {
			addCustomEvent(events[i]);
		}
	});
}

let currentWeek = function() {
	if ($("custom-checkbox").checked) $("custom-checkbox").click();

	var leftButton = $("semanal").childNodes[0].childNodes[0].childNodes[0];
	var rightButton = $("semanal").childNodes[0].childNodes[0].childNodes[1];


	var weeks = Math.floor((Date.now() - primerlunes) / 1000 / 60 / 60 / 24 / 7); // Número de semanas desde el primer lunes del calendario semanal

	var date = $("semanal").childNodes[0].childNodes[2].childNodes[0].innerHTML; // Texto de la fecha
	var previousDate = "";
	do {
		previousDate = date;
		leftButton.click();
		date = $("semanal").childNodes[0].childNodes[2].childNodes[0].innerHTML;
	} while(date != previousDate); // Llegar a la primera semana

	for (var i = 0; i < weeks; i++) rightButton.click(); // Pasar las semanas hasta el presente
}

let addCustomEvent = function(event) {
	var e = document.createElement("a");
	e.setAttribute("class", "fc-time-grid-event fc-v-event fc-event fc-start fc-end tipo-OB actividad-T custom-event");

	var stuff = document.getElementsByClassName("fc-time-grid-event")[0].style.inset.split(" ");
	var height = -parseFloat(stuff[0]) - parseFloat(stuff[2]);

	var start = parseInt(event.comienzo.substring(0,2)) + parseInt(event.comienzo.substring(3))/60 - 8;
	var end = parseInt(event.final.substring(0,2)) + parseInt(event.final.substring(3))/60 - 8;
	e.setAttribute("style", `background-color: ${event.color}; inset: ${start*height}px 0% -${end*height}px; z-index: 1;`);
	e.setAttribute("title", event.titulo);

	var divTitle = document.createElement("div");
	divTitle.setAttribute("class", "fc-content");

	var divTitle2 = document.createElement("div");
	divTitle2.setAttribute("class", "fc-title");
	divTitle2.innerHTML = event.titulo;

	divTitle.appendChild(divTitle2);
	e.appendChild(divTitle);

	e.innerHTML += '<div class="fc-bg"></div>';

	var descContent = document.createElement("small");
	descContent.innerHTML = event.desc;
	e.appendChild(descContent);

	var tables = document.getElementsByClassName("fc-content-skeleton");
	for (var i = 0; i < tables.length; i++) {
		var column = tables[i].childNodes[0].childNodes[0].childNodes[0].childNodes[event.dia];
		column.childNodes[0].childNodes[1].appendChild(e.cloneNode(true));
	}
}

let toggleCustomEvents = function() {
	if (this.checked) {
		this.parentNode.setAttribute("class","custom-checkbox w3-green");
		myEvents();
	} else {
		this.parentNode.setAttribute("class","custom-checkbox w3-light-gray");
		var events = document.getElementsByClassName("custom-event");
		for (var i = events.length-1; i >= 0; i--) {
			events[i].remove();
		}
	}
}

let updateTime = function() {
	var date = new Date();
	var y = (date.getHours()-8+date.getMinutes()/60)*260/3
	for (var i = 0; i < bars.length; i++) {
		bars[i].style.inset = `${y-2}px 0 -${y+2}px`;
		bars[i].style.display = "none";
	}

	if (date.getDay() <= 5 && date.getDay() > 0) {
		bars[date.getDay()-1].style.display = "block";
	}
}


const style = document.createElement("style");
style.innerHTML = `
	.custom-checkbox {
		border: none;
		display: inline-block;
		padding: 8px 16px;
		vertical-align: middle;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		text-align: center;
		cursor: pointer;
		white-space: nowrap;
	}

	.custom-checkbox input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.now-bar {
		background-color: red;
		opacity: 0.5;
		display: none;
		position: absolute;
		z-index: 5;
	}
`;
document.head.appendChild(style);

var stuff = browser.storage.local.get(["curso", "grupo", "semestre"]);
stuff.then((res) => {
	$("radio-curso").childNodes[0].childNodes[res.curso-1].click(); // Cambiar curso
	$("radio-grupo").childNodes[0].childNodes[res.grupo].click(); // Cambiar grupo
	$("radio-periodo").childNodes[0].childNodes[res.semestre-1].click(); // Cambiar semestre
});

$("menu-semanal").addEventListener("click", currentWeek); // Añadir función adicional al pulsar en "Calendario Semanal"

for (let i = 0; i < 4; i++) {
	document.getElementsByClassName("fc-next-button")[i].addEventListener("click", function() {if ($("custom-checkbox").checked) $("custom-checkbox").click();});
	document.getElementsByClassName("fc-prev-button")[i].addEventListener("click", function() {if ($("custom-checkbox").checked) $("custom-checkbox").click();});
}

var link = document.createElement("link"); // Iconos tremendos
link.rel = "stylesheet";
link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
document.head.appendChild(link);

var buttonsDiv = document.body.childNodes[11]; // Creación del botón de eventos personalizados
var customCheckDiv = $("radio-curso").cloneNode(false);
customCheckDiv.setAttribute("id", "custom-button-container");
customCheckDiv.setAttribute("title", "Eventos personalizados");
customCheckDiv.appendChild($("radio-curso").childNodes[0].cloneNode(false));

var customCheck = document.createElement("label");
customCheck.setAttribute("class", "custom-checkbox w3-light-grey");
customCheck.innerHTML = '<input type="checkbox" id="custom-checkbox"><i class="fa fa-plus custom-checkbox-icon"></i>';
customCheck.childNodes[0].addEventListener("change", toggleCustomEvents);
customCheckDiv.childNodes[0].appendChild(customCheck);

buttonsDiv.appendChild(customCheckDiv);

// Añadir barras de tiempo actual
var bar = document.createElement("a");
bar.setAttribute("class", "now-bar");
let columns = document.getElementsByClassName("fc-content-col");
for (let i = 0; i < 5; i++) {
	var e = bar.cloneNode(true);
	bars.push(e);
	columns[i].appendChild(e);
}

setInterval(updateTime, 1000);
