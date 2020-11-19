// Creaying the array of products and took this from SmartPhoneProducts3

var products = [
    {
        //Product 1
    "product": "Pearl Earring",
    "price": 35.00,
    "image": "./images/earring.jpg" // image is from en route jewelry webiste//
    },
    {
        //Product 2
    "product": "Pearl Necklace",
    "price": 45.00,
    "image": "./images/necklace.jpg" // image is from en route jewelry webiste//
    },
    {
        //Product 3
    "product" : "Pearl Bracelet",
    "price": 20.00,
    "image": "./images/bracelet.jpg" // image is from en route jewelry webiste//
    },
    {
        //Product 4
    "product": "Pearl Ring",
    "price": 18.00,
    "image": "./images/ring.jpg" // image is from en route jewelry webiste//
    },
    {
        //Product 5
    "product": "Pearl Hair Clip",
    "price": 12.00,
    "image": "./images/clip.jpg" // image is from en route jewelry webiste//
        }
];


if(typeof module != 'undefined') { //if the type of the module is defined
    module.exports.products = products; //export the product_data
  }
