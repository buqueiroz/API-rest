const express = require('express');
const { randomUUID } = require('crypto')
const fs = require('fs');

const app = express();

app.use(express.json())

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err)
    } else {
        products = JSON.parse(data);
    }
});

/** 
    POST => inserir um dado
    GET => Buscar um ou mais dados 
    PUT => Alterar um dado
    DELETE => Remover um dado
*/

/**
 * Body => Sempre que eu quiser enviar dados para minha aplicacao
 * Params => /product/2342382767655
 * Query => /product?id=726326376352736&value=8236232635
 */

// INSERIR DADO
app.post("/products", (request, response) => {
    // Nome e preço => name e price

    const { name, price } = request.body;

    const product = {
        name,
        price,
        id: randomUUID()
    }

    products.push(product);

    productFile();

    return response.json(product);
});

// BUSCAR DADOS
app.get("/products", (request, response) => {
    return response.json(products)
});

// BUSCAR DADOS PELO ID
app.get("/products/:id", (request, response) => {
    const { id } = request.params;
    const product = products.find((product) => product.id === id);
    return response.json(product);
})

// ALTERAR UM DADO
app.put("/products/:id", (request, response) => {
    const { id } = request.params;
    const { name, price } = request.body;

    const productIndex = products.findIndex((product) => product.id === id);
    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    }

    productFile();

    return response.json({ message: "Produto alterado com sucesso" })
});



// DELETAR UM DADO
app.delete("/products/:id", (request, response) =>{
    const { id } = request.params;
    
    const productIndex = products.findIndex((product) => product.id === id);

    products.splice(productIndex, 1);

    productFile();

    return response.json({ meassage: "Produto removido com sucesso!" })
});


function productFile() {
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if(err) {
            console.log(err)
        } else {
            console.log("Produto inserido")
        }
    });
}

app.listen(4002, () => console.log("Servidor Online"))