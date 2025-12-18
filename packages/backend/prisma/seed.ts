import { config } from "../src/config/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import * as seedData from "./seed-data.json";

// Initialize Prisma Client with adapter
const connectionString = config.supabase.databaseUrl;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clean existing data (optional - remove if you want to keep existing data)
    console.log("🗑️ Cleaning existing data...");
    await prisma.transaction.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    // Seed users
    console.log("👤 Seeding users...");
    const user = await prisma.user.create({
      data: seedData.users[0],
    });
    console.log(`✅ Created user: ${user.name} (${user.email})`);

    // Seed categories
    console.log("📁 Seeding categories...");
    for (const categoryData of seedData.categories) {
      const category = await prisma.category.create({
        data: {
          ...categoryData,
          userId: user.id,
        },
      });
      console.log(`✅ Created category: ${category.name}`);
    }

    // Seed transaction
    console.log("💰 Seeding transactions...");
    for (const transactionData of seedData.transactions) {
      const transaction = await prisma.transaction.create({
        data: {
          amount: transactionData.amount,
          type: transactionData.type as "INCOME" | "EXPENSE",
          description: transactionData.description,
          date: new Date(transactionData.date),
          categoryId: transactionData.categoryId,
          userId: user.id,
        },
      });
      console.log(
        `✅ Created transaction: ${transaction.type} - ${transaction.description} (${transaction.amount})`
      );
    }

    // Print summary
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const transactionCount = await prisma.transaction.count();

    console.log(`\n📊 Seeding completed!`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Transactions: ${transactionCount}`);

    // Calculate totals
    const totalIncome = await prisma.transaction.aggregate({
      where: { type: "INCOME" },
      _sum: { amount: true },
    });

    const totalExpenses = await prisma.transaction.aggregate({
      where: { type: "EXPENSE" },
      _sum: { amount: true },
    });

    const totalIncomeAmount = totalIncome._sum.amount || 0;
    const totalExpensesAmount = totalExpenses._sum.amount || 0;
    const balance = totalIncomeAmount - totalExpensesAmount;

    console.log("\n💸 Financial Summary:");
    console.log(`   Total Income: ${totalIncomeAmount.toLocaleString()}`);
    console.log(`   Total Expenses: ${totalExpensesAmount.toLocaleString()}`);
    console.log(`   Balance: ${balance.toLocaleString()}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  });
