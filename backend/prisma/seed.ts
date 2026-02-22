import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // ── USERS ──────────────────────────────────────────────────────────────────
  const nickFury = await prisma.user.upsert({
    where: { email: 'nick.fury@shield.com' },
    update: {},
    create: { email: 'nick.fury@shield.com', password: hashedPassword, name: 'Nick Fury', role: 'ADMIN', country: 'INDIA' },
  });

  await prisma.user.upsert({
    where: { email: 'captain.marvel@shield.com' },
    update: {},
    create: { email: 'captain.marvel@shield.com', password: hashedPassword, name: 'Captain Marvel', role: 'MANAGER', country: 'INDIA' },
  });

  await prisma.user.upsert({
    where: { email: 'captain.america@shield.com' },
    update: {},
    create: { email: 'captain.america@shield.com', password: hashedPassword, name: 'Captain America', role: 'MANAGER', country: 'AMERICA' },
  });

  await prisma.user.upsert({
    where: { email: 'thanos@shield.com' },
    update: {},
    create: { email: 'thanos@shield.com', password: hashedPassword, name: 'Thanos', role: 'MEMBER', country: 'INDIA' },
  });

  await prisma.user.upsert({
    where: { email: 'thor@shield.com' },
    update: {},
    create: { email: 'thor@shield.com', password: hashedPassword, name: 'Thor', role: 'MEMBER', country: 'INDIA' },
  });

  await prisma.user.upsert({
    where: { email: 'travis@shield.com' },
    update: {},
    create: { email: 'travis@shield.com', password: hashedPassword, name: 'Travis', role: 'MEMBER', country: 'AMERICA' },
  });

  // ── RESTAURANTS ─────────────────────────────────────────────────────────────
  const spiceGarden = await prisma.restaurant.upsert({
    where: { id: 'rest-india-1' }, update: {},
    create: { id: 'rest-india-1', name: 'Spice Garden', cuisine: 'North Indian', country: 'INDIA', rating: 4.5 },
  });
  const biryaniHouse = await prisma.restaurant.upsert({
    where: { id: 'rest-india-2' }, update: {},
    create: { id: 'rest-india-2', name: 'Biryani House', cuisine: 'Hyderabadi', country: 'INDIA', rating: 4.7 },
  });
  const dosaDhaba = await prisma.restaurant.upsert({
    where: { id: 'rest-india-3' }, update: {},
    create: { id: 'rest-india-3', name: 'Dosa Dhaba', cuisine: 'South Indian', country: 'INDIA', rating: 4.3 },
  });
  const burgerBliss = await prisma.restaurant.upsert({
    where: { id: 'rest-usa-1' }, update: {},
    create: { id: 'rest-usa-1', name: 'Burger Bliss', cuisine: 'American', country: 'AMERICA', rating: 4.4 },
  });
  const pizzaPalace = await prisma.restaurant.upsert({
    where: { id: 'rest-usa-2' }, update: {},
    create: { id: 'rest-usa-2', name: 'Pizza Palace', cuisine: 'Italian-American', country: 'AMERICA', rating: 4.6 },
  });
  const texasBBQ = await prisma.restaurant.upsert({
    where: { id: 'rest-usa-3' }, update: {},
    create: { id: 'rest-usa-3', name: 'Texas BBQ Co.', cuisine: 'BBQ', country: 'AMERICA', rating: 4.8 },
  });

  // ── MENU ITEMS (upsert by id — works on SQLite) ─────────────────────────────
  const menuItems = [
    { id: 'mi-sg-1', restaurantId: spiceGarden.id,  name: 'Butter Chicken',      description: 'Creamy tomato-based curry with tender chicken',  price: 320,   category: 'Main Course' },
    { id: 'mi-sg-2', restaurantId: spiceGarden.id,  name: 'Dal Makhani',          description: 'Slow-cooked black lentils with butter and cream', price: 220,   category: 'Main Course' },
    { id: 'mi-sg-3', restaurantId: spiceGarden.id,  name: 'Paneer Tikka',         description: 'Grilled cottage cheese with spices',              price: 280,   category: 'Starter'     },
    { id: 'mi-sg-4', restaurantId: spiceGarden.id,  name: 'Naan',                 description: 'Soft leavened flatbread from tandoor',            price: 50,    category: 'Bread'       },
    { id: 'mi-sg-5', restaurantId: spiceGarden.id,  name: 'Gulab Jamun',          description: 'Deep-fried milk solids in sugar syrup',           price: 120,   category: 'Dessert'     },
    { id: 'mi-bh-1', restaurantId: biryaniHouse.id, name: 'Hyderabadi Biryani',   description: 'Fragrant basmati rice with tender mutton',        price: 450,   category: 'Main Course' },
    { id: 'mi-bh-2', restaurantId: biryaniHouse.id, name: 'Chicken Biryani',      description: 'Aromatic rice with spiced chicken',               price: 380,   category: 'Main Course' },
    { id: 'mi-bh-3', restaurantId: biryaniHouse.id, name: 'Mirchi Salan',         description: 'Green chili curry',                               price: 150,   category: 'Side'        },
    { id: 'mi-bh-4', restaurantId: biryaniHouse.id, name: 'Raita',                description: 'Cooling yogurt with cucumber and mint',           price: 80,    category: 'Side'        },
    { id: 'mi-bh-5', restaurantId: biryaniHouse.id, name: 'Double Ka Meetha',     description: 'Bread pudding with saffron and nuts',             price: 160,   category: 'Dessert'     },
    { id: 'mi-dd-1', restaurantId: dosaDhaba.id,    name: 'Masala Dosa',          description: 'Crispy crepe with spiced potato filling',         price: 150,   category: 'Main'        },
    { id: 'mi-dd-2', restaurantId: dosaDhaba.id,    name: 'Idli Sambar',          description: 'Steamed rice cakes with lentil soup',             price: 120,   category: 'Breakfast'   },
    { id: 'mi-dd-3', restaurantId: dosaDhaba.id,    name: 'Uttapam',              description: 'Thick pancake with vegetables',                   price: 160,   category: 'Main'        },
    { id: 'mi-dd-4', restaurantId: dosaDhaba.id,    name: 'Vada',                 description: 'Crispy lentil fritters',                          price: 90,    category: 'Starter'     },
    { id: 'mi-dd-5', restaurantId: dosaDhaba.id,    name: 'Filter Coffee',        description: 'Traditional South Indian coffee',                 price: 60,    category: 'Beverage'    },
    { id: 'mi-bb-1', restaurantId: burgerBliss.id,  name: 'Classic Cheeseburger', description: 'Angus beef patty with cheddar and fresh veggies', price: 14.99, category: 'Burger'      },
    { id: 'mi-bb-2', restaurantId: burgerBliss.id,  name: 'BBQ Bacon Burger',     description: 'Double patty with crispy bacon and BBQ sauce',    price: 17.99, category: 'Burger'      },
    { id: 'mi-bb-3', restaurantId: burgerBliss.id,  name: 'Truffle Fries',        description: 'Crispy fries with truffle oil and parmesan',      price: 8.99,  category: 'Sides'       },
    { id: 'mi-bb-4', restaurantId: burgerBliss.id,  name: 'Onion Rings',          description: 'Beer-battered onion rings with dipping sauce',    price: 6.99,  category: 'Sides'       },
    { id: 'mi-bb-5', restaurantId: burgerBliss.id,  name: 'Chocolate Milkshake',  description: 'Thick hand-spun chocolate shake',                 price: 7.99,  category: 'Beverages'   },
    { id: 'mi-pp-1', restaurantId: pizzaPalace.id,  name: 'Margherita',           description: 'Fresh mozzarella, tomatoes, and basil',           price: 16.99, category: 'Pizza'       },
    { id: 'mi-pp-2', restaurantId: pizzaPalace.id,  name: 'Pepperoni Supreme',    description: 'Loaded with pepperoni and three cheeses',         price: 21.99, category: 'Pizza'       },
    { id: 'mi-pp-3', restaurantId: pizzaPalace.id,  name: 'BBQ Chicken Pizza',    description: 'Smoky BBQ sauce with grilled chicken',            price: 22.99, category: 'Pizza'       },
    { id: 'mi-pp-4', restaurantId: pizzaPalace.id,  name: 'Garlic Bread',         description: 'Toasted bread with garlic butter and herbs',      price: 7.99,  category: 'Starter'     },
    { id: 'mi-pp-5', restaurantId: pizzaPalace.id,  name: 'Tiramisu',             description: 'Classic Italian coffee dessert',                  price: 9.99,  category: 'Dessert'     },
    { id: 'mi-tb-1', restaurantId: texasBBQ.id,     name: 'Brisket Plate',        description: 'Slow-smoked beef brisket with two sides',         price: 24.99, category: 'Mains'       },
    { id: 'mi-tb-2', restaurantId: texasBBQ.id,     name: 'Pulled Pork Sandwich', description: 'Tender pulled pork on brioche bun',               price: 16.99, category: 'Mains'       },
    { id: 'mi-tb-3', restaurantId: texasBBQ.id,     name: 'BBQ Ribs Half Rack',   description: 'St. Louis style ribs with house rub',             price: 28.99, category: 'Mains'       },
    { id: 'mi-tb-4', restaurantId: texasBBQ.id,     name: 'Mac & Cheese',         description: 'Creamy baked mac with smoked gouda',              price: 9.99,  category: 'Sides'       },
    { id: 'mi-tb-5', restaurantId: texasBBQ.id,     name: 'Coleslaw',             description: 'Tangy house-made coleslaw',                       price: 5.99,  category: 'Sides'       },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }

  // ── PAYMENT METHODS ─────────────────────────────────────────────────────────
  await prisma.paymentMethod.upsert({
    where: { id: 'pm-nf-1' },
    update: {},
    create: { id: 'pm-nf-1', userId: nickFury.id, type: 'CREDIT_CARD', last4: '4242', cardBrand: 'Visa', isDefault: true },
  });

  await prisma.paymentMethod.upsert({
    where: { id: 'pm-nf-2' },
    update: {},
    create: { id: 'pm-nf-2', userId: nickFury.id, type: 'UPI', upiId: 'nickfury@upi', isDefault: false },
  });

  console.log('\n✅ Database seeded!\n');
  console.log('👥 Login Accounts (password: password123)\n');
  console.log('  👑 Nick Fury        nick.fury@shield.com        ADMIN    India');
  console.log('  🦸 Captain Marvel   captain.marvel@shield.com   MANAGER  India');
  console.log('  🛡  Captain America  captain.america@shield.com  MANAGER  America');
  console.log('  💜 Thanos           thanos@shield.com           MEMBER   India');
  console.log('  ⚡ Thor             thor@shield.com             MEMBER   India');
  console.log('  🤠 Travis           travis@shield.com           MEMBER   America');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
