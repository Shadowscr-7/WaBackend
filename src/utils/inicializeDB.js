const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Conexión a MongoDB
mongoose.connect('mongodb+srv://shadowscr:49618553Bmb328873@waecommerce.oxqib07.mongodb.net/WAEcommerce?retryWrites=true&w=majority&appName=WAEcommerce')
  .then(() => {
    console.log('Connected to MongoDB');
    initializeModels();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

// Definición de modelos

// Brand
const BrandSchema = new mongoose.Schema({
  logo: {
    _id: { type: String, required: [true, 'image-id-required-error'] },
    url: { type: String, required: [true, 'image-url-required-error'] },
    blurDataURL: { type: String, required: [true, 'image-blur-data-url-required-error'] }
  },
  name: { type: String, required: [true, 'Name is required.'] },
  metaTitle: { type: String, required: [true, 'Meta title is required.'] },
  description: { type: String, required: [true, 'Description is required.'] },
  metaDescription: { type: String, required: [true, 'Meta description is required.'] },
  slug: { type: String, unique: true, required: [true, 'Slug is required.'] },
  status: { type: String, required: [true, 'Status is required.'] }
}, { timestamps: true });

const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);

// Category
const CategorySchema = new mongoose.Schema({
  cover: {
    _id: { type: String, required: [true, 'image-id-required-error'] },
    url: { type: String, required: [true, 'image-url-required-error'] },
    blurDataURL: { type: String, required: [true, 'image-blur-data-url-required-error'] }
  },
  name: { type: String, required: [true, 'Name is required.'], maxlength: [100, 'Name cannot exceed 100 characters.'] },
  metaTitle: { type: String, required: [true, 'Meta title is required.'], maxlength: [100, 'Meta title cannot exceed 100 characters.'] },
  description: { type: String, required: [true, 'Description is required.'], maxlength: [500, 'Description cannot exceed 500 characters.'] },
  metaDescription: { type: String, required: [true, 'Meta description is required.'], maxlength: [200, 'Meta description cannot exceed 200 characters.'] },
  slug: { type: String, unique: true, required: true },
  status: { type: String, required: true },
  subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }]
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

// Campaign
const CompaignSchema = new mongoose.Schema({
  cover: {
    _id: { type: String, required: [true, 'image-id-required-error'] },
    url: { type: String, required: [true, 'image-url-required-error'] },
    blurDataURL: { type: String, required: [true, 'image-blur-data-url-required-error'] }
  },
  name: { type: String, required: [true, 'Name is required.'], maxlength: [100, 'Name cannot exceed 100 characters.'] },
  metaTitle: { type: String, required: [true, 'Meta title is required.'], maxlength: [100, 'Meta title cannot exceed 100 characters.'] },
  description: { type: String, required: [true, 'Description is required.'], maxlength: [500, 'Description cannot exceed 500 characters.'] },
  metaDescription: { type: String, required: [true, 'Meta description is required.'], maxlength: [200, 'Meta description cannot exceed 200 characters.'] },
  slug: { type: String, unique: true, required: true },
  products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  discountType: { type: String, enum: ['fixed', 'percent'], required: true },
  discount: { type: Number, required: true },
  status: { type: String, default: 'enable', enum: ['enable', 'disable'], required: true }
}, { timestamps: true });

const Compaign = mongoose.models.Compaign || mongoose.model('Compaign', CompaignSchema);

// CouponCode
const CouponCodeSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required.'] },
  code: { type: String, minlength: 4, unique: true, required: [true, 'Code is required.'] },
  discount: { type: Number, minlength: 4, required: [true, 'Discount is required.'] },
  expire: { type: Date, default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) },
  description: { type: String },
  type: { type: String, enum: ['percent', 'fixed'], required: [true, 'Type is required.'] },
  usedBy: [{ type: String }]
}, { timestamps: true });

const CouponCode = mongoose.models.CouponCode || mongoose.model('CouponCode', CouponCodeSchema);

// Currency
const CurrencySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required.'] },
  code: { type: String, unique: true, required: [true, 'Code is required.'] },
  country: { type: String, minlength: 4, required: [true, 'Country is required.'] },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  rate: { type: Number }
}, { timestamps: true });

const Currency = mongoose.models.Currency || mongoose.model('Currency', CurrencySchema);

// Newsletter
const NewsletterSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: [true, 'email-required'] }
}, { timestamps: true });

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);

// Notifications
const NotificationsSchema = new mongoose.Schema({
  opened: { type: Boolean, required: [true, 'Open is required.'] },
  title: { type: String, required: [true, 'Title is required.'] },
  orderId: { type: String, required: [true, 'Order Id is required.'] },
  cover: {
    _id: { type: String },
    url: { type: String }
  },
  city: { type: String, required: [true, 'City is required.'] },
  paymentMethod: { type: String, required: [true, 'Payment Method is required.'], enum: ['Stripe', 'PayPal', 'COD'] }
}, { timestamps: true });

const Notifications = mongoose.models.Notifications || mongoose.model('Notifications', NotificationsSchema);

// Order
const OrderSchema = new mongoose.Schema({
  paymentMethod: { type: String, required: [true, 'Payment Method is required.'], enum: ['Stripe', 'PayPal', 'COD'] },
  orderNo: { type: String, required: [true, 'Order No is required.'] },
  paymentId: { type: String },
  subTotal: { type: Number, required: [true, 'Subtotal is required.'] },
  total: { type: Number, required: [true, 'Total is required.'] },
  totalItems: { type: Number, required: [true, 'Total items is required.'] },
  shipping: { type: Number, required: [true, 'ShippingFee is required.'] },
  discount: { type: Number },
  currency: { type: String, required: [true, 'currency is required.'] },
  conversionRate: { type: Number, required: [true, 'Conversion rate is required.'] },
  status: { type: String, enum: ['pending', 'on the way', 'delivered', 'canceled', 'returned'] },
  items: { type: Array },
  note: { type: String },
  user: {
    _id: { type: mongoose.Types.ObjectId },
    firstName: { type: String, required: [true, 'First name is required.'] },
    lastName: { type: String, required: [true, 'Last name is required.'] },
    email: { type: String, required: [true, 'Email is required.'] },
    phone: { type: String, required: [true, 'Phone is required.'] },
    address: { type: String, required: [true, 'Address is required.'] },
    city: { type: String, required: [true, 'City is required.'] },
    zip: { type: String, required: [true, 'Postal code is required.'] },
    country: { type: String, required: [true, 'Country is required.'] },
    state: { type: String, required: [true, 'State is required.'] }
  }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// Payment
const paymentSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  total: { type: Number, required: true },
  totalCommission: { type: Number, required: true },
  totalIncome: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'hold'], default: 'pending' },
  paidAt: { type: Date },
  tip: { type: Number },
  type: { type: String, enum: ['monthly', 'other'], default: 'monthly' },
  date: { type: Date, default: Date.now },
  message: String
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

// Product
const productSchema = new mongoose.Schema({
  name: { type: String },
  code: { type: String },
  status: { type: String },
  isFeatured: { type: Boolean },
  brand: { type: mongoose.Types.ObjectId, ref: 'Brand' },
  likes: { type: Number },
  description: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  slug: { type: String, unique: true },
  category: { type: mongoose.Types.ObjectId, ref: 'Category', required: [true, 'please provide a category id'] },
  subCategory: { type: mongoose.Types.ObjectId, ref: 'SubCategory', required: [true, 'please provide a sub category id'] },
  gender: { type: String },
  tags: [String],
  sku: { type: String, required: [true, 'SKU is required.'] },
  price: { type: Number, required: [true, 'Price is required.'] },
  priceSale: { type: Number, required: [true, 'Sale price is required.'] },
  oldPriceSale: { type: Number },
  available: { type: Number, required: [true, 'Available quantity is required.'] },
  sold: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Types.ObjectId, ref: 'ProductReview' }],
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  images: [{
    url: { type: String, required: [true] },
    _id: { type: String, required: [true] },
    blurDataURL: { type: String, required: [true, 'image-blur-data-url-required-error'] }
  }],
  colors: [String],
  sizes: [String]
}, { timestamps: true, strict: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// ProductReview
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required.'] },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: [true, 'Product is required.'] },
  review: { type: String, required: [true, 'ProductReview is required.'] },
  rating: { type: Number, required: [true, 'Rating is required.'] },
  isPurchased: { type: Boolean, required: [true, 'isPurchased is required.'] },
  images: [{
    url: { type: String, required: [true, 'image-id-required-error'] },
    blurDataURL: { type: String, required: [true, 'image-blur-data-url-required-error'] }
  }]
}, { timestamps: true });

const ProductReview = mongoose.models.ProductReview || mongoose.model('ProductReview', reviewSchema);

// Review
const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  designation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// Shop
const ShopSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  logo: {
    _id: { type: String, required: [true, 'image-id-required-error'] },
    url: { type: String, required: [true, 'image-url-required-error'] },
    blurDataURL: { type: String, required: [true, 'image-blur-data-url-required-error'] }
  },
  cover: {
    _id: { type: String, required: [true, 'image-id-required-error'] },
    url: { type: String, required: [true, 'image-url-required-error'] },
    blurDataURL: { type: String, required: [true, 'image-blur-data-url-required-error'] }
  },
  title: { type: String, required: [true, 'Name is required.'], maxlength: [100, 'Name cannot exceed 100 characters.'] },
  metaTitle: { type: String, required: [true, 'Meta title is required.'], maxlength: [100, 'Meta title cannot exceed 100 characters.'] },
  description: { type: String, required: [true, 'Description is required.'], maxlength: [500, 'Description cannot exceed 500 characters.'] },
  metaDescription: { type: String, required: [true, 'Meta description is required.'], maxlength: [200, 'Meta description cannot exceed 200 characters.'] },
  slug: { type: String, unique: true, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  phone: { type: String, unique: true, required: true },
  approved: { type: Boolean, required: true, default: false },
  approvedAt: { type: Date },
  website: { type: String },
  status: { type: String, enum: ['approved', 'pending', 'in review', 'action required', 'blocked', 'rejected'], required: true },
  message: { type: String },
  products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
  paymentInfo: {
    holderName: { type: String, required: true },
    holderEmail: { type: String, required: true },
    bankName: { type: String, required: true },
    AccountNo: { type: Number, required: true }
  },
  address: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    streetAddress: { type: String, required: true }
  }
}, { timestamps: true });

const Shop = mongoose.models.Shop || mongoose.model('Shop', ShopSchema);

// SubCategory
const SubCategorySchema = new mongoose.Schema({
  cover: {
    _id: { type: String, required: [true, 'image-id-required-error'] },
    url: { type: String, required: [true, 'image-url-required-error'] },
    blurDataURL: { type: String, required: [true, 'image-blur-data-url-required-error'] }
  },
  name: { type: String, required: [true, 'Name is required.'], maxlength: [100, 'Name cannot exceed 100 characters.'] },
  metaTitle: { type: String, required: [true, 'Meta Title is required.'], maxlength: [100, 'Meta Title cannot exceed 100 characters.'] },
  description: { type: String, required: [true, 'Description is required.'], maxlength: [500, 'Description cannot exceed 500 characters.'] },
  metaDescription: { type: String, required: [true, 'Meta Description is required.'], maxlength: [200, 'Meta Description cannot exceed 200 characters.'] },
  slug: { type: String, required: true },
  status: { type: String, required: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', SubCategorySchema);

// User
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'Please enter a firstName'] },
  lastName: { type: String, required: [true, 'Please enter a lastName'] },
  email: { type: String, required: [true, 'Please enter an email'], unique: true },
  password: { type: String, select: false, required: [true, 'Please enter a password'], minlength: 8 },
  gender: { type: String, enum: ['male', 'female', 'other'], required: [true, 'Please enter a gender'] },
  cover: {
    _id: { type: String },
    url: { type: String },
    blurDataURL: { type: String }
  },
  wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
  shop: { type: mongoose.Types.ObjectId, ref: 'Shop' },
  recentProducts: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
  phone: { type: String, required: [true, 'Please provide a Phone Number.'], maxlength: [20, 'Phone cannot be more than 20 characters.'] },
  status: { type: String },
  address: { type: String },
  city: { type: String },
  zip: { type: String },
  country: { type: String },
  state: { type: String },
  about: { type: String },
  isVerified: { type: Boolean, default: false },
  otp: { type: String, required: true },
  lastOtpSentAt: { type: Date },
  commission: { type: Number },
  role: { type: String, enum: ['super admin', 'admin', 'user', 'vendor'], required: true }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Eliminar las colecciones antes de inicializar
async function clearCollections() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

// Inicialización de modelos
async function initializeModels() {
  try {
    await clearCollections();
    console.log('Collections cleared');

    const exampleBrand = new Brand({
      logo: { _id: 'exampleImageId', url: 'https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg', blurDataURL: 'data:image/png;base64,...' },
      name: 'Example Brand',
      metaTitle: 'Example Meta Title',
      description: 'This is an example description for the brand.',
      metaDescription: 'This is an example meta description.',
      slug: 'example-brand',
      status: 'active'
    });

    const exampleCategory = new Category({
      cover: { _id: 'exampleImageId', url: 'https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg', blurDataURL: 'data:image/png;base64,...' },
      name: 'Example Category',
      metaTitle: 'Example Meta Title',
      description: 'This is an example description for the category.',
      metaDescription: 'This is an example meta description.',
      slug: 'example-category',
      status: 'active'
    });

    const exampleCompaign = new Compaign({
      cover: { _id: 'exampleImageId', url: 'https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg', blurDataURL: 'data:image/png;base64,...' },
      name: 'Example Compaign',
      metaTitle: 'Example Meta Title',
      description: 'This is an example description for the compaign.',
      metaDescription: 'This is an example meta description.',
      slug: 'example-compaign',
      products: [],
      startDate: new Date(),
      endDate: new Date(),
      discountType: 'percent',
      discount: 10,
      status: 'enable'
    });

    const exampleCouponCode = new CouponCode({
      name: 'Example Coupon',
      code: 'EXAMPLECODE',
      discount: 10,
      type: 'percent',
      usedBy: []
    });

    const exampleCurrency = new Currency({
      name: 'Example Currency',
      code: 'EXC',
      country: 'Example Country',
      status: 'active',
      rate: 1
    });

    const exampleNewsletter = new Newsletter({
      email: 'example@example.com'
    });

    const exampleNotification = new Notifications({
      opened: false,
      title: 'Example Notification',
      orderId: 'exampleOrderId',
      cover: { _id: 'exampleImageId', url: 'https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg' },
      city: 'Example City',
      paymentMethod: 'Stripe'
    });

    const exampleOrder = new Order({
      paymentMethod: 'Stripe',
      orderNo: 'ORD12345',
      paymentId: 'PAY12345',
      subTotal: 100,
      total: 110,
      totalItems: 1,
      shipping: 10,
      discount: 0,
      currency: 'USD',
      conversionRate: 1,
      status: 'pending',
      items: [],
      note: 'Example note',
      user: {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Example St',
        city: 'Example City',
        zip: '12345',
        country: 'Example Country',
        state: 'Example State'
      }
    });

    const examplePayment = new Payment({
      shop: new mongoose.Types.ObjectId(),
      orders: [],
      total: 1000,
      totalCommission: 100,
      totalIncome: 900,
      status: 'pending',
      paidAt: new Date(),
      tip: 0,
      type: 'monthly',
      date: new Date(),
      message: 'Example payment message'
    });

    const exampleProduct = new Product({
      name: 'Example Product',
      code: 'EXPROD123',
      status: 'available',
      isFeatured: true,
      brand: new mongoose.Types.ObjectId(),
      likes: 0,
      description: 'This is an example product description.',
      metaTitle: 'Example Product Meta Title',
      metaDescription: 'Example Product Meta Description',
      slug: 'example-product',
      category: new mongoose.Types.ObjectId(),
      subCategory: new mongoose.Types.ObjectId(),
      gender: 'unisex',
      tags: ['example', 'product'],
      sku: 'EXPROD123',
      price: 100,
      priceSale: 90,
      oldPriceSale: 100,
      available: 10,
      sold: 0,
      reviews: [],
      shop: new mongoose.Types.ObjectId(),
      images: [{ url: 'https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg', _id: 'exampleImageId', blurDataURL: 'data:image/png;base64,...' }],
      colors: ['red', 'blue'],
      sizes: ['S', 'M', 'L']
    });

    const exampleProductReview = new ProductReview({
      user: new mongoose.Types.ObjectId(),
      product: new mongoose.Types.ObjectId(),
      review: 'This is an example product review.',
      rating: 5,
      isPurchased: true,
      images: [{ url: 'https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg', blurDataURL: 'data:image/png;base64,...' }]
    });

    const exampleReview = new Review({
      user: new mongoose.Types.ObjectId(),
      rating: 5,
      review: 'This is an example review.',
      designation: 'Customer'
    });

    const exampleShop = new Shop({
      vendor: new mongoose.Types.ObjectId(),
      logo: { _id: 'exampleImageId', url: 'https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg', blurDataURL: 'data:image/png;base64,...' },
      cover: { _id: 'exampleImageId', url: 'https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg', blurDataURL: 'data:image/png;base64,...' },
      title: 'Example Shop',
      metaTitle: 'Example Shop Meta Title',
      description: 'This is an example shop description.',
      metaDescription: 'Example Shop Meta Description',
      slug: 'example-shop',
      followers: [],
      phone: '1234567890',
      approved: true,
      approvedAt: new Date(),
      website: 'http://example.com',
      status: 'approved',
      message: 'Example shop message',
      products: [],
      paymentInfo: {
        holderName: 'John Doe',
        holderEmail: 'john.doe@example.com',
        bankName: 'Example Bank',
        AccountNo: 123456789
      },
      address: {
        country: 'Example Country',
        city: 'Example City',
        state: 'Example State',
        streetAddress: '123 Example St'
      }
    });

    const exampleSubCategory = new SubCategory({
      cover: { _id: 'exampleImageId', url: 'https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg', blurDataURL: 'data:image/png;base64,...' },
      name: 'Example SubCategory',
      metaTitle: 'Example Meta Title',
      description: 'This is an example description for the subcategory.',
      metaDescription: 'Example Meta Description',
      slug: 'example-subcategory',
      status: 'active',
      parentCategory: new mongoose.Types.ObjectId()
    });

    const exampleUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'examplepassword',
      gender: 'male',
      cover: { _id: 'exampleImageId', url: 'https://res.cloudinary.com/dyy8hc876/image/upload/v1720204370/cld-sample-5.jpg', blurDataURL: 'data:image/png;base64,...' },
      wishlist: [],
      orders: [],
      shop: new mongoose.Types.ObjectId(),
      recentProducts: [],
      phone: '1234567890',
      status: 'active',
      address: '123 Example St',
      city: 'Example City',
      zip: '12345',
      country: 'Example Country',
      state: 'Example State',
      about: 'This is an example user.',
      isVerified: true,
      otp: '123456',
      lastOtpSentAt: new Date(),
      commission: 10,
      role: 'user'
    });

    const documents = [
      exampleBrand,
      exampleCategory,
      exampleCompaign,
      exampleCouponCode,
      exampleCurrency,
      exampleNewsletter,
      exampleNotification,
      exampleOrder,
      examplePayment,
      exampleProduct,
      exampleProductReview,
      exampleReview,
      exampleShop,
      exampleSubCategory,
      exampleUser
    ];

    await Promise.all(documents.map(doc => doc.save()));
    console.log('All example documents saved successfully');
  } catch (error) {
    console.error('Error saving example documents', error);
  } finally {
    mongoose.connection.close();
  }
}