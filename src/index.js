const express = require("express");

const app = express();

const connect = require("./configs/db");

const productController = require("./controllers/products.controller");

app.use(express.json());

app.use("/products", productController);

app.listen("4636", async () => {
    await connect();
    console.log("woohoo I am listening on 4636");
})