const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  // MEN - Jordans
  {
    id: 1,
    name: "Air Jordan 1 Retro High OG",
    category: "Men",
    subcategory: "Jordan",
    price: 180,
    color: "Chicago / Varsity Red",
    description: "The iconic Air Jordan 1 Retro High OG 'Chicago' returns with its classic color blocking, featuring premium leather and Nike Air cushioning.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: true,
  },
  {
    id: 4,
    name: "Air Jordan 4 Retro",
    category: "Men",
    subcategory: "Jordan",
    price: 210,
    color: "Bred Reimagined",
    description: "The Air Jordan 4 Retro 'Bred Reimagined' updates the classic silhouette with premium leather construction while maintaining its iconic design elements.",
    image: "https://images.unsplash.com/photo-1608667508764-33cf0726b13a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: true,
  },
  {
    id: 19,
    name: "Air Jordan 3 Retro",
    category: "Men",
    subcategory: "Jordan",
    price: 200,
    color: "White Cement",
    description: "The shoe that saved the franchise. The Air Jordan 3 Retro brings back the classic elephant print and visible Air cushioning.",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  },
  {
    id: 20,
    name: "Air Jordan 11 Retro",
    category: "Men",
    subcategory: "Jordan",
    price: 225,
    color: "Concord",
    description: "Tinker Hatfield's masterpiece features patent leather overlays and an icy translucent outsole for a look that's perfect on or off the court.",
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  },
  
  // MEN - Others
  {
    id: 3,
    name: "Nike ZoomX Vaporfly NEXT% 2",
    category: "Men",
    subcategory: "Running",
    price: 250,
    color: "Volt/Blue",
    description: "Continue the next evolution of speed with a racing shoe made to help you chase new goals and records.",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: true,
  },
  {
    id: 13,
    name: "Nike Mercurial Superfly 9",
    category: "Men",
    subcategory: "Football",
    price: 275,
    color: "Pink Blast/Volt",
    description: "The Nike Mercurial Superfly 9 Elite features a Zoom Air unit, specifically for football, for that springy underfoot feel.",
    image: "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: true,
  },
  {
    id: 14,
    name: "Nike Victori One",
    category: "Men",
    subcategory: "Sandal, Sliders and Flipflop",
    price: 35,
    color: "Black/White",
    description: "From the beach to the bleachers, the Nike Victori One perfects a classic, must-have design.",
    image: "https://images.unsplash.com/photo-1603191659440-ac9413490cc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  },

  // WOMEN - Jordans
  {
    id: 5,
    name: "Air Jordan 1 Elevate Low",
    category: "Women",
    subcategory: "Jordan",
    price: 135,
    color: "White/Wolf Grey",
    description: "Rise to the occasion in the Air Jordan 1 Elevate Low. A platform stance and premium materials upgrade the classic design.",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  },
  {
    id: 8,
    name: "Air Jordan 1 Mid",
    category: "Women",
    subcategory: "Jordan",
    price: 125,
    color: "Shadow/Black",
    description: "The Air Jordan 1 Mid brings full-court style and premium comfort to an iconic look.",
    image: "https://images.unsplash.com/photo-1620152436423-cb45c0f1b20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: true,
  },
  {
    id: 21,
    name: "Air Jordan 2 Retro Low",
    category: "Women",
    subcategory: "Jordan",
    price: 150,
    color: "Chicago",
    description: "A low-profile take on the luxurious '86 original, featuring premium leather and classic Jordan heritage.",
    image: "https://images.unsplash.com/photo-1552346154-21d32810baa3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  },

  // WOMEN - Others
  {
    id: 2,
    name: "Nike Air Max 270",
    category: "Women",
    subcategory: "Running",
    price: 150,
    color: "White/Black",
    description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  },
  {
    id: 15,
    name: "Nike Air Zoom Pegasus 39",
    category: "Women",
    subcategory: "Running",
    price: 130,
    color: "White/Grey",
    description: "Let the Nike Air Zoom Pegasus 39 help you ascend to new heights with its intuitive design.",
    image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: true,
  },
  {
    id: 16,
    name: "Nike Kawa",
    category: "Women",
    subcategory: "Sandal, Sliders and Flipflop",
    price: 30,
    color: "Rose Gold",
    description: "The Nike Kawa Slide is your easy-to-wear slip-on for any time.",
    image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  },

  // KIDS - Jordans
  {
    id: 10,
    name: "Jordan 1 Mid Kids",
    category: "Kids",
    subcategory: "Jordan",
    price: 90,
    color: "Bred Toe",
    description: "The iconic AJ1 silhouette scaled down for kids, featuring durable materials and comfortable cushioning.",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  },
  {
    id: 11,
    name: "Jordan 4 Retro Kids",
    category: "Kids",
    subcategory: "Jordan",
    price: 150,
    color: "Thunder",
    description: "The Air Jordan 4 Retro delivers lightweight cushioning and heritage style for the next generation of sneakerheads.",
    image: "https://images.unsplash.com/photo-1608667508764-33cf0726b13a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: true,
  },
  {
    id: 22,
    name: "Jordan 11 Retro Low Kids",
    category: "Kids",
    subcategory: "Jordan",
    price: 135,
    color: "Space Jam",
    description: "Premium patent leather and iconic styling make this scaled-down Jordan 11 a must-have for young athletes.",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  },

  // KIDS - Others
  {
    id: 12,
    name: "Nike Flex Runner 2",
    category: "Kids",
    subcategory: "Running",
    price: 45,
    color: "Grey/Blue",
    description: "A slip-on design makes the Nike Flex Runner 2 super easy to get on and off. Plus, it's flexible and comfortable for all-day play.",
    image: "https://images.unsplash.com/photo-1605340054060-128216315ee4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  },
  {
    id: 17,
    name: "Nike Phantom Luna Kids",
    category: "Kids",
    subcategory: "Football",
    price: 120,
    color: "Volt/Black",
    description: "Designed for the young footballers who are ready to take control of the pitch.",
    image: "https://images.unsplash.com/photo-1551927336-09d50efd69cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: true,
  },
  {
    id: 18,
    name: "Nike Sunray Protect 3",
    category: "Kids",
    subcategory: "Sandal, Sliders and Flipflop",
    price: 40,
    color: "Blue/Yellow",
    description: "Keep little toes safe and comfortable in the Nike Sunray Protect 3.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    isLatest: false,
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Delete existing products
    await Product.deleteMany();
    console.log('Existing products removed');

    // Insert new products
    await Product.insertMany(products);
    console.log('Products imported successfully!');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
