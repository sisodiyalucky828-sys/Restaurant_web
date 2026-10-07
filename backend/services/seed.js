const mongoose = require('mongoose');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const images = require('./imageConfig');

const menuItemsData = [
  // COFFEE
  {
    name: "Velvet Double Espresso",
    description: "Rich, full-bodied double shot with notes of dark Belgian chocolate and roasted hazelnuts. Crafted from high-altitude Ethiopian beans.",
    price: 4.50,
    category: "Coffee",
    image: images.menu.velvetEspresso,
    tags: ["Signature", "Artisanal", "Bestseller"],
    prepTime: "3-5 min",
    rating: 4.9,
    available: true,
  },
  {
    name: "Golden Caramel Macchiato",
    description: "Freshly steamed silky whole milk with vanilla syrup, marked with espresso and topped with our house-crafted burnt caramel drizzle.",
    price: 6.25,
    category: "Coffee",
    image: images.menu.caramelMacchiato,
    tags: ["Bestseller", "Sweet"],
    prepTime: "4-6 min",
    rating: 4.8,
    available: true,
  },
  {
    name: "Signature Velvet Cappuccino",
    description: "Equal parts espresso, velvety micro-foamed milk, and dense foam, dusted with 70% raw cocoa powder and golden cinnamon shimmer.",
    price: 5.75,
    category: "Coffee",
    image: images.menu.signatureCappuccino,
    tags: ["Classic", "Artisanal"],
    prepTime: "4-6 min",
    rating: 4.9,
    available: true,
  },
  {
    name: "Nitro Cold Brew Reserve",
    description: "Slow-steeped for 20 hours with organic single-origin beans, infused with nitrogen for a creamy stout-like head and naturally sweet finish.",
    price: 5.95,
    category: "Coffee",
    image: images.menu.coldBrewNitro,
    tags: ["Cold", "Single Origin"],
    prepTime: "2-3 min",
    rating: 4.7,
    available: true,
  },
  {
    name: "Cortado Gold",
    description: "Equal parts intense ristretto espresso and warm textured milk served in a signature 4.5 oz Libbey Gibraltar glass.",
    price: 5.20,
    category: "Coffee",
    image: images.menu.cortadoGold,
    tags: ["Barista Favorite"],
    prepTime: "3-5 min",
    rating: 4.8,
    available: true,
  },

  // TEA
  {
    name: "Ceremonial Japanese Matcha Latte",
    description: "First-harvest ceremonial grade Uji matcha whisked with oat milk and lightly sweetened with organic raw blossom honey.",
    price: 6.50,
    category: "Tea",
    image: images.menu.japaneseMatchaLatte,
    tags: ["Organic", "Antioxidant", "Bestseller"],
    prepTime: "4-6 min",
    rating: 4.9,
    available: true,
  },
  {
    name: "Artisan Royal Masala Chai",
    description: "Slow-brewed Assam CTC black tea with crushed green cardamom, Ceylon cinnamon, cloves, fresh ginger root, and whole milk.",
    price: 5.50,
    category: "Tea",
    image: images.menu.masalaChaiArtisan,
    tags: ["Warm & Spiced", "House Blend"],
    prepTime: "5-7 min",
    rating: 4.9,
    available: true,
  },
  {
    name: "Lavender Earl Grey Blossom",
    description: "Fragrant bergamot black tea infused with French culinary lavender buds and a delicate splash of steamed vanilla cream.",
    price: 5.75,
    category: "Tea",
    image: images.menu.earlGreyLavender,
    tags: ["Floral", "Calming"],
    prepTime: "4-5 min",
    rating: 4.7,
    available: true,
  },

  // COLD DRINKS
  {
    name: "Wild Berry Fizz Sparkler",
    description: "Muddled blackberries, raspberries, and wild mint stirred with sparkling San Pellegrino and fresh pressed lime juice.",
    price: 6.00,
    category: "Cold Drinks",
    image: images.menu.icedBerrySparkler,
    tags: ["Refreshing", "Zero Caffeine"],
    prepTime: "3-4 min",
    rating: 4.8,
    available: true,
  },
  {
    name: "Mango Passionfruit Cooler",
    description: "Alphonso mango puree blended with fresh crushed passionfruit pulp, coconut water, and crushed crystal ice.",
    price: 6.50,
    category: "Cold Drinks",
    image: images.menu.mangoPassionCooler,
    tags: ["Tropical", "Summer Special"],
    prepTime: "3-5 min",
    rating: 4.8,
    available: true,
  },
  {
    name: "Spanish Iced Cream Latte",
    description: "Double espresso poured over chilled sweetened condensed milk, cinnamon milk, and cracked ice cubes.",
    price: 6.25,
    category: "Cold Drinks",
    image: images.menu.icedSpanishLatte,
    tags: ["Bestseller", "Creamy"],
    prepTime: "3-4 min",
    rating: 4.9,
    available: true,
  },

  // BREAKFAST
  {
    name: "Smashed Avocado Sourdough Toast",
    description: "Toasted country sourdough topped with Hass avocado, Persian feta, heirloom cherry tomatoes, toasted pumpkin seeds, and chili oil drizzle.",
    price: 11.50,
    category: "Breakfast",
    image: images.menu.avocadoSourdoughToast,
    tags: ["Healthy", "Vegetarian", "Bestseller"],
    prepTime: "8-10 min",
    rating: 4.9,
    available: true,
  },
  {
    name: "Belgian Brioche Waffles",
    description: "Golden malted waffles topped with whipped Madagascar vanilla bean butter, organic Quebec maple syrup, and wild forest berries.",
    price: 12.00,
    category: "Breakfast",
    image: images.menu.belgianWaffleSupreme,
    tags: ["Sweet", "Chef Special"],
    prepTime: "10-12 min",
    rating: 4.8,
    available: true,
  },
  {
    name: "Truffle Herb Scrambled Eggs",
    description: "Pasture-raised soft scrambled eggs folded with white truffle oil, fresh chives, and served with roasted herb tomatoes and toasted brioche.",
    price: 13.25,
    category: "Breakfast",
    image: images.menu.truffleScrambledEggs,
    tags: ["Gourmet", "High Protein"],
    prepTime: "8-10 min",
    rating: 4.9,
    available: true,
  },

  // SNACKS
  {
    name: "Fresh French Butter Croissant",
    description: "Baked daily in-house using authentic French Normandy butter. 48 golden laminated flaky layers with an airy, honeycomb center.",
    price: 4.75,
    category: "Snacks",
    image: images.menu.artisanalCroissant,
    tags: ["Baked Fresh", "French Classic"],
    prepTime: "2-3 min",
    rating: 4.9,
    available: true,
  },
  {
    name: "Truffle Parmesan Golden Fries",
    description: "Crispy skin-on russet potato fries tossed in black truffle butter, fresh parsley, and 24-month aged Parmigiano-Reggiano with garlic aioli.",
    price: 8.50,
    category: "Snacks",
    image: images.menu.truffleParmesanFries,
    tags: ["Sharing", "Comfort"],
    prepTime: "7-10 min",
    rating: 4.8,
    available: true,
  },
  {
    name: "Spinach & Sun-dried Tomato Quiche",
    description: "Buttery shortcrust pastry filled with baby spinach, slow-roasted sun-dried tomatoes, goat cheese, and caramelized shallots.",
    price: 8.95,
    category: "Snacks",
    image: images.menu.spinachFetaQuiche,
    tags: ["Warm Savory", "Vegetarian"],
    prepTime: "5-7 min",
    rating: 4.7,
    available: true,
  },

  // DESSERTS
  {
    name: "Classic Italian Tiramisu",
    description: "Traditional Savoiardi ladyfingers soaked in our Velvet espresso and Marsala, layered with whipped mascarpone cream and cocoa dusting.",
    price: 8.50,
    category: "Desserts",
    image: images.menu.tiramisuClassico,
    tags: ["House Special", "Signature"],
    prepTime: "3-5 min",
    rating: 5.0,
    available: true,
  },
  {
    name: "Warm Molten Chocolate Lava Cake",
    description: "Warm Valrhona 70% dark chocolate sponge cake with a flowing molten core, served alongside artisanal Bourbon vanilla bean gelato.",
    price: 9.75,
    category: "Desserts",
    image: images.menu.moltenChocolateLava,
    tags: ["Decadent", "Warm"],
    prepTime: "8-10 min",
    rating: 4.9,
    available: true,
  },
  {
    name: "Burnt Basque Cheesecake",
    description: "Caramelized deeply burnt crust with an ultra-creamy, melt-in-the-mouth custard center. Served with seasonal raspberry compote.",
    price: 8.95,
    category: "Desserts",
    image: images.menu.burntBasqueCheesecake,
    tags: ["Gluten-Friendly", "Bestseller"],
    prepTime: "3-5 min",
    rating: 4.9,
    available: true,
  },

  // MAIN COURSE
  {
    name: "Wild Forest Mushroom Risotto",
    description: "Slow-simmered Carnaroli rice with porcini and cremini mushrooms, white truffle reduction, baby thyme, and aged Pecorino Romano.",
    price: 16.50,
    category: "Main Course",
    image: images.menu.wildMushroomRisotto,
    tags: ["Chef Special", "Comfort"],
    prepTime: "12-15 min",
    rating: 4.9,
    available: true,
  },
  {
    name: "Grilled Sourdough Panini Melt",
    description: "Slow-roasted marinated chicken breast, basil pesto, melted mozzarella di bufala, and sundried tomato tapenade on pressed sourdough.",
    price: 14.50,
    category: "Main Course",
    image: images.menu.grilledSourdoughPanini,
    tags: ["Hearty", "Lunch Favorite"],
    prepTime: "10-12 min",
    rating: 4.8,
    available: true,
  },
  {
    name: "Pan-Seared Salmon Grain Bowl",
    description: "Crispy skin Atlantic salmon over warm quinoa, roasted butternut squash, avocado slices, pickled shallots, and ginger miso dressing.",
    price: 18.00,
    category: "Main Course",
    image: images.menu.panSearedSalmonBowl,
    tags: ["Healthy", "High Protein"],
    prepTime: "12-15 min",
    rating: 4.9,
    available: true,
  },
];

const seedDatabase = async (exitOnComplete = true) => {
  try {
    console.log('[Seed] Starting database seeding process...');

    // Clear existing collections
    await User.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    await Reservation.deleteMany();

    console.log('[Seed] Cleared existing users, menu items, orders, and reservations.');

    // 1. Create Admin & Customers
    const adminUser = await User.create({
      name: 'Chief Barista Admin',
      email: 'admin@velvetbrew.com',
      password: 'admin123',
      phone: '+1 (555) 019-2834',
      role: 'admin',
    });

    const customer1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      password: 'customer123',
      phone: '+1 (555) 234-5678',
      role: 'customer',
    });

    const customer2 = await User.create({
      name: 'Alex Turner',
      email: 'alex.turner@example.com',
      password: 'customer123',
      phone: '+1 (555) 876-5432',
      role: 'customer',
    });

    console.log(`[Seed] Created 1 admin and 2 customers.`);

    // 2. Create Menu Items
    const createdMenuItems = await MenuItem.insertMany(menuItemsData);
    console.log(`[Seed] Inserted ${createdMenuItems.length} menu items across all 7 categories.`);

    // 3. Create Sample Orders
    const order1 = await Order.create({
      user: customer1._id,
      items: [
        {
          menuItem: createdMenuItems[0]._id,
          name: createdMenuItems[0].name,
          price: createdMenuItems[0].price,
          quantity: 2,
          image: createdMenuItems[0].image,
        },
        {
          menuItem: createdMenuItems[11]._id,
          name: createdMenuItems[11].name,
          price: createdMenuItems[11].price,
          quantity: 1,
          image: createdMenuItems[11].image,
        },
      ],
      subtotal: 20.50,
      tax: 1.03,
      deliveryFee: 0,
      total: 21.53,
      customerDetails: {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@example.com',
        phone: '+1 (555) 234-5678',
        address: 'Table 4 - Main Dining Patio',
        orderType: 'dine-in',
        tableNumber: 'Patio-04',
        specialInstructions: 'Extra oat milk on the side please.',
      },
      paymentMethod: 'card',
      paymentStatus: 'paid',
      orderStatus: 'Preparing',
    });

    const order2 = await Order.create({
      user: customer2._id,
      items: [
        {
          menuItem: createdMenuItems[2]._id,
          name: createdMenuItems[2].name,
          price: createdMenuItems[2].price,
          quantity: 1,
          image: createdMenuItems[2].image,
        },
        {
          menuItem: createdMenuItems[17]._id,
          name: createdMenuItems[17].name,
          price: createdMenuItems[17].price,
          quantity: 1,
          image: createdMenuItems[17].image,
        },
      ],
      subtotal: 14.25,
      tax: 0.71,
      deliveryFee: 5.0,
      total: 19.96,
      customerDetails: {
        name: 'Alex Turner',
        email: 'alex.turner@example.com',
        phone: '+1 (555) 876-5432',
        address: '742 Evergreen Terrace, Apt 3B',
        orderType: 'delivery',
        specialInstructions: 'Leave with concierge at the front gate.',
      },
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      orderStatus: 'Ready',
    });

    const order3 = await Order.create({
      user: null, // Guest order
      items: [
        {
          menuItem: createdMenuItems[5]._id,
          name: createdMenuItems[5].name,
          price: createdMenuItems[5].price,
          quantity: 2,
          image: createdMenuItems[5].image,
        },
        {
          menuItem: createdMenuItems[14]._id,
          name: createdMenuItems[14].name,
          price: createdMenuItems[14].price,
          quantity: 2,
          image: createdMenuItems[14].image,
        },
      ],
      subtotal: 22.50,
      tax: 1.13,
      deliveryFee: 0,
      total: 23.63,
      customerDetails: {
        name: 'Emma Watson',
        email: 'emma.w@example.com',
        phone: '+1 (555) 998-1122',
        address: '',
        orderType: 'takeaway',
        specialInstructions: 'Package in biodegradable takeaway boxes.',
      },
      paymentMethod: 'cash_at_counter',
      paymentStatus: 'pending',
      orderStatus: 'Pending',
    });

    const order4 = await Order.create({
      user: customer1._id,
      items: [
        {
          menuItem: createdMenuItems[20]._id,
          name: createdMenuItems[20].name,
          price: createdMenuItems[20].price,
          quantity: 2,
          image: createdMenuItems[20].image,
        },
      ],
      subtotal: 33.00,
      tax: 1.65,
      deliveryFee: 0,
      total: 34.65,
      customerDetails: {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@example.com',
        phone: '+1 (555) 234-5678',
        orderType: 'dine-in',
        tableNumber: 'Table 12',
      },
      paymentMethod: 'card',
      paymentStatus: 'paid',
      orderStatus: 'Completed',
    });

    console.log(`[Seed] Created 4 sample orders with varying statuses.`);

    // 4. Create Sample Reservations
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const formatDate = (d) => d.toISOString().split('T')[0];

    await Reservation.create([
      {
        user: customer1._id,
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@example.com',
        phone: '+1 (555) 234-5678',
        date: formatDate(tomorrow),
        time: '18:30',
        guests: 4,
        specialRequest: 'Window table near the garden for anniversary celebration.',
        status: 'Confirmed',
      },
      {
        user: customer2._id,
        name: 'Alex Turner',
        email: 'alex.turner@example.com',
        phone: '+1 (555) 876-5432',
        date: formatDate(tomorrow),
        time: '12:00',
        guests: 2,
        specialRequest: 'Quiet booth suitable for a lunch business meeting.',
        status: 'Pending',
      },
      {
        user: null,
        name: 'Liam Vance',
        email: 'liam.vance@example.com',
        phone: '+1 (555) 443-8821',
        date: formatDate(dayAfter),
        time: '19:45',
        guests: 6,
        specialRequest: 'Celebrating birthday; request highchair for a toddler.',
        status: 'Confirmed',
      },
      {
        user: null,
        name: 'Chloe Zhang',
        email: 'chloe.z@example.com',
        phone: '+1 (555) 776-3344',
        date: formatDate(dayAfter),
        time: '20:30',
        guests: 8,
        specialRequest: 'Patio seating if weather allows.',
        status: 'Pending',
      },
    ]);

    console.log(`[Seed] Created 4 sample table reservations.`);
    console.log('[Seed] Database seeding completed successfully! ✨');
    console.log('----------------------------------------------------');
    console.log('Admin Account:   admin@velvetbrew.com / admin123');
    console.log('Customer 1:      sarah.jenkins@example.com / customer123');
    console.log('Customer 2:      alex.turner@example.com / customer123');
    console.log('----------------------------------------------------');

    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Seeding failed with error:', error);
    if (exitOnComplete) {
      process.exit(1);
    }
  }
};

// If run directly from CLI
if (require.main === module) {
  require('dotenv').config({ path: __dirname + '/../.env' });
  const { connectDB } = require('../config/db');

  connectDB()
    .then(() => seedDatabase(true))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
