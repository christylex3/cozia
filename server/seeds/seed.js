const db = require('../config/connection');
const { User, Product, Category, Order } = require('../models');
const { faker } = require('@faker-js/faker');

db.once('open', async () => {
 
  try {
    // clean database
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
   
    //creating categories
    let createdCategories = [];
    for (let i = 0; i < 4; i++) {
        let category = {
            name: faker.helpers.unique(faker.commerce.department)
        }
        const newCategory = await Category.create(category);
        createdCategories.push(newCategory)  
        
    }

    //creating users. if consumer, then they will have an order
   for (let j = 0; j < 10; j++) {
    let email = faker.internet.email();

    let user = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: email,
        password: email,
        isSeller: faker.datatype.boolean(),
      }
     console.log(user);
    const newUser = await User.create(user);
   

    if (user.isSeller === false) {
       for (let k = 0; k < 1; k++) {
        let order = {
            user: newUser._id,
            shippingAddress: {
                street: faker.address.streetAddress(),
                city: faker.address.cityName(),
                zip: "12345",
                country: faker.address.country()
              },
              productOrder: [
                {
                  productName: faker.commerce.product(),
                  image: faker.internet.url(),
                  quantity: faker.datatype.number({ max: 20 }),
                  price: faker.commerce.price(),
                }
              ],
              tax: 3.0,
              shippingPrice: 5.0 ,
              isPaid: faker.datatype.boolean(),
              isDelivered: faker.datatype.boolean(),
              totalCost: faker.commerce.price(),
              purchaseDate: faker.date.past(),
              deliveryDate: faker.date.future()
        }
        const newOrder = await Order.create(order);
    }     
    } else {
        //creating products
        for (let l = 0; l < createdCategories.length; l++) {
          for (let m = 0; m < 4; m++) {
            let reviewSchema = {
                user: newUser._id,
                rating: 9.0,
                comment: "cool",
                createdAt: "1/1"
            }

            let product = {
                productName: faker.commerce.product(),
                description:faker.commerce.productDescription(),
                image: faker.internet.url(),
                price: faker.commerce.price(),
                sizes: "Small",
                countInStock: 5,
                inStock: faker.datatype.boolean(),
                reviews: [reviewSchema],
                totalRating: 9.0,
                numberReviews: 10,
                category: createdCategories[m]._id
            }
            console.log(createdCategories)
            const newProduct = await Product.create(product);
            

        }
      }
    }
   }
  

  console.log('Seeding complete! 🌱');
  process.exit(0);
  
    
  } catch (err) {
    throw err;
  }
});