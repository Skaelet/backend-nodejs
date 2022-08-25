const socket = io();

socket.on("connect", () => {
    console.log(socket.id);
});

socket.on('product', (product) => {
    const products = document.getElementById('products');
    const newProduct = `<div class="products">
                        <div class="product-img"><img src="<%=item.thumbnail %>"/></div>
                        <span><${product.title}</span> 
                        <span>${product.price}</span>
                        <span>${product.thumbnail}</span>
                        </div>`
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