import mongoose from 'mongoose';
import { env } from '../config/env';
import { Category } from '../models/Category';
import { MenuItem } from '../models/MenuItem';
import { Outlet } from '../models/Outlet';
import { User } from '../models/User';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, INITIAL_OUTLETS } from './seedData';

export const seedDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 1) return;

    // Check if database already has categories & outlets
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding initial categories...');
      await Category.insertMany(INITIAL_CATEGORIES);
    }

    const outletCount = await Outlet.countDocuments();
    if (outletCount === 0) {
      console.log('🌱 Seeding initial outlets...');
      await Outlet.insertMany(INITIAL_OUTLETS);
    }

    // Upsert menu items to ensure latest images and descriptions match dish titles
    console.log('🌱 Synchronizing menu items and dish images...');
    for (const item of INITIAL_MENU_ITEMS) {
      await MenuItem.updateOne(
        { slug: item.slug },
        { $set: item },
        { upsert: true }
      );
    }

    const adminUser = await User.findOne({ email: 'admin@mehfilbiryani.com' });
    if (!adminUser) {
      console.log('🌱 Creating default admin user (admin@mehfilbiryani.com)...');
      await User.create({
        name: 'Mehfil Executive Admin',
        email: 'admin@mehfilbiryani.com',
        password: 'MehfilNizami2026!',
        role: 'admin',
        isActive: true,
      });
    }

    console.log('✅ Database Seeding & Synchronization completed successfully.');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  }
};

if (require.main === module) {
  mongoose
    .connect(env.MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB for direct seeding script...');
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
