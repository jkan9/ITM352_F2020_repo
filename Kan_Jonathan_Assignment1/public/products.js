
//Set products variable to an array of all the data in my store
var products = [
    { 
        "product": "Lettuce",
        "price": 1.75,
        "image": "./images/vegetables/lettuce.jpg",
    },
    { 
        "product": "Broccoli",
        "price": 1.00,
        "image": "./images/vegetables/broccoli.PNG",
    },
    { 
        "product": "Garlic",
        "price": 0.50,
        "image": "./images/vegetables/Garlic.PNG",
    },
    { 
        "product": "Carrot",
        "price": 1.25,
        "image": "./images/vegetables/carrot.PNG",
    },
    { 
        "product": "Tomato",
        "price": 2.00,
        "image": "./images/vegetables/tomato.PNG",
    },

    {
        "product":"Apple",
        "price": 1.50,
        "image": './images/fruits/apple.png'
    },
    {
        "product":"Banana",
        "price": 2.00,
        "image": './images/fruits/Banana.jpg'
    },    {
        "product":"Mango",
        "price": 2.50,
        "image": './images/fruits/mango.jpg'
    },    {
        "product":"Pineapple",
        "price": 1.00,
        "image": './images/fruits/pineapple.jpg'
    },    {
        "product":"Watermelon",
        "price": 1.75,
        "image": './images/fruits/watermelon.jpg'
    },

];


if (typeof module != 'undefined') {
    module.exports.products = products;
}
