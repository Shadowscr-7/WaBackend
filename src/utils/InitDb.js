const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Importar los modelos
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Compaign = require('../models/Compaign');
const CouponCode = require('../models/CouponCode');
const Currency = require('../models/Currencies');
const Newsletter = require('../models/Newsletter');
const Notifications = require('../models/Notification');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const ProductReview = require('../models/ProductReview');
const Review = require('../models/Review');
const Shop = require('../models/Shop');
const User = require('../models/User');

// URLs de imágenes de Cloudinary
const cloudinaryUrls = [
  "https://res.cloudinary.com/dyy8hc876/image/upload/v1720204364/samples/man-on-a-street.jpg",
  "https://res.cloudinary.com/dyy8hc876/image/upload/v1720204366/samples/cup-on-a-table.jpg",
  "https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg"
];


// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/Ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Función para eliminar todos los documentos
const dropCollections = async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.drop();
  }
};

// Función para inicializar los datos
const initializeModels = async () => {
  const hashedPassword = await bcrypt.hash('password', 10);

  const user = new User({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: hashedPassword,
    gender: 'male',
    role: 'admin',
    phone: '123456789',
    otp: '123456',
    cover: {
      _id: 'sample-image-id',
      url: cloudinaryUrls[0],
      blurDataURL: cloudinaryUrls[0]
    },
    status: 'active',
    address: '123 Admin Street',
    city: 'Admin City',
    zip: '12345',
    country: 'Adminland',
    state: 'Admin State',
    commission: 0,
    wishlist: [],
    orders: [],
    recentProducts: [],
    shop: null,
  });

  const category = new Category({
    name: 'Electronics',
    metaTitle: 'Electronics Meta Title',
    description: 'Description of Electronics',
    metaDescription: 'Meta description of Electronics',
    slug: 'electronics',
    status: 'active',
    cover: {
      _id: 'sample-image-id',
      url: cloudinaryUrls[1],
      blurDataURL: cloudinaryUrls[1]
    },
    subCategories: [],
  });

  const subCategory = new SubCategory({
    name: 'Mobile Phones',
    metaTitle: 'Mobile Phones Meta Title',
    description: 'Description of Mobile Phones',
    metaDescription: 'Meta description of Mobile Phones',
    slug: 'mobile-phones',
    status: 'active',
    cover: {
      _id: 'sample-image-id',
      url: cloudinaryUrls[2],
      blurDataURL: cloudinaryUrls[2]
    },
    parentCategory: category._id,
  });

  category.subCategories.push(subCategory._id);

  // Guardar todos los documentos
  await user.save();
  await category.save();
  await subCategory.save();
};

const run = async () => {
  try {
    await dropCollections();
    await initializeModels();
    console.log('Database initialized successfully');
    process.exit();
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

run();
