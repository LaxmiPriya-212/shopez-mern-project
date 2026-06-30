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
  },
  {
    name: "Google Pixel 8 Pro",
    description: "The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera ever, and can even edit audio in videos with Audio Magic Eraser.",
    price: 109900,
    category: "Mobiles",
    brand: "Google",
    image: "https://images.unsplash.com/photo-1698342468307-e07e8ef6e61f?w=800",
    stock: 15,
    rating: 4.6,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Display", value: "6.7-inch Super Actua display, 120Hz" },
      { name: "Processor", value: "Google Tensor G3" },
      { name: "Camera", value: "50MP Main + 48MP Wide + 48MP Zoom" },
      { name: "Battery", value: "5050 mAh with 30W Fast Charging" }
    ],
    reviews: [
      { name: "Sahil Varma", rating: 4.6, comment: "The AI photo features are pure magic. Best clean Android experience.", user: null }
    ]
  },
  {
    name: "OnePlus 12 5G",
    description: "Redefined flagship performance featuring Snapdragon 8 Gen 3, a 4th Gen Hasselblad Camera System, and blazing fast 100W SUPERVOOC charging.",
    price: 64999,
    category: "Mobiles",
    brand: "OnePlus",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    stock: 18,
    rating: 4.7,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Display", value: "6.82-inch 2K ProXDR 120Hz AMOLED" },
      { name: "Charging", value: "100W Wired / 50W Wireless Charging" },
      { name: "RAM", value: "16 GB LPDDR5X" },
      { name: "Storage", value: "512 GB UFS 4.0" }
    ],
    reviews: [
      { name: "Kabir Roy", rating: 4.7, comment: "Loads in 25 minutes! Extremely smooth, zero lags in gaming.", user: null }
    ]
  },
  {
    name: "Dell XPS 15 Laptop",
    description: "Power your passions. The XPS 15 is the perfect balance of size and performance, combining a stunning OLED display and high-end graphics processor.",
    price: 210000,
    category: "Laptops",
    brand: "Dell",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
    stock: 6,
    rating: 4.5,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Processor", value: "Intel Core i7 13th Gen" },
      { name: "Display", value: "15.6-inch 3.5K OLED Touchscreen" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4060 8GB" },
      { name: "RAM", value: "32 GB DDR5" }
    ],
    reviews: [
      { name: "Arjun Singhal", rating: 4.5, comment: "Superb build quality and trackpad. Best premium Windows laptop.", user: null }
    ]
  },
  {
    name: "ASUS ROG Zephyrus G14",
    description: "Compact size, colossal power. A 14-inch gaming beast featuring a gorgeous Nebula HDR display and premium performance hardware.",
    price: 145000,
    category: "Laptops",
    brand: "ASUS",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
    stock: 9,
    rating: 4.8,
    numReviews: 1,
    isFeatured: true,
    specifications: [
      { name: "Processor", value: "AMD Ryzen 9 8945HS" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4070 8GB" },
      { name: "Display", value: "14-inch 120Hz ROG Nebula OLED" },
      { name: "Weight", value: "1.5 kg Ultraportable" }
    ],
    reviews: [
      { name: "Rishabh Joshi", rating: 4.8, comment: "Unbelievable power in a compact 14-inch chassis. Stays relatively cool.", user: null }
    ]
  },
  {
    name: "HP Spectre x360 2-in-1",
    description: "Crafted to perfection. A versatile touchscreen convertible that easily switches between laptop, tent, and tablet modes, powered by Intel Core Ultra.",
    price: 165000,
    category: "Laptops",
    brand: "HP",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
    stock: 7,
    rating: 4.6,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Processor", value: "Intel Core Ultra 7 with Intel AI Boost" },
      { name: "Display", value: "14-inch 2.8K OLED Touchscreen" },
      { name: "Included", value: "HP Rechargeable MPP 2.0 Tilt Pen" },
      { name: "Battery", value: "Up to 15 hours battery life" }
    ],
    reviews: [
      { name: "Meera Gupta", rating: 4.6, comment: "Beautiful gem-cut design, the pen responsiveness is smooth.", user: null }
    ]
  },
  {
    name: "Sony WF-1000XM5 Earbuds",
    description: "The best noise-cancelling earbuds with high-res audio, clear call quality, and a comfortable, ergonomic design.",
    price: 24990,
    category: "Accessories",
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    stock: 30,
    rating: 4.5,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Driver", value: "Dynamic Driver X (8.4mm)" },
      { name: "ANC", value: "Integrated Processor V2 + QN2e Chip" },
      { name: "Battery", value: "Up to 8 hours (24 hours total with case)" },
      { name: "Bluetooth", value: "LE Audio and Multipoint Connection" }
    ],
    reviews: [
      { name: "Nikhil Rao", rating: 4.5, comment: "Much smaller and lighter than XM4, bass is deep and clear.", user: null }
    ]
  },
  {
    name: "Logitech MX Master 3S Mouse",
    description: "An iconic mouse remastered. Feel every moment of your workflow with even more precision, tactile clicks, and 8K DPI tracking.",
    price: 10995,
    category: "Accessories",
    brand: "Logitech",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800",
    stock: 45,
    rating: 4.8,
    numReviews: 2,
    isFeatured: true,
    specifications: [
      { name: "Sensor", value: "Darkfield high-precision 8000 DPI" },
      { name: "Clicks", value: "Quiet clicks (90% noise reduction)" },
      { name: "Scroll Wheel", value: "MagSpeed Electromagnetic scroll" },
      { name: "Compatibility", value: "Windows, macOS, Linux, iPadOS" }
    ],
    reviews: [
      { name: "Divya Nair", rating: 5, comment: "Saved my wrist! The ergonomic grip and thumb wheel are incredibly useful.", user: null },
      { name: "Gautam Das", rating: 4.6, comment: "Seamless shifting between my Mac and PC. High quality.", user: null }
    ]
  },
  {
    name: "Keychron K2 Mechanical Keyboard",
    description: "A compact 75% layout wireless mechanical keyboard designed for maximum productivity and premium tactile feedback.",
    price: 9999,
    category: "Accessories",
    brand: "Keychron",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
    stock: 22,
    rating: 4.7,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Layout", value: "75% Compact (84 keys)" },
      { name: "Switches", value: "Gateron G Pro Mechanical Brown Switches" },
      { name: "Backlight", value: "RGB backlight with 18 effects" },
      { name: "Battery", value: "4000 mAh rechargeable battery" }
    ],
    reviews: [
      { name: "Vikrant Singh", rating: 4.7, comment: "Awesome sound and tactile feel. Works perfectly with macOS.", user: null }
    ]
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra",
    description: "Our largest Dynamic AMOLED 2X tablet. IP68 water and dust resistant, paired with the powerful Snapdragon 8 Gen 2 processor.",
    price: 108900,
    category: "Tablets",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800",
    stock: 8,
    rating: 4.7,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Display", value: "14.6-inch Dynamic AMOLED 2X, 120Hz" },
      { name: "Waterproof", value: "IP68 rated tablet and S-Pen" },
      { name: "RAM", value: "12 GB RAM" },
      { name: "Storage", value: "256 GB with microSD slot" }
    ],
    reviews: [
      { name: "Sneha Menon", rating: 4.7, comment: "This screen is massive! Writing with the included S-Pen feels very natural.", user: null }
    ]
  },
  {
    name: "Microsoft Surface Pro 9",
    description: "The power of a laptop, the flexibility of a tablet. Featuring a built-in kickstand, 12th Gen Intel Core processors, and vibrant PixelSense display.",
    price: 115000,
    category: "Tablets",
    brand: "Microsoft",
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800",
    stock: 11,
    rating: 4.4,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Processor", value: "Intel Core i5 12th Gen" },
      { name: "Display", value: "13-inch PixelSense touchscreen, 120Hz" },
      { name: "OS", value: "Windows 11 Home" },
      { name: "Ports", value: "2 x USB-C with Thunderbolt 4" }
    ],
    reviews: [
      { name: "Prakash Jha", rating: 4.4, comment: "The kickstand is excellent, but you have to buy the keyboard separately.", user: null }
    ]
  },
  {
    name: "Samsung Galaxy Watch 6",
    description: "Start your wellness journey with customizable sleep tracking, body composition analytics, and a 20% larger display with thinner bezel.",
    price: 30999,
    category: "Wearables",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    stock: 17,
    rating: 4.5,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Display Size", value: "44mm Super AMOLED" },
      { name: "OS", value: "Wear OS Powered by Samsung" },
      { name: "Sensors", value: "BioActive sensor (ECG, Heart Rate, BIA)" },
      { name: "Battery", value: "Up to 40 hours with fast charge" }
    ],
    reviews: [
      { name: "Suresh Pillai", rating: 4.5, comment: "Sleep reports are highly comprehensive. Beautiful display panel.", user: null }
    ]
  },
  {
    name: "Garmin Fenix 7 Sapphire Solar",
    description: "Premium multisport GPS smartwatch. Power glass solar charging lens extends battery life to power you through tough training challenges.",
    price: 75990,
    category: "Wearables",
    brand: "Garmin",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800",
    stock: 6,
    rating: 4.9,
    numReviews: 1,
    isFeatured: true,
    specifications: [
      { name: "Lens material", value: "Power Sapphire solar charging glass" },
      { name: "Battery", value: "Up to 22 days in smartwatch mode" },
      { name: "Sensors", value: "Multi-band GNSS, altimeter, barometer, compass" },
      { name: "Durability", value: "U.S. military standard 810G thermal/shock" }
    ],
    reviews: [
      { name: "Devendra Negi", rating: 4.9, comment: "Unbeatable battery life. Best watch in the world for hiking and running.", user: null }
    ]
  },
  {
    name: "LG C3 65-inch 4K OLED TV",
    description: "Enjoy brilliant visuals with perfect black levels, infinite contrast, and over 8 million self-lit pixels, powered by AI α9 Gen 6 processor.",
    price: 189900,
    category: "TVs",
    brand: "LG",
    image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800",
    stock: 4,
    rating: 4.9,
    numReviews: 2,
    isFeatured: true,
    specifications: [
      { name: "Display Panel", value: "OLED evo with Brightness Booster" },
      { name: "Refresh Rate", value: "120Hz native VRR & G-Sync" },
      { name: "HDMI Ports", value: "4 x HDMI 2.1 ports" },
      { name: "Audio", value: "9.1.2 Virtual Surround Sound" }
    ],
    reviews: [
      { name: "Rajesh Khanna", rating: 5, comment: "Best TV for gaming on PS5. Dark scenes look absolutely incredible.", user: null },
      { name: "Shalini Iyer", rating: 4.8, comment: "WebOS is very fast and smooth, picture colors are very natural.", user: null }
    ]
  },
  {
    name: "Samsung Neo QLED 65-inch TV",
    description: "Quantum Matrix Technology with Mini LEDs delivers stunning detail in both the darkest and brightest scenes.",
    price: 169900,
    category: "TVs",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
    stock: 5,
    rating: 4.7,
    numReviews: 1,
    isFeatured: false,
    specifications: [
      { name: "Backlight", value: "Quantum Mini LED display" },
      { name: "Processor", value: "Neural Quantum Processor 4K" },
      { name: "Audio", value: "Object Tracking Sound (OTS) +" },
      { name: "Smart OS", value: "Tizen Smart TV" }
    ],
    reviews: [
      { name: "Varun Malhotra", rating: 4.7, comment: "Extremely bright display panel, perfect for my brightly lit living room.", user: null }
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
