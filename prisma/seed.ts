import {
  Role,
  BooleanState,
  Category,
  CategorySub,
  ArticleType,
  ArticleStatus
} from "@/generated/prisma/enums"; // Adjust path if needed
import { database } from "@/lib/prisma"; // Adjust path if needed
import bcrypt from "bcryptjs";

// Helper to generate unique slugs
const slugify = (text: string) =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end

async function main() {
  console.log("🌱 Starting Seed...");

  // ==========================================
  // 1. ADMIN USER
  // ==========================================
  const hashedPassword = await bcrypt.hash("admin", 10);

  // Upsert: Create if doesn't exist, update if it does
  const admin = await database.user.upsert({
    where: { userName: "admin" },
    update: {},
    create: {
      userName: "admin",
      fullName: "Super Admin",
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: BooleanState.TRUE,
    },
  });

  console.log(`✅ Admin user ready: ${admin.id}`);

  // ==========================================
  // 2. SYMPTOMS (10 Items)
  // ==========================================
  console.log("... Seeding Symptoms");

  const symptomData = [
    { nameEN: "Headache", nameLA: "ເຈັບຫົວ" },
    { nameEN: "Fever", nameLA: "ເປັນໄຂ້" },
    { nameEN: "Sore Throat", nameLA: "ເຈັບຄໍ" },
    { nameEN: "Cough", nameLA: "ໄອ" },
    { nameEN: "Stomach Ache", nameLA: "ເຈັບທ້ອງ" },
    { nameEN: "Diarrhea", nameLA: "ຖອກທ້ອງ" },
    { nameEN: "Allergy", nameLA: "ພູມແພ້" },
    { nameEN: "Muscle Pain", nameLA: "ເຈັບກ້າມເນື້ອ" },
    { nameEN: "Dizziness", nameLA: "ວິນຫົວ" },
    { nameEN: "Runny Nose", nameLA: "ນ້ຳມູກຍ້ອຍ" },
  ];

  // Create symptoms and store them to link later
  const createdSymptoms = [];
  for (const sym of symptomData) {
    const s = await database.symptom.create({
      data: sym
    });
    createdSymptoms.push(s);
  }

  // ==========================================
  // 3. PRODUCTS (10 Items)
  // ==========================================
  console.log("... Seeding Products");

  const productData = [
    {
      nameEN: "Paracetamol 500mg",
      nameLA: "ພາຣາເຊຕາມອນ 500mg",
      category: Category.ANALGESIC_ANTIPYRETIC,
      catSub: CategorySub.NONE,
      generic: "Paracetamol",
      indication: "Relieves pain and fever / ບັນເທົາອາການປວດ ແລະ ຫຼຸດໄຂ້",
    },
    {
      nameEN: "Amoxicillin 500mg",
      nameLA: "ອາມົກຊີຊີລິນ 500mg",
      category: Category.ANTIBIOTICS,
      catSub: CategorySub.PENICILLINS,
      generic: "Amoxicillin",
      indication: "Treats bacterial infections / ຮັກສາການຕິດເຊື້ອແບັກທີເຣຍ",
      isPrescription: BooleanState.TRUE
    },
    {
      nameEN: "Ibuprofen 400mg",
      nameLA: "ໄອບູໂປຣເຟນ 400mg",
      category: Category.ANALGESIC_ANTIPYRETIC,
      catSub: CategorySub.NONE,
      generic: "Ibuprofen",
      indication: "Anti-inflammatory and pain relief / ຕ້ານການອັກເສບ ແລະ ແກ້ປວດ",
    },
    {
      nameEN: "Cetirizine 10mg",
      nameLA: "ເຊຕິຣິຊິນ 10mg",
      category: Category.ANTI_ALLERGIC,
      catSub: CategorySub.NONE,
      generic: "Cetirizine",
      indication: "Relieves allergy symptoms / ບັນເທົາອາການແພ້",
    },
    {
      nameEN: "Omeprazole 20mg",
      nameLA: "ໂອເມປຣາໂຊນ 20mg",
      category: Category.GASTROINTESTINAL,
      catSub: CategorySub.NONE,
      generic: "Omeprazole",
      indication: "Treats acid reflux / ຮັກສາອາການກົດໄຫຼຍ້ອນ",
    },
    {
      nameEN: "Vitamin C 1000mg",
      nameLA: "ວິຕາມິນ ຊີ 1000mg",
      category: Category.VITAMINS_MINERALS,
      catSub: CategorySub.NONE,
      generic: "Ascorbic Acid",
      indication: "Boosts immune system / ເສີມສ້າງພູມຄຸ້ມກັນ",
    },
    {
      nameEN: "ORS Powder",
      nameLA: "ຜົງເກືອແຮ່ ORS",
      category: Category.NUTRITION_ELECTROLYTE,
      catSub: CategorySub.NONE,
      generic: "Electrolytes",
      indication: "Rehydration / ທົດແທນນ້ຳ ແລະ ເກືອແຮ່",
    },
    {
      nameEN: "Domperidone",
      nameLA: "ດອມເພຣິໂດນ",
      category: Category.GASTROINTESTINAL,
      catSub: CategorySub.NONE,
      generic: "Domperidone",
      indication: "Relieves nausea and vomiting / ແກ້ອາການປວດຮາກ ແລະ ຮາກ",
    },
    {
      nameEN: "Azithromycin 250mg",
      nameLA: "ອາຊີໂທຣໄມຊິນ 250mg",
      category: Category.ANTIBIOTICS,
      catSub: CategorySub.MACROLIDES,
      generic: "Azithromycin",
      indication: "Antibiotic for respiratory infections / ຢາຕ້ານເຊື້ອສຳລັບລະບົບທາງເດີນຫາຍໃຈ",
      isPrescription: BooleanState.TRUE
    },
    {
      nameEN: "Metformin 500mg",
      nameLA: "ເມັດຟໍມິນ 500mg",
      category: Category.ANTI_DIABETIC,
      catSub: CategorySub.NONE,
      generic: "Metformin",
      indication: "Controls blood sugar / ຄວບຄຸມລະດັບນ້ຳຕານໃນເລືອດ",
      isPrescription: BooleanState.TRUE
    }
  ];

  const createdProducts = [];

  for (const [index, prod] of productData.entries()) {
    // Pick 2 random symptoms to connect to this product
    const randomSymptom1 = createdSymptoms[Math.floor(Math.random() * createdSymptoms.length)];
    const randomSymptom2 = createdSymptoms[Math.floor(Math.random() * createdSymptoms.length)];

    const p = await database.product.create({
      data: {
        nameEN: prod.nameEN,
        nameLA: prod.nameLA,
        slug: slugify(prod.nameEN) + `-${index}`, // Ensure uniqueness
        sku: `SKU-${1000 + index}`,
        genericName: prod.generic,
        dosage: "1 Tab/Cap",
        packaging: "Box of 10",
        indicationEN: prod.indication,
        indicationLA: prod.indication, // Using same string for demo, replace with real LA text if available
        category: prod.category,
        categorySub: prod.catSub,
        isPrescription: prod.isPrescription || BooleanState.FALSE,
        isActive: BooleanState.TRUE,
        createdById: admin.id,
        // Connect to Symptoms (Many-to-Many)
        symptoms: {
          connect: [
            { id: randomSymptom1.id },
            { id: randomSymptom2.id }
          ]
        }
      }
    });
    createdProducts.push(p);
  }

  // ==========================================
  // 4. ARTICLES (10 Items)
  // ==========================================
  console.log("... Seeding Articles");

  const articleTitles = [
    "How to prevent the Flu during rainy season",
    "Understanding Diabetes: Types and Treatments",
    "Benefits of Vitamin C for your skin",
    "Antibiotics Resistance: What you need to know",
    "Managing High Blood Pressure at home",
    "First Aid for Food Poisoning",
    "Why hydration is important for electrolytes",
    "Symptoms of Dengue Fever to watch out for",
    "Stomach Ulcers: Causes and Prevention",
    "Healthy diet for a strong heart"
  ];

  for (const [index, title] of articleTitles.entries()) {
    // Connect to 1 random product (Product Tie-in)
    const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];

    await database.article.create({
      data: {
        titleEN: title,
        titleLA: `ບົດຄວາມກ່ຽວກັບ: ${title}`, // Placeholder Lao title
        slug: slugify(title) + `-${index}`,
        contentEN: `<p>This is the content for <strong>${title}</strong>. It is very informative.</p>`,
        contentLA: `<p>ນີ້ແມ່ນເນື້ອໃນສຳລັບ <strong>${title}</strong>.</p>`,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        type: ArticleType.HEALTH_KNOWLEDGE,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
        createdById: admin.id,
        // Connect to Products (Tie-in)
        products: {
          connect: [
            { id: randomProduct.id }
          ]
        }
      }
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await database.$disconnect();
  });