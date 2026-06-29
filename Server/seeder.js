const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Models
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Cart = require("./models/Cart");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopez")
  .then(() => console.log("Database connected for seeding..."))
  .catch((err) => {
    console.error("Database connection error during seeding:", err);
    process.exit(1);
  });

// Demo Data
const users = [
  {
    name: "Demo Admin User",
    email: "admin@shopez.com",
    password: "adminpassword",
    role: "admin",
    phoneNumber: "9876543210",
  },
  {
    name: "Demo Customer User",
    email: "customer@shopez.com",
    password: "customerpassword",
    role: "user",
    phoneNumber: "9988776655",
    addresses: [
      {
        street: "123, Tech Boulevard, Sector 4",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India",
      }
    ]
  }
];

const products = [
  {
    name: "iPhone 15 Pro Max",
    description: "Experience the ultimate iPhone with a strong and light titanium design, a new Action button, powerful camera upgrades, and the A17 Pro chip for next-level mobile gaming.",
    price: 159900,
    category: "Mobiles",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    stock: 12,
    rating: 4.8,
    numReviews: 2,
    isFeatured: true,
    specifications: [
      { name: "Display", value: "6.7-inch Super Retina XDR OLED" },
      { name: "Chip", value: "A17 Pro with 6-core GPU" },
      { name: "Camera", value: "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto" },
      { name: "Storage", value: "256 GB" },
    ],
    reviews: [
      { name: "Aarav Mehta", rating: 5, comment: "Absolutely stunning phone. The camera zoom is incredible!", user: null },
      { name: "Priya Sharma", rating: 4.6, comment: "Battery life is excellent, though it is quite expensive.", user: null }
    ]
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity, and possibility.",
    price: 129900,
    category: "Mobiles",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800",
    stock: 8,
    rating: 4.7,
    numReviews: 1,
    isFeatured: true,
    specifications: [
      { name: "Display", value: "6.8-inch Dynamic AMOLED 2X, 120Hz" },
      { name: "Processor", value: "Snapdragon 8 Gen 3 for Galaxy" },
      { name: "Camera", value: "200MP Main + 50MP + 12MP + 10MP Quad Camera" },
      { name: "Battery", value: "5000 mAh with 45W Fast Charging" },
    ],
    reviews: [
      { name: "Rohan Das", rating: 5, comment: "Galaxy AI features are very helpful. The screen is so bright!", user: null }
    ]
  },
  {
    name: "MacBook Pro 16-inch M3 Max",
    description: "The MacBook Pro blasts forward with the M3 Max chip. Built on 3-nanometer technology and featuring an all-new GPU architecture, it's the most advanced chip ever built for a personal computer.",
    price: 349900,
    category: "Laptops",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    stock: 5,
    rating: 4.9,
    numReviews: 1,
    isFeatured: true,
    specifications: [
      { name: "Chip", value: "Apple M3 Max (16-core CPU, 40-core GPU)" },
      { name: "RAM", value: "36 GB Unified Memory" },
      { name: "Storage", value: "1 TB SSD" },
      { name: "Display", value: "16.2-inch Liquid Retina XDR" },
    ],
    reviews: [
      { name: "Kunal Sen", rating: 5, comment: "An absolute beast for video rendering and development. Quiet and fast.", user: null }
    ]
  },
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Our best noise-cancelling headphones redefine distraction-free listening with industry-leading Active Noise Cancellation and exceptional audio quality.",
    price: 29990,
    category: "Accessories",
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    stock: 25,
    rating: 4.6,
    numReviews: 2,
    isFeatured: true,
    specifications: [
      { name: "Noise Cancelling", value: "Industry-leading ANC with Auto NC Optimizer" },
      { name: "Battery Life", value: "Up to 30 hours of playback" },
      { name: "Driver Unit", value: "30mm specially designed dome driver" },
      { name: "Connectivity", value: "Bluetooth 5.2, Multipoint Connection" },
    ],
    reviews: [
      { name: "Nisha Patel", rating: 5, comment: "The noise cancellation is magic. Comfort is top-tier.", user: null },
      { name: "Vikram Malhotra", rating: 4.2, comment: "Great sound, but the case is bulkier than the XM4.", user: null }
    ]
  },
  {
    name: "Apple iPad Pro 12.9-inch",
    description: "iPad Pro. Astonishing performance. Incredibly advanced displays. Superfast wireless connectivity. Next-level Apple Pencil capabilities. Powered by the M2 chip.",
    price: 119900,
    category: "Tablets",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    stock: 14,
    rating: 4.5,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Chip", value: "Apple M2 Chip" },
      { name: "Display", value: "12.9-inch Liquid Retina XDR Mini-LED" },
      { name: "Camera", value: "12MP Wide + 10MP Ultra Wide + LiDAR Scanner" },
      { name: "Storage", value: "128 GB" },
    ],
    reviews: [
      { name: "Tanvi Rao", rating: 4.5, comment: "Best tablet in the market, M2 makes it feel like a desktop.", user: null }
    ]
  },
  {
    name: "Apple Watch Series 9",
    description: "Your essential companion for a healthy life is now even more powerful. The S9 chip enables a superbright display and a magical new way to quickly interact with your watch without touching the screen.",
    price: 41900,
    category: "Wearables",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800",
    stock: 20,
    rating: 4.7,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Processor", value: "S9 SiP with 64-bit dual-core processor" },
      { name: "Sensors", value: "Blood oxygen, ECG, Heart rate, Temperature sensing" },
      { name: "Display", value: "Always-On Retina LTPO OLED, up to 2000 nits" },
      { name: "Water Resistance", value: "Swimproof (WR50, IP6X dust-resistant)" },
    ],
    reviews: [
      { name: "Amit Goel", rating: 5, comment: "Double-tap gesture works perfectly. Extremely convenient.", user: null }
    ]
  },
  {
    name: "Sony Bravia 55-inch 4K Ultra HD TV",
    description: "Enter a world of vibrant colors and lifelike detail. The powerful X1 processor uses advanced algorithms to cut noise and boost detail, giving you images full of rich color and contrast.",
    price: 57900,
    category: "TVs",
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800",
    stock: 6,
    rating: 4.6,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Display Size", value: "55 inches" },
      { name: "Resolution", value: "4K Ultra HD (3840 x 2160)" },
      { name: "Smart TV OS", value: "Google TV" },
      { name: "Audio", value: "20W Output, Dolby Audio, Clear Phase" },
    ],
    reviews: [
      { name: "Karan Johar", rating: 4.6, comment: "Sound quality is decent, picture quality is mind-blowing for this price.", user: null }
    ]
  }
];

const seedDB = async () => {
  try {
    // 1. Clear Existing Data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    console.log("Cleared existing collections...");

    // 2. Hash passwords & insert Users
    const hashedUsers = await Promise.all(
      users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        return { ...u, password: hashedPassword };
      })
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log("Seeded default users...");

    // Find the created customer user ID to associate with reviews
    const customerUser = createdUsers.find((u) => u.role === "user");

    // 3. Map user to reviews & insert Products
    const mappedProducts = products.map((p) => {
      const reviewsWithUser = p.reviews.map((r) => ({
        ...r,
        user: customerUser._id,
      }));
      return { ...p, reviews: reviewsWithUser };
    });

    await Product.insertMany(mappedProducts);
    console.log("Seeded default products...");

    console.log("Database seeded successfully! 🌱");
    process.exit(0);
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  }
};

seedDB();
