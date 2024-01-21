let tbody = document.querySelector("#tbody")
let tbody2= document.querySelector("#tbody2")
let agregar = document.querySelector("#agregar")
let buscar = document.querySelector("#buscar")
let busqueda = document.querySelector("#busqueda")
let rol =document.querySelector("#rol")
let usuario = document.querySelector("#usuario")
let pers = document.querySelector("#pers")
let link = document.querySelector("#link")
let tablas = document.querySelector("#tablas")


var roles = JSON.parse(localStorage.getItem("roles")) ?? []  


const salvar = (salvar) => {		// Guarda en localStorage
	localStorage.setItem("roles", JSON.stringify(salvar))
}

const recargar = () => {		// Recarga los roles salvados o toda la página si se encuentra en modo búsqueda
	if (!!document.querySelector("#tbody3")) { 	
		window.location.reload()
	} else {
		mostrarRoles()	}
}

const agregarRoles = () => {					// Guarda los roles al hacer clic en "agregar". Siempre se agregan en la lista de pendientes por responder

	roles.push({
		nombre:rol.value,
		usuario:usuario.value,
		personaje:pers.value,
		link:link.value,
		tiempo: Date.parse(new Date()),
		estado: 0
	})

	salvar(roles)
	mostrarRoles()	
	
	rol.value=""
	usuario.value=""
	pers.value=""
	link.value=""

}

const calcularTiempo = (tiempo) => {	// Calcula el tiempo transcurrido entre la fecha guardada y el momento actual
	let tiempoActual= Date.parse(new Date)
	let diferencia = tiempoActual-tiempo
	let segundos = diferencia/1000
	if (segundos >=60){ 
		let minutos= segundos/60		
		if (minutos>=60){
			let horas = minutos/60
			if (horas>=24){
				let dias = horas/24
				if (dias>=7) {
					let semanas=parseInt(dias)/7
					if (semanas>=52){
						let anio=semanas/52
						if (parseInt(semanas%52)>0){
							return parseInt(anio)+" año(s), "+parseInt(semanas%52)+" semana(s)"
						} else{
							return parseInt(anio)+" año(s)"
						}

					} else{
						if (parseInt(dias%7)>0){
							return parseInt(semanas)+" semana(s), "+parseInt(dias%7)+" día(s)"
						} else {
							return parseInt(semanas)+" semana(s)"
						}

					}
				} else {
					if (parseInt(horas%24)>0){
						return parseInt(dias)+" día(s), "+parseInt(horas%24)+" hora(s)"
					} else {
						return parseInt(dias)+" día(s)"
					}

				}

			} else{
				if (parseInt(minutos%60)>0){
					return parseInt(horas)+" hora(s), "+parseInt(minutos%60)+" minuto(s)"
				} else {
					return parseInt(horas)+" hora(s)"
				}

			}

		} else {

			return parseInt(minutos)+" minuto(s)"
		}
	} else {
		return "0 minutos"
	}
}

const mostrarRoles  = () => {					// Muestra los roles en sus tablas correspondientes
	tbody.innerHTML=""
	tbody2.innerHTML=""
	if (roles.filter(x=> x.estado==0).length == 0 ) {			// Muestra una leyenda si no hay roles por responder 
		tbody.insertAdjacentHTML("beforeend", "<tr><td>No hay documentos activos</td></tr>")
	} 
	if (roles.filter(x=> x.estado==1).length ==0 ) {			// Muestra una leyenda si no hay roles en espera de respuesta
		tbody2.insertAdjacentHTML("beforeend", "<tr><td>No hay documentos inactivos</td></tr>") // 
	} 
	let rolPendiente = 1
	let rolEnEspera =1
	for (i = 0; i <roles.length; i++){
		if (roles[i].estado == 0){
			tbody.insertAdjacentHTML("beforeend", "<tr id='fila"+i+"'><td>"+rolPendiente+"</td><td>"+roles[i].nombre+"</td><td>"+roles[i].usuario+"</td><td>"+roles[i].personaje+"</td><td>"+calcularTiempo(roles[i].tiempo)+"</td><td onclick='confirmarRespondido("+i+")' id='enlace'>Inactivo</td><td onclick='configurar("+ i +")'><img src='config.png' class='icon'></td><td><a href='"+roles[i].link+"' target='_blank'><img src='link.png' class='icon'></a></td><td><img src='delete.png' class='icon' onclick='confirmaEliminar("+i+")'></td></tr>") //el primer parámetro enviado a confirmaEliminar determinará si es de la lista de roles o roles2
			rolPendiente++
		} else{
			tbody2.insertAdjacentHTML("beforeend", "<tr id='fila"+i+"'><td>"+rolEnEspera+"</td><td>"+roles[i].nombre+"</td><td>"+roles[i].usuario+"</td><td>"+roles[i].personaje+"</td><td>"+calcularTiempo(roles[i].tiempo)+"</td><td onclick='confirmarRespondido("+i+")' id='enlace'>Activo</td><td onclick='configurar("+i +")'><img src='config.png' class='icon'></td><td><a href='"+roles[i].link+"' target='_blank'><img src='link.png' class='icon'></a></td><td><img src='delete.png' class='icon' onclick='confirmaEliminar("+i+")'></td></tr>") //el primer parámetro enviado a confirmaEliminar determinará si es de la lista de roles o roles2
			rolEnEspera++
		}
	}
}


const configurar = (nro) => {		// Permite modificar los valores de un rol cargado			
	if (!!document.querySelector("#configrol")) { 	// Si ya hay una fila de configuración, vuelve a cargar las tablas para limpiar la fila de configuración abierta previamente y que solo haya una
		mostrarRoles()
	}
	let fila = document.querySelector("#fila"+nro)	// Despliega una fila debajo de la fila a configurar con campos para rellenar lo que se quiera modificar
	fila.insertAdjacentHTML("afterend",
	"<tr><td><input type='text' placeholder='Título' class='form-control' id='configrol'></td><td><input type='text' placeholder='Autor' class='form-control' id='configus'></td><td><input type='text' placeholder='Tema' class='form-control' id='configpers'></td><td><input type='text' placeholder='MM-DD-AAAA' class='form-control' id='datepicker'></td><td><input type='text' placeholder='Link' class='form-control' id='configlink'></td><td><img src='ok.png' class='icon' onclick='guardarCambios("+nro+")'><img src='cancel.png' class='icon' onclick='cancelarCambios()'></tr>")
	$( function() {			//Función que permite utilizar el calendario para elegir nueva fecha 
		$("#datepicker").datepicker()		
	  } )
}

const guardarCambios = (nro) => {		// Guarda los cambios ingresados al modificar los valores de alguna fila
	let rol = !!document.querySelector("#configrol").value ? document.querySelector("#configrol").value : roles[nro].nombre		// La variable toma el valor del campo si es que este tiene valor. Si no se ingresó nada, toma el valor que ya estaba
	let usuario = !!document.querySelector("#configus").value ? document.querySelector("#configus").value : roles[nro].usuario
	let pers = !!document.querySelector("#configpers").value ? document.querySelector("#configpers").value : roles[nro].personaje
	let tiempo = !!document.querySelector("#datepicker").value ? Date.parse(document.querySelector("#datepicker").value) : roles[nro].tiempo
	let link = !!document.querySelector("#configlink").value ? document.querySelector("#configlink").value : roles[nro].link

	roles[nro] = ({
		nombre:rol,
		usuario:usuario,
		personaje:pers,
		link:link,
		tiempo: tiempo,
		estado: roles[nro].estado
	})

	roles = ordenarRoles(roles)
	salvar(roles)
	recargar()

	
}

const cancelarCambios = () => {
	recargar()
}

const ordenarRoles = (arreglo) => {
	return arreglo.filter(x => x.estado == 0).sort((a, b) => a.tiempo - b.tiempo).concat(arreglo.filter(x => x.estado == 1).sort((a, b) => b.tiempo - a.tiempo))	// Divide en dos arreglos según el estado del rol, los ordena ascendente o descendente según el criterio deseado, y concatena ambos arreglos
  }

const cambiarEstado = (nro) => {		// Cambia el estado del rol respondido para que sea mostrado en una fila o en otra. También reinicia el tiempo.
	
	roles[nro].estado = roles[nro].estado==0 ? roles[nro].estado=1 : roles[nro].estado=0
	roles[nro].tiempo= Date.parse(new Date())

	roles = ordenarRoles(roles)
	salvar(roles)
	recargar()

}

const confirmarRespondido = (nro) => {
	if (confirm("¿El documento '"+roles[nro].nombre+ "' cambió de estado?")) {
		cambiarEstado(nro)
	} 
}

const confirmaEliminar = (nro) => {
	if (confirm("¿Eliminar el documento '"+roles[nro].nombre+ "' ?")) {
		roles.splice(nro,1)
		salvar(roles)
		recargar()
	} 
}


$(document).ready(function(){  


	mostrarRoles()


	agregar.addEventListener("click", function(e){ // Al evento de hacer clic en agregar, inserta en el HTML los elementos de la tabla para ir armando la lista de roles
		e.preventDefault()
		if (rol.value == "" || rol.value.trim() == "") { // El título es campo obligatorio
			window.alert("Campo vacío")
		} else {
			agregarRoles()
		}
	})

	buscar.addEventListener("click", function(e){ // Busca el texto ingresado en el campo.
		e.preventDefault()
		if (busqueda.value) {		// Solo funciona si hay un valor ingresado en el campo de búsqueda
			tablas.innerHTML=""
			const busquedaNormalizada = busqueda.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')	// Ignora tildes
			const regexp= new RegExp(busquedaNormalizada, "gi")	// Ignora mayúsculas o minúsculas 
			tablas.insertAdjacentHTML("beforeend", "<table class='table text-white'><thead><tr><th scope='col'> </th><th scope='col'>Título</th><th scope='col'>Autor</th><th scope='col'>Tema</th><th scope='col'>Tiempo transcurrido</th><th scope='col'>Cambiar estado</th></tr></thead><tbody id='tbody3'></tbody></table>") // Crea la tabla donde se mostrarán los valores encontrados
			let tbody3= document.querySelector("#tbody3")
			let rolBuscado = 1
			let estado
			for (i=0; i<roles.length; i++) {
				if (Object.values(roles[i]).some(value => regexp.test(value))) {	// Busca el valor buscado en los valores del objeto
					estado =  roles[i].estado==0 ? "Activo (marcar como inactivo)" : "Inactivo (marcar como activo)"
					tbody3.insertAdjacentHTML("beforeend", "<tr id='fila"+i+"'><td>"+rolBuscado+"</td><td>"+roles[i].nombre+"</td><td>"+roles[i].usuario+"</td><td>"+roles[i].personaje+"</td><td>"+calcularTiempo(roles[i].tiempo)+"</td><td onclick='confirmarRespondido("+i+")' id='enlace'>"+estado+"</td><td onclick='configurar("+ i +")'><img src='config.png' class='icon'></td><td><a href='"+roles[i].link+"' target='_blank'><img src='link.png' class='icon'></a></td><td><img src='delete.png' class='icon' onclick='confirmaEliminar("+i+")'></td></tr>") 
				rolBuscado++
				}
			}
			if (rolBuscado==1) {
				tbody3.insertAdjacentHTML("beforeend", "<tr><td>No se encontraron documentos</td></tr>") 
			} 
			tablas.insertAdjacentHTML("beforeend","<div><button type='submit' id='volver' class='btn btn-light'>Volver</button></div>")
			$("#volver").click(function()
			{
				recargar()
			});
		}
	})


	$("#contacto").click(function()
	{
		window.location.href = "mailto:lorena.tuhay@gmail.com";
	});


	/*Estilo*/



	$("#cambiartema").click(function(){		// Cambia el tema de claro a oscuro
		let cambiar = document.querySelector("#cambiartema")
		if (cambiar.innerHTML== "Tema claro") {
			$("body").attr({
				"class":"p-3 mb-2 bg-white text-black"
			})	
			$("table").attr({
				"class":"table table-striped"
			})	
			$("#barra").attr({
				"class":"navbar navbar-expand-lg bg-body-tertiary navbar-light"
			})					

			cambiar.innerHTML="Tema oscuro"
		} else {
			$("body").attr({
				"class":"p-3 mb-2 bg-dark text-white"
			})	
			$("table").attr({
				"class":"table text-white"
			})		
			$("#barra").attr({
				"class":"navbar navbar-expand-lg bg-body-tertiary navbar-dark"
			})		
				cambiar.innerHTML="Tema claro"
		}
		})

})