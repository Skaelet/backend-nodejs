const socket = io();

socket.on("connect", () => {
    console.log(socket.id);
});

socket.on('product', ({ id, title, price, thumbnail }) => {
    const products = document.getElementById('products');
    const productsEmpty = document.getElementById('products--empty');
    productsEmpty && products.removeChild(productsEmpty);
    const newProduct = document.createElement('div');
    newProduct.className = 'products';
    newProduct.innerHTML = 
        `
        <div class="product-img"><img src="${thumbnail}"/></div>
        <span>${id}</span>
        <span>${title}</span> 
        <span>${price}</span>
        `
    products.appendChild(newProduct);
})

const sendProduct = () => {
    const product = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value,
    }

    console.log('enviando...');

    socket.emit('product', product);

    return false;
}

const sendMessaje = () => {
    const messaje = {
        date: getDate(),
        email: document.getElementById('email').value,
        messaje: document.getElementById('messaje').value,
    }

    socket.emit('messaje', messaje);

    return false;
}

socket.on('messaje', ({ date, email, messaje }) => {
    const messajes = document.getElementById('messajes__list');
    const messajeEmpty = document.getElementById('messaje--empty');
    messajeEmpty && messajes.removeChild(messajeEmpty)
    const messajesListMessaje = document.createElement('div');
    messajesListMessaje.className = 'messajes__list--messaje';
    messajesListMessaje.innerHTML = 
        `
            <span>${email}</span>
            <span>${date}</span>
            <span>${messaje}</span>
        `
    messajes.appendChild(messajesListMessaje);
})
//[DD/MM/YYYY hh:mm:ss]
const getDate = () => {
    const date = new Date();
    return date.toLocaleString('en-GB');
}