const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const footerIva = document.getElementById("footer").getElementsByClassName("iva");
const footertotal = document.getElementById("footer").getElementsByClassName("total");
const templatedCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
    fetchdb();
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"));
        figCarrito();
    }
});
cards.addEventListener("click", (e) => {
    addCarrito(e);
});

items.addEventListener("click", (e) => {
    btnAccion(e);
});

const fetchdb = async () => {
    try {
        const res = await fetch("productos.json");
        const db = await res.json();
        // console.log(db);
        prodCards(db);
    } catch (error) {
        console.log(error);
    }
};

const prodCards = (db) => {
    // console.log(db);
    db.forEach((productos) => {
        // console.log(productos);
        templatedCard.querySelector("h5").textContent = productos.nombre;
        templatedCard.querySelector(".cod").textContent = productos.codigo;
        templatedCard.querySelector(".desc").textContent = productos.Descripcion;
        templatedCard.querySelector(".price").textContent = productos.Precio;
        templatedCard.querySelector("img").setAttribute("src", productos.imgurl);
        templatedCard.querySelector(".btn-dark").dataset.id = productos.codigo;

        const clone = templatedCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
};

const addCarrito = (e) => {
    // console.log(e.target);
    // console.log(e.target.classList.contains("btn-dark"));
    if (e.target.classList.contains("btn-dark")) {
        // console.log(e.target.parentElement);
        setCarrito(e.target.parentElement.parentElement);
    }
    e.stopPropagation();
};

const setCarrito = (objeto) => {
    // console.log(objeto);
    const producto = {
        codigo: objeto.querySelector(".btn-dark").dataset.id,
        nombre: objeto.querySelector(".card-title").textContent,
        precio: objeto.querySelector(".price").textContent,
        cantidad: 1,
    };
    if (carrito.hasOwnProperty(producto.codigo)) {
        producto.cantidad = carrito[producto.codigo].cantidad + 1;
    }

    carrito[producto.codigo] = { ...producto };
    figCarrito();
};

const figCarrito = () => {
    // console.log(carrito);
    items.innerHTML = "";
    Object.values(carrito).forEach((producto) => {
        templateCarrito.querySelector("th").textContent = producto.codigo;
        templateCarrito.querySelectorAll("td")[0].textContent = producto.nombre;
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.codigo;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.codigo;
        templateCarrito.querySelector("span").textContent =
            producto.cantidad * producto.precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);

    figFooter();

    localStorage.setItem("carrito", JSON.stringify(carrito));
};

const figFooter = () => {
    footer.innerHTML = "";
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `<th scope="row" colspan="5">
                            Carrito vacío - Añade un producto a tu carrito de compras
                            </th> `;
        return;
    }

    const nCantidad = Object.values(carrito).reduce(
        (acc, { cantidad }) => acc + cantidad,
        0
    );
    const nPrecio = Object.values(carrito).reduce(
        (acc, { cantidad, precio }) => acc + cantidad * precio,
        0
    );

    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnVaciar = document.getElementById("vaciar-carrito");
    btnVaciar.addEventListener("click", () => {
        carrito = {};
        figCarrito();
    });
};

const btnAccion = (e) => {
    // console.log(e.target);
    //Aumentar el carrito
    if (e.target.classList.contains("btn-info")) {
        // console.log(carrito[e.target.dataset.id]);
        // carrito[e.target.dataset.id];
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = { ...producto };
        figCarrito();
    }
    //Disminuir el carrito
    if (e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad--;
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        figCarrito();
    }
    e.stopPropagation();
};
