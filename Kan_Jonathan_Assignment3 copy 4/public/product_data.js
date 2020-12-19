
//Set products variable to an array of all the data in my store//
//all iamges are from google//
var products_array = [
    {
    'type': "vegetables",
    },
    {
    'type': "fruits",
    },
    {
    'type': "merch",
    }
]
var vegetables = [
    { 
        "name": "Lettuce",//Product 1
        "price": 1.75,
        "image": "./images/vegetables/lettuce.jpg",
    },
    { 
        "name": "Broccoli",//Product 2
        "price": 1.00,
        "image": "./images/vegetables/broccoli.PNG",
    },
    { 
        "name": "Garlic",//Product 3
        "price": 0.50,
        "image": "./images/vegetables/Garlic.PNG",
    },
    { 
        "name": "Carrot",//Product 4
        "price": 1.25,
        "image": "./images/vegetables/carrot.PNG",
    },
    { 
        "name": "Tomato",//Product 5
        "price": 2.00,
        "image": "./images/vegetables/tomato.PNG",
    }
]
var fruits = [
    {
        "name":"Apple",//Product 1
        "price": 1.50,
        "image": './images/fruits/apple.png'
    },
    {
        "name":"Banana",//Product 2
        "price": 2.00,
        "image": './images/fruits/Banana.jpg'
    },    {
        "name":"Mango",//Product 3
        "price": 2.50,
        "image": './images/fruits/mango.jpg'
    },    {
        "name":"Pineapple",//Product 4
        "price": 1.00,
        "image": './images/fruits/pineapple.jpg'
    },    {
        "name":"Watermelon",//Product 5
        "price": 1.75,
        "image": './images/fruits/watermelon.jpg'
    }
]
var merch = [
    {
        "name":"Shirt",//Product 1
        "price": 9.99,
        "image": './images/merch/shirt.png'
    },    {
        "name":"Cup",//Product 2
        "price": 5.00,
        "image": './images/merch/cup.jpg'
    },    {
        "name":"Hat",//Product 3
        "price": 5.50,
        "image": './images/merch/hat.png'
    }

];
var allProducts = {
    "vegetables": vegetables,
    "fruits": fruits,
    "merch": merch
  }

if (typeof module != 'undefined') { //module is defined
    module.exports.allProducts = allProducts;
}
