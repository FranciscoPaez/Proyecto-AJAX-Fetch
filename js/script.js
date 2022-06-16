const DateTime=luxon.DateTime;
const inicio=DateTime.now();
console.log(inicio.toLocaleString(DateTime.DATE_FULL));

let carrito = [];
let productosJSON = [];
let dolarCompra;


window.onload=()=>{
    document.querySelector("#fila_prueba").style.background="red";
    obtenerValorDolar();

    document.querySelector("#miSeleccion option[value='pordefecto']").setAttribute("selected", true);
    document.querySelector("#miSeleccion").onchange=()=>ordenar();
};




function renderizarProductos() {
 
    console.log(productosJSON)
    for (const prod of productosJSON) {
        document.querySelector(".milista").innerHTML+=(`<li class="col-sm-4 list-group-item">
        <img src="${prod.foto}" width="250" height="200px" class="img-tv"><br>
        <img src="./img/logo.png" width="85" height=22px" class="samsung">
        <p>Producto: ${prod.nombre}</p>
        <p class="precio-ars">$${prod.precio}</p>
        <p class="precio-usd">U$D ${(prod.precio/dolarCompra).toFixed(1)}</p>
        <div class="centrar-boton"><button class="btn btn-dark" id='btn${prod.id}'>Agregar al carrito</button></div>     
    </li>`);
    }

    for (const prod of productosJSON) {

         document.querySelector(`#btn${prod.id}`).onclick= function() {
            agregarACarrito(prod);
        };
    }
}

class ProductoCarrito {
    constructor(objProd) {
        this.id = objProd.id;
        this.foto = objProd.foto;
        this.nombre = objProd.nombre;
        this.precio = objProd.precio;
        this.cantidad = 1;
    }
}

function agregarACarrito(productoNuevo) {
    let encontrado = carrito.find(p => p.id == productoNuevo.id);
    console.log(encontrado);
    if (encontrado == undefined) {
        let prodACarrito = new ProductoCarrito(productoNuevo);
        carrito.push(prodACarrito);
        console.log(carrito);
        Swal.fire(
            productoNuevo.nombre,
            "Se agregó al carrito correctamente",
            'success'
        );

        document.querySelector("#tablabody").innerHTML+=(`
            <td> ${prodACarrito.nombre}</td>
            <td id='${prodACarrito.id}'> ${prodACarrito.cantidad}</td>
            <td> ${prodACarrito.precio}</td>
            <td> <button class='btn btn-light' onclick='eliminar(${prodACarrito.id})'>🗑️</button>`);
    } else {

        let posicion = carrito.findIndex(p => p.id == productoNuevo.id);
        console.log(posicion);
        carrito[posicion].cantidad += 1;

        document.getElementById(productoNuevo.id).innerHTML=carrito[posicion].cantidad;
    }
    document.querySelector("#gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);

}

function calcularTotal() {
    let suma = 0;
    for (const elemento of carrito) {
        suma = suma + (elemento.precio * elemento.cantidad);
    }
    return suma;
}

function eliminar(id){
    let indice=carrito.findIndex(prod => prod.id==id);
    carrito.splice(indice,1);
    let fila=document.getElementById(`fila${id}`);
    document.getElementById("tablabody").removeChild(fila);
    document.querySelector("#gastoTotal").innerText=(`Total: $ ${calcularTotal()}`);
}

function ordenar() {
    let seleccion = document.querySelector("#miSeleccion").value;
    console.log(seleccion)
    if (seleccion == "menor") {
        productosJSON.sort(function(a, b) {
            return a.precio - b.precio
        });
    } else if (seleccion == "mayor") {
        productosJSON.sort(function(a, b) {
            return b.precio - a.precio
        });
    } else if (seleccion == "alfabetico") {
        productosJSON.sort(function(a, b) {
            return a.nombre.localeCompare(b.nombre);
        });
    }
    document.querySelector(".milista").innerHTML="";
    renderizarProductos();
}


async function obtenerJSON() {
    const URLJSON="/productos.json"
    const resp=await fetch("productos.json")
    const data= await resp.json()
    productosJSON = data;
    renderizarProductos();
}



async function obtenerValorDolar() {
    const URLDOLAR = "https://api-dolar-argentina.herokuapp.com/api/dolarblue";
    const resp=await fetch(URLDOLAR)
    const data=await resp.json()
    dolarCompra = data.compra;
    obtenerJSON();
}




let finalizar=document.getElementById("finalizar");
finalizar.onclick=()=>{
    Swal.fire({
        title: 'Gracias por su compra!',
        text: 'Pronto recibirá su pedido',
        imageUrl: './img/logo.png',
        imageWidth: 150,
        imageHeight: 40,
        imageAlt: 'Custom image',
    });

    const fin=DateTime.now();
    const Interval=luxon.Interval;
    const tiempoTotal=Interval.fromDateTimes(inicio,fin);
    console.log("Tiempo de compra: "+tiempoTotal.length('minutes').toFixed(2)+" minutos!");
}