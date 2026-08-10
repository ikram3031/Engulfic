import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDatabase, closeDatabase } from "../src/database/index.js";
import { CategoryModel } from "../src/core/models/category.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const categoriesJsonPath = path.resolve(__dirname, "../docs/categories_new.json");

async function run() {
  await connectDatabase();
  console.log("Connected to DB.");

  // Delete all existing categories
  console.log("Cleaning existing categories from the database...");
  const deleteResult = await CategoryModel.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} categories.`);

  // Load new categories list
  console.log("Reading new categories JSON...");
  const rawData = fs.readFileSync(categoriesJsonPath, "utf-8");
  const categoriesData = JSON.parse(rawData);

  console.log("Seeding categories...");
  for (const parentData of categoriesData) {
    // Insert parent category
    const parentDoc = await CategoryModel.create({
      name: parentData.name,
      slug: parentData.slug,
      description: parentData.description || "",
      imageUrl: parentData.imageUrl || "",
      productCount: parentData.productCount || 0,
      parent: null
    });
    console.log(`✔ Parent Category created: ${parentDoc.name} (ID: ${parentDoc._id})`);

    // Insert subcategories
    if (Array.isArray(parentData.subcategories)) {
      for (const subData of parentData.subcategories) {
        const subDoc = await CategoryModel.create({
          name: subData.name,
          slug: subData.slug,
          description: subData.description || "",
          imageUrl: subData.imageUrl || "",
          productCount: subData.productCount || 0,
          parent: parentDoc._id
        });
        console.log(`  └─✔ Subcategory created: ${subDoc.name} (ID: ${subDoc._id})`);
      }
    }
  }

  console.log("Categories seeding completed successfully!");
}

run()
  .then(() => closeDatabase())
  .catch(err => {
    console.error("Seeding failed:", err);
    closeDatabase().finally(() => process.exit(1));
  });
