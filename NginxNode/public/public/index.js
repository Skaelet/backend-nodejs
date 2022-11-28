const socket = io();
const listMessages = document.getElementById('messages__list');

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

const sendMessage = () => {
	const message = {
		date: getDate(),
		author: {
			id: document.getElementById('email').value,
			nombre: document.getElementById('nombre').value,
			apellido: document.getElementById('apellido').value,
			edad: document.getElementById('edad').value,
			alias: document.getElementById('alias').value,
			avatar: document.getElementById('avatar').value,
		},
		text: document.getElementById('text').value,
	}

	socket.emit('message', message);

	return false;
}

const cargarMensajes = (denormalizeMessages) => {
	denormalizeMessages.chats.length != 0
	? listMensajes(denormalizeMessages)
	: listMensajesEmpty()
}

const listMensajes = (denormalizeMessages) => {
	listMessages.innerHTML = "<h3>Chat</h3>";
	denormalizeMessages.chats.forEach(m => {
		const messagesListMessage = document.createElement('div');
		messagesListMessage.className = 'messages__list--message';
		messagesListMessage.innerHTML = 
		`
				<span>${m.author.id}</span>
				<span>${m.date}</span>
				<span>${m.text}</span>
		`
		
		listMessages.appendChild(messagesListMessage);
	})
}

const listMensajesEmpty = () => {
	const messagesListMessage = document.createElement('div');
	messagesListMessage.className = 'messages__list--message';
	messagesListMessage.innerHTML = "<h5>No hay mensajes<h5>";
	listMessages.appendChild(messagesListMessage);
}

socket.on('message', async(res) => {
	const { result, entities } = await res;
	console.log(await res);

	const user = new normalizr.schema.Entity("users");
	const messages = new normalizr.schema.Entity("mensajes", {
		author: user,
	});
	const chats = new normalizr.schema.Entity("chats", { chats: [messages] });
	const denormalizeMessages = new normalizr.denormalize(result, chats, entities);

	cargarMensajes(await denormalizeMessages);

	console.log(denormalizeMessages.chats);

	const titleChat = document.getElementsByTagName("h3");
	titleChat.innerHTML = denormalizeMessages.chats.length != 0
		? `<h3>Chat - Compresión(${Math.floor(JSON.stringify(res).length/JSON.stringify(denormalizeMessages).length*100)}%)</h3>`
		: `<h3>Chat</h3>`
})

const buttonLogout = document.getElementById('logout');

buttonLogout.addEventListener('click', logout);

function logout() {
	location.href = '/logout';
}

//[DD/MM/YYYY hh:mm:ss]
const getDate = () => {
	const date = new Date();
	return date.toLocaleString('en-GB');
}

