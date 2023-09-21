const mongoose = require("mongoose");
const express = require("express");
const replaceTemplate = require("./replaceTemplate.js");
const Food = require("./foodModel");
const fs = require("fs");
const notifier = require("node-notifier");
require("dotenv").config({ path: "./config.env" });
// String

//---------------------------------Body parser
const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: false }));
//----------^^^^^^^^^^^^^^^^^^^^^^^^^-------------
const app = express();
//Loading tamplates
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
// app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/templates/template-start.html");
});
app.get("/api/foods", async (req, res) => {
  let foodArr = await Food.find();
  if (req.query.group) {
    foodArr = await Food.find({ group: req.query.group }).sort(req.query.sort);
  } else if (!req.query.group && req.query.sort) {
    foodArr = await Food.find().sort(req.query.sort);
  }
  const cardsHtml = foodArr.map((el) => replaceTemplate(tempCard, el)).join("");
  const output = tempOverview.replace(/@ProductCard/, cardsHtml);
  res.end(output);
});
app.get("/api/new-food", (req, res) => {
  res.sendFile(__dirname + "/templates/template-add-new.html");
});
app.post("/api/foods/new-product", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const newFood = req.body;
  const createFood = await Food.create({ ...newFood });
  // res.end(replaceTemplate(tempProduct, createFood));
  res.redirect(`/api/foods/product?id=${createFood.id}`);
});
app.post("/api/foods/product", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  try {
    let searchBox = req.body.product_name.toLowerCase();
    searchBox = searchBox[0].toUpperCase() + searchBox.slice(1).toLowerCase();
    let product = await Food.find({ name: `${searchBox}` });
    product = product[0];
    // res.end(replaceTemplate(tempProduct, product));
    res.redirect(`/api/foods/product?id=${product.id}`);
  } catch (err) {
    notifier.notify({
      title: "No such document !",
      message: "Try onother one.",
    });
    res.redirect("/api/foods");
  }
});
app.get("/api/foods/product", async (req, res) => {
  const product = await Food.findById(req.query.id);
  res.end(replaceTemplate(tempProduct, product));
});
app.get("/api/foods/remove/:id", async (req, res) => {
  await Food.findByIdAndRemove(req.params.id);
  res.redirect("/api/foods");
});
app.get("/api/foods/:PASSWORD,:id", (req, res) => {
  const passcode = req.params.PASSWORD;

  if (passcode === "popupupanddown") res.redirect("https://www.youtube.com/watch?v=GDtiO29v1Ac");
  else if (passcode === "password") res.redirect("https://www.google.com/search?q=how+to+crack+password");
  else if (passcode === "Bozhidar_Ivanov33") res.json({ message: "Hidden info ♏" });
  else if (passcode === process.env.PASSWORD) res.redirect(`/api/foods/remove/${req.params.id}`);
  else res.redirect(`/api/foods/product?id=${req.params.id}`);
});
app.get("/forkify", (req, res) => {
  res.json({
    status: 200,
    message: "The page you are looking for is in development fase and will be ready soon!!!",
  });
});
module.exports = app;
