const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(err => {
        console.log('Error connecting to MongoDB\n', err)
    });
    
const rand = (x) => Math.floor(Math.random() * x);

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const index = rand(1000);
        const camp = new Campground({
            location: `${cities[index].city}, ${cities[index].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/random/?campground",
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas, dolores?',
            price: (rand(200) + 300),
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log('Finished. Closing Mongoose connection');
    mongoose.connection.close();
})