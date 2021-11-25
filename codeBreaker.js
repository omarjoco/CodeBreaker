
//declaramos los elementos html que utilizaremos
const numeroUsuario = document.getElementById("numeroUSuario")
const btnComprobar = document.getElementById("btnComprobar")
const btnGenerarNumero = document.getElementById("btnGenerarNumero")
const btnconsultar = document.getElementById("consultar")
const mensajes = document.getElementById("listaMensajes")
const mensajeFelicitaciones = document.getElementById("mensajeFelicitaciones")



//Variables que nos serviran para controlar el flujo del programa
let numeroAdivinar = "";
let entradaUsuario = "";
let intentos = 0;
let numerosAdivinados = [];
let estadisticas = {
    cantidadAsteriscos: 0,
    cantidadGuiones: 0
}

//eventos principales para la interaccion con el usuario
btnGenerarNumero.addEventListener("click", () =>{ numeroAleatorio() })

btnconsultar.addEventListener("click", () => {  mostrarNumeroEscondido() })

btnComprobar.addEventListener("click", () => { procesarNumero() })

numeroUSuario.addEventListener("keyup", () =>{ restringirCaracteres(numeroUsuario) })


function numeroAleatorio(){
    let cantidad;


    generarNumeros()
    cantidad = validarNumero(numeroAdivinar);

    // este bloque genera un nuevo numero hasta que encuentra uno que no contenga repetidos
    if(cantidad > 0){
        do{
            generarNumeros();
            cantidad=validarNumero(numeroAdivinar);
        }while(cantidad > 0)
    }

    btnGenerarNumero.disabled = true
    numeroUsuario.disabled = false;
    btnComprobar.disabled = false;
    mensajeFelicitaciones.classList.add("invisible")
    mensajeFelicitaciones.classList.remove("visible")
    listaMensajes.innerHTML = ""
    ocultarNumeroCorrecto()
}


function generarNumeros(){
    numeroAdivinar = "";

    for(let cantidad = 0; cantidad < 4; cantidad++){
    numeroAdivinar += generarDigitos();
    }

}

function generarDigitos(){
   
    let numero = Math.round(Math.random() * 10);

    while(numero === 10){
        numero = Math.round(Math.random() * 10);
    }

   return numero;
}

function validarNumero(numeroAdivinar){
    let numero = Array.from(numeroAdivinar);
    let coincidencias = 0;

    for(let posicion = 0; posicion < (numero.length-1); posicion++){

        for(let aux = (posicion + 1); aux < numero.length; aux++){
            if(numero[posicion] === numero[aux]){
                coincidencias++;
            }
        }
    }

    return coincidencias;
}

function ocultarNumeroCorrecto(){

    for(let posicion = 1; posicion < 5; posicion++){
        document.getElementById(`numero-${(posicion)}`).innerHTML = "*";
    }
}


function restringirCaracteres(numeroUsuario){
    
    let caracter = numeroUsuario.value
    if(/[^0-9]/.test(caracter) || caracter.length>4){

        caracter = caracter.slice(0,(caracter.length-1));

        numeroUsuario.value = caracter;
}
}

/* funcion Que procesara el Intento del usuario por adivinar el numero */
function procesarNumero(){

    //variable global que permite conocer cuantos intentos ha realizado el usuario
    intentos++;
    
    //variable global que almacena la entrada del usuario del input
    entradaUsuario = numeroUsuario.value;
    numeroUsuario.value = ""

    //matriz que guardara los elementos que adivino en un intento el usuario
    numerosAdivinados = []


    verificarCoincidencias(entradaUsuario)


    const nuevoComentario = {
        intento: intentos,
        numeroIngresado: entradaUsuario,
        asteriscos: estadisticas.cantidadAsteriscos,
        guiones:estadisticas.cantidadGuiones
    }

    crearComentario(nuevoComentario);

    if(estadisticas.cantidadAsteriscos === 4 ){
        numeroUsuario.disabled=true;
        btnComprobar.disabled=true;
        mostrarNumeroCorrecto(numeroAdivinar)
        btnGenerarNumero.disabled=false;
        mensajeFelicitaciones.classList.remove("invisible")
        mensajeFelicitaciones.classList.add("visible")

    }

    numeroUsuario.focus();

}

/* funcion que encontrara el numero de guiones y asteriscos */
function verificarCoincidencias(entradaUsuario){

    //convertinos la entrada del usuario y el numero correcto a matrices
    let numeroUsuario = Array.from(entradaUsuario);
    let numeroCorrecto = Array.from(numeroAdivinar);

    let guiones = 0;
    let asteriscos = 0;
    let verificacion;

    for(let posicion = 0; posicion < numeroUsuario.length; posicion++){

        for(let aux = 0; aux < numeroUsuario.length; aux++){
            
            if(numeroCorrecto[posicion] === numeroUsuario[aux]){

                verificacion = verificarRepetidos(numeroUsuario[aux],numerosAdivinados);

                if(verificacion === false){
                    if(posicion === aux){
                        asteriscos++;
                    }else{
                        guiones++;
                    }
                    numerosAdivinados.push(numeroUsuario[aux])
                }
            }

        }

    }

    estadisticas.cantidadAsteriscos = asteriscos;
    estadisticas.cantidadGuiones = guiones;
}

/* funcion que comprobara que el digito no se cuente en caso de que este repetido */
function verificarRepetidos(digito, matrizAdivinados){
    let respuesta = false;
        if(matrizAdivinados.length > 0){
            for(let posicion = 0; posicion < matrizAdivinados.length; posicion++){
                if(digito === matrizAdivinados[posicion]){
                    respuesta = true;
                    break;
                }
            }
        }
        return respuesta;
    }

/* funcion Que desplegara en pantalla la retroalimentacion al usuario */
function crearComentario(comentario){

        const contenedor = document.createElement("div");
        contenedor.className = "pista";
        const intento = document.createElement("span");
        intento.innerHTML = comentario.intento + " . -";
        const entrada = document.createElement("span");
        entrada.className="Espaciado";
        entrada.innerHTML = " " + comentario.numeroIngresado;
        const separador = document.createElement("span");
        separador.innerHTML = " >>>> ";
        const asteriscos = document.createElement("span");
        asteriscos.innerHTML = crearAsteriscos(comentario.asteriscos);
        const guiones = document.createElement("span");
        guiones.innerHTML = crearGuiones(comentario.guiones);
    
        contenedor.appendChild(intento);
        contenedor.appendChild(entrada);
        contenedor.appendChild(separador);
        contenedor.appendChild(asteriscos);
        contenedor.appendChild(guiones);
    
       mensajes.insertAdjacentElement("afterbegin", contenedor);
}

function mostrarNumeroCorrecto(numero){
    let matriz = Array.from(numero)
    matriz.forEach( (valor, indice) => { document.getElementById(`numero-${(indice+1)}`).innerHTML = valor} )
}

numeroUsuario.disabled=true;
btnComprobar.disabled=true;


function mostrarNumeroEscondido(){
    mostrarNumeroCorrecto(numeroAdivinar);
    btnGenerarNumero.disabled = false;
    numeroUsuario.disabled = true;
    btnComprobar.disabled = true;

}



function crearAsteriscos(cantidad){
let asteriscos = "";
for(let indice = 0; indice < cantidad; indice++){
    asteriscos += "* ";
}
return asteriscos;
}

function crearGuiones(cantidad){
let guiones = "";
for(let indice=0; indice<cantidad; indice++){
    guiones+="- ";
}
return guiones
}












