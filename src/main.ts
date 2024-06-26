import type { Pais } from './types.ts';

const lista = document.querySelector('#lista-paises') as HTMLDivElement;
const formulario = document.querySelector('#formulario') as HTMLFormElement;
const pais = document.querySelector('#pais') as HTMLInputElement;

let nombreBusqueda = '';
let paises: Pais[] = [];

window.addEventListener('DOMContentLoaded', ()=>{
    consultarPaises();
    formulario?.addEventListener('submit', filtraPais);
});

//Funciones
function consultarPaises(){
    const url = 'https://restcountries.com/v3.1/all';

    fetch (url)
        .then (respuesta => respuesta.json())
        .then (datos => asignarPaises(datos))
}

function asignarPaises(datos: any){
    paises = datos;
    mostrarPaises(paises);
}

function mostrarPaises(datos: Pais[]){
    limpiarHTML();

    for(const pais of datos){


        const { name: {common}, flags: {png}, cca3 } = pais;

        const tarjeta = document.createElement('div');
        tarjeta.classList.add('card');

        tarjeta.innerHTML=`
            <img src="${png}" class="imagen-card">
            <div class="info">
            <h6>${common}</h6>
            <p>${cca3}</p>
            <button class="boton">Ver más</button>
            </div>
        `
        lista.appendChild(tarjeta);
    }
    cargaEventListener();
}

function cargaEventListener(){
    lista.addEventListener('click', redirecciona);
}

function redirecciona(e : Event){
    const target = e.target as HTMLElement;
    if(target?.classList.contains('boton')){
        const codigo = target.previousElementSibling?.innerHTML;
        window.location.href = "country.html?codigo="+codigo;
    }
}

function limpiarHTML(){
    while(lista.firstChild){
        lista.removeChild(lista.firstChild);
    }
}

function filtraPais(e: Event){
    e.preventDefault();

    nombreBusqueda = pais.value;
    if(nombreBusqueda === ''){
        mostrarPaises(paises);
    }
    else{
        const resultado = paises.filter(filtrarNombre);
        mostrarPaises(resultado);
        if(!resultado.length){
            noResultado();
        }
    }
}

function filtrarNombre(pais : Pais){
    if(nombreBusqueda){
        return pais.name.common.includes(nombreBusqueda);
    }
    return pais;
}

function noResultado(){
    limpiarHTML();
    const noResultado = document.createElement('div');
    noResultado.classList.add('alerta');
    noResultado.textContent = 'No existe ese país';
    lista.appendChild(noResultado);
}