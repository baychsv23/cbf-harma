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

const products = [
  { slug: "d-5-w-cbf", sku: "CBF-001", nameLA: "D-5-W CBF", nameEN: "D-5-W CBF", genericName: "Dextrose anhydrous", dosage: "5g/100ml", packaging: "1000 ມລ x 10 ຖົງ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອໃຫ້ພະລັງງານແກ່ຮ່າງກາຍ, ໃຊ້ເພື່ອປ້ອງກັນແລະປິ່ນປົວອາການຂາດນໍ້າໃນຮ່າງກາຍ. ໃຊ້ເປັນນໍ້າສັກສົ່ງເພື່ອສະດວກໃນການສົມທົບໃຫ້ຢາປິ່ນປົວເຂົ້າທາງເສັ້ນເລືອດດໍາ.ໃຊ້ເພື່ອປ້ອງກັນ ແລະ ປິ່ນປົວພະຍາດ Cetose ທີ່ມີສາຍເຫດມາຈາກການຂາດສານອາຫານ.", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "d-10-w-cbf", sku: "CBF-002", nameLA: "D-10-W CBF", nameEN: "D-10-W CBF", genericName: "Dextrose anhydrous", dosage: "10g/100ml", packaging: "500 ມລ x 20 ຖົງ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອໃຫ້ພະລັງງານແກ່ຮ່າງກາຍ, ໃຊ້ເພື່ອປ້ອງກັນອາການຂາດນໍ້າໃນຮ່າງກາຍໃຊ້ເປັນນໍ້າສັກສົ່ງເພື່ອສະດວກໃນການສົມທົບໃຫ້ຢາປິ່ນປົວເຂົ້າທາງເສັ້ນເລືອດດໍາ, ໃຊ້ເພື່ອປ້ອງກັນແລະປິ່ນປົວພະຍາດ Cetose ທີ່ມີສາເຫດມາຈາກການຂາດສານອາຫານ.", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "d-5-1-2s-cbf", sku: "CBF-003", nameLA: "D-5-1/2S CBF", nameEN: "D-5-1/2S CBF", genericName: "Dextrose anhydrous + Sodium Chloride", dosage: "5g + 0.45g / 100ml", packaging: "1000 ມລ x 10 ຖົງ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອໃຫ້ພະລັງງານແກ່ຮ່າງກາຍ, ໃຊ້ເພື່ອຮັກສາສົມດຸນອີອົງໃນຮ່າງກາຍ, ໃຊ້ເພື່ອທົດແທນການເສຍນໍ້າແຫ່ຮ່າງກາຍ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "d-5-1-3s-cbf", sku: "CBF-004", nameLA: "D-5-1/3S CBF", nameEN: "D-5-1/3S CBF", genericName: "Dextrose anhydrous + Sodium Chloride", dosage: "5g + 0.30g / 100ml", packaging: "1000 ມລ x 10 ຖົງ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອໃຫ້ພະລັງງານແກ່ຮ່າງກາຍ, ໃຊ້ເພື່ອຮັກສາສົມດຸນອີອົງໃນຮ່າງກາຍ, ໃຊ້ເພື່ອທົດແທນການເສຍນໍ້າແຫ່ຮ່າງກາຍ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "d-5-s-cbf", sku: "CBF-005", nameLA: "D-5-S CBF", nameEN: "D-5-S CBF", genericName: "Dextrose anhydrous + Sodium Chloride", dosage: "5g + 0.9g / 100ml", packaging: "1000 ມລ x 10 ຖົງ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອຮັກສາສົມດຸນອີອົງໃນຮ່າງກາຍໂດຍອີງໃສ່ອີອົງ Sodium (Na+) ແລະ ອີອົງ Clo( CI-)...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "d-5-r-cbf", sku: "CBF-006", nameLA: "D-5-R CBF", nameEN: "D-5-R CBF", genericName: "Dextrose + NaCl + KCl + CaCl2 + NaLactate", dosage: "5g + 0.6g + 0.04g + 0.027g + 0.32g / 100ml", packaging: "1000 ມລ x 10 ຖົງ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອທົດແທນການເສຍນໍ້າໃນຮ່າງກາຍ, ໃຊ້ເປັນນໍ້າສັກສົ່ງເພື່ອສະດວກໃນການສົມທົບໃຫ້ຢາປິ່ນປົວເຂົ້າທາງເສັ້ນເລືອດດໍາ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "glucose", sku: "CBF-007", nameLA: "GLUCOSE", nameEN: "GLUCOSE", genericName: "Dextrose anhydrous", dosage: "5 g/10ml", packaging: "10 ຫຼອດ/ກັບ x 45/ແກັດ", indicationLA: "ຂາດນໍ້າຕານໃນເລືອດ, ພິດເບື່ອຈາກຢາທໍາມີນສະຫຼົບ, ພິດເບື່ອຂອງໂລຫະໜັກ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "mannitol", sku: "CBF-008", nameLA: "MANNITOL", nameEN: "MANNITOL", genericName: "D-mannitol", dosage: "20g/100ml", packaging: "500 ມລ x 20 ຖົງ/ແກັດ", indicationLA: "ປ້ອງກັນໄຂ່ຫຼັງຖືກທໍາລາຍໃນກໍລະນີຄວາມດັນຫຼຸດກະທັນຫັນ, ຂັບຍ່ຽວຫຼັງການຜ່າຕັດ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "n-s-s-cbf", sku: "CBF-009", nameLA: "N-S-S CBF", nameEN: "N-S-S CBF", genericName: "Sodium Chloride", dosage: "0.9g/100ml", packaging: "1000 ມລ x 10 ຖົງ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອຮັກສາສົມດຸ່ນບັນດາອີອົງໃນຮ່າງກາຍໂດຍອີງໃສ່ອິອົງ Sodium (Na+) ແລະ ອິອົງ Clo (Cl-)...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "orasol-white", sku: "CBF-010", nameLA: "ORASOL WHITE", nameEN: "ORASOL WHITE", genericName: "Glucose + NaCl + Tri Sodium Citrate + KCl", dosage: null, packaging: "30 ຊອງ/ກັບ x 12 ກັບ/ແກັດ", indicationLA: "ໃຊ້ທົດແທນການສູນເສຍນໍ້າໃນຮ່າງກາຍ ແລະ ການສູນເສຍທາດອີເລັກໂທຣໄລ ເນື່ອງຈາກຂາດນໍ້າ.", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "orasol-orange", sku: "CBF-011", nameLA: "ORASOL ORANGE", nameEN: "ORASOL ORANGE", genericName: "Glucose + NaCl + Citric acid + Tri Sodium Citrate + KCl", dosage: null, packaging: "30 ຊອງ/ກັບ x 12 ກັບ/ແກັດ", indicationLA: "ໃຊ້ທົດແທນການສູນເສຍນໍ້າໃນຮ່າງກາຍ ແລະ ການສູນເສຍທາດອີເລັກໂທຣໄລ ເນື່ອງຈາກຂາດນໍ້າ.", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "polamine", sku: "CBF-012", nameLA: "POLAMINE", nameEN: "POLAMINE", genericName: "Amino Acids", dosage: null, packaging: "500 ມລ x 12 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ສໍາລັບໃນກໍລະນີລະບົບຍ່ອຍໂປຣເຕອິນປັ່ນປ່ວນ ແລະ ຄວາມສາມາດໃນການດູດຊຶມສານອາຫານບົກຜ່ອງ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "polyglukyl", sku: "CBF-013", nameLA: "POLYGLUKYL", nameEN: "POLYGLUKYL", genericName: "Dextran 70 + Sodium Chloride", dosage: "30g + 4.5g / 500ml", packaging: "500 ມລ x 12 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ທົດແທນປລາສະມາຍ້ອນເສຍເລືອດເນື່ອງຈາກການຜ່າຕັດ ຫຼື ບາດເຈັບໜັກ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "ringer-acetate", sku: "CBF-014", nameLA: "RINGER ACETATE", nameEN: "RINGER ACETATE", genericName: "NaCl + KCl + CaCl2 + Sodium Acetate", dosage: "0.6g + 0.03g + 0.022g + 0.38g / 100ml", packaging: "1000 ມລ x 10 ຖົງ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອທົດແທນການເສຍນໍ້າໃນຮ່າງກາຍໂດຍສະເພາະແມ່ນນໍ້ານອກຈຸລັງ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "ringer-lactate", sku: "CBF-015", nameLA: "RINGER LACTATE", nameEN: "RINGER LACTATE", genericName: "NaCl + KCl + CaCl2 + Sodium Lactate", dosage: "0.6g + 0.04g + 0.028g + 0.32g / 100ml", packaging: "1000 ມລ x 10 ຖົງ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອທົດແທນການເສຍນໍ້າໃນຮ່າງກາຍໂດຍສະເພາະແມ່ນນໍ້ານອກຈຸລັງ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "stemina", sku: "CBF-016", nameLA: "STEMINA", nameEN: "STEMINA", genericName: "Dextrose + Riboflavin + Nicotinamide + Pyridoxine", dosage: "25g + 10mg + 125mg + 10mg / 500ml", packaging: "500 ມລ x 12 ຂວດ/ແກັດ", indicationLA: "ຊ່ວຍໃຫ້ພະລັງງານໃຊ້ສໍາລັບຜູ້ທີ່ມີສຸຂະພາບອ່ອນເພຍ, ຜູ້ອອກແຮງງານໜັກ, ຜູ້ປ່ວຍໃນໄລຍະພັກພື້ນ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.NUTRITION_ELECTROLYTE, categorySub: CategorySub.NONE },
  { slug: "amoxin-125", sku: "CBF-017", nameLA: "AMOXIN 125", nameEN: "AMOXIN 125", genericName: "Amoxicillin", dosage: "125mg/5ml", packaging: "ຂວດ 60 ມລ/ກັບ, 108 ຂວດ/ແກັດ", indicationLA: "ຢາຕ້ານເຊື້ອທີ່ມີຜົນກ້ວາງຂວາງໃຊ້ປິ່ນປົວການຕິດເຊື້ອຕາມທາງເດີນຫາຍໃຈ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.PENICILLINS },
  { slug: "amoxin-250", sku: "CBF-018", nameLA: "AMOXIN 250", nameEN: "AMOXIN 250", genericName: "Amoxicillin", dosage: "250mg/5ml", packaging: "ຂວດ 60 ມລ/ກັບ, 108 ຂວດ/ແກັດ", indicationLA: "ຢາຕ້ານເຊື້ອທີ່ມີຜົນກ້ວາງຂວາງໃຊ້ປິ່ນປົວການຕິດເຊື້ອຕາມທາງເດີນຫາຍໃຈ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.PENICILLINS },
  { slug: "amox-cbf", sku: "CBF-019", nameLA: "AMOX-CBF", nameEN: "AMOX-CBF", genericName: "Amoxicillin trihydrate", dosage: "500mg", packaging: "10 ແຄບຊຸນ x 50 ແຝງ x 16 ກັບ/ແກັດ", indicationLA: "ປິ່ນປົວອາການຕິດເຊື້ອຕ່າງໆເຊັ່ນ: ການຕິດເຊື້ອທາງເດີນຫາຍໃຈ, ການຕິດເຊື້ອທາງເດີນອາຫານ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.PENICILLINS },
  { slug: "amoxin-cbf-1g", sku: "CBF-020", nameLA: "AMOXIN-CBF 1g", nameEN: "AMOXIN-CBF 1g", genericName: "Amoxicillin Sodium", dosage: "1g", packaging: "1 ຂວດ x 400 ກັບ/ແກັດ", indicationLA: "ໃຊ້ສໍາຫຼັບປິ່ນປົວການຕິດເຊື້ອທາງເດີນຫາຍໃຈ, ອັກເສບຫູຊັ້ນກາງ, ການຕິດເຊື້ອທາງເດິນປັດສະວະ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.PENICILLINS },
  { slug: "ampicin-dry", sku: "CBF-021", nameLA: "AMPICIN.DRY", nameEN: "AMPICIN.DRY", genericName: "Ampicillin", dosage: "125mg", packaging: "ຂວດ 60 ມລ/ກັບ, 108 ຂວດ/ແກັດ", indicationLA: "ຢາຕ້ານເຊື້ອທີ່ມີຜົນກ້ວາງຂວາງໃຊ້ປິ່ນປົວການຕິດເຊື້ອຕາມທາງເດີນຫາຍໃຈ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.PENICILLINS },
  { slug: "penicin-100000", sku: "CBF-022", nameLA: "PENICIN 100.000 IU", nameEN: "PENICIN 100.000 IU", genericName: "Phenoxymethyl Penicillin", dosage: "100.000 IU", packaging: "ຂວດ 60 ມລ/ກັບ, 108 ຂວດ/ແກັດ", indicationLA: "ປິ່ນປົວພະຍາດຫູ - ດັງ - ຄໍ, ຕາອັກເສບ, ຕິດເຊື້ອທາງເດີນອາຫານ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.PENICILLINS },
  { slug: "penicin-200000", sku: "CBF-023", nameLA: "PENICIN 200.000 IU", nameEN: "PENICIN 200.000 IU", genericName: "Phenoxymethyl Penicillin", dosage: "200.000 IU", packaging: "ຂວດ 60 ມລ/ກັບ, 108 ຂວດ/ແກັດ", indicationLA: "ປິ່ນປົວພະຍາດຫູ - ດັງ - ຄໍ, ຕາອັກເສບ, ຕິດເຊື້ອທາງເດີນອາຫານ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.PENICILLINS },
  { slug: "peni-zem", sku: "CBF-024", nameLA: "PENI-ZEM", nameEN: "PENI-ZEM", genericName: "Phenoxymethyl Penicilin", dosage: "400.000 IU", packaging: "10 ເມັດ x 50 ແຝງ x 40 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວການຕິດເຊື້ອທາງເດິນຫາຍໃຈສ່ວນເທິງ, ຄໍອັກເສບ, ອາມິດານ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.PENICILLINS },
  { slug: "cephacin", sku: "CBF-025", nameLA: "CEPHACIN", nameEN: "CEPHACIN", genericName: "Cephalexin Monohydrate", dosage: "125mg/5ml", packaging: "ຂວດ 60 ມລ/ກັບ, 108 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວການຕິດເຊື້ອຕາມລະບົບທາງເດີນຫາຍໃຈ, ຜິວໜັງ, ເນື້ອເຍື່ອ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.CEPHALOSPORINS },
  { slug: "cefadex", sku: "CBF-026", nameLA: "CEFADEX", nameEN: "CEFADEX", genericName: "Cephalexin Anhydrous", dosage: "250mg/5ml", packaging: "ຂວດ 60 ມລ/ກັບ, 108 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວການຕິດເຊື້ອຕາມລະບົບທາງເດີນປັດສະວະ, ຕິດເຊື້ອລະບົບຫາຍໃຈ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.CEPHALOSPORINS },
  { slug: "cepha-cbf", sku: "CBF-027", nameLA: "СЕРНА-CBF", nameEN: "СЕРНА-CBF", genericName: "Cephalexin", dosage: "500mg", packaging: "10 ແຄບຊູນ x 50 ແຝງ x 20 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວການຕິດເຊື້ອຕາມທາງເດີນຫາຍໃຈ, ຫຼອດປອດ, ຫູ, ດັງ, ຄໍ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.CEPHALOSPORINS },
  { slug: "cefix-200", sku: "CBF-028", nameLA: "CEFIX-200", nameEN: "CEFIX-200", genericName: "Cefixime", dosage: "200mg", packaging: "10 ເມັດ x 10 ແຝງ x 50 ກັບ/ແກັດ", indicationLA: "ໃຊ້ໃນການປິ່ນປົວອາການຕິດເຊື້ອໃນລະບົບທາງເດີນຫາຍໃຈ: ອັກເສບຫູກາງ, ອັກເສບປອດຮຸນແຮງ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.CEPHALOSPORINS },
  { slug: "cefix-400", sku: "CBF-029", nameLA: "CEFIX 400", nameEN: "CEFIX 400", genericName: "Cefixime", dosage: "400mg", packaging: "10 ເມັດ x 10 ແຝງ x 72 ກັບ/ແກັດ", indicationLA: "ໃຊ້ໃນການປິ່ນປົວອາການຕິດເຊື້ອໃນລະບົບທາງເດີນຫາຍໃຈ: ອັກເສບຫູກາງ, ອັກເສບປອດຮຸນແຮງ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.CEPHALOSPORINS },
  { slug: "ceftria-cbf", sku: "CBF-030", nameLA: "CEFTRIA-CBF", nameEN: "CEFTRIA-CBF", genericName: "Ceftriaxone Sodium", dosage: "1g", packaging: "1 ຫຼອດ x 400 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວອາການຕິດເຊື້ອຮຸນແຮງທີ່ເກີດຈາກການຕິດເຊື້ອແບັກທີເຣຍທີ່ໄວຕໍ່ Ceftriaxone...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.CEPHALOSPORINS },
  { slug: "azithromax-250", sku: "CBF-031", nameLA: "AZITHROMAX 250", nameEN: "AZITHROMAX 250", genericName: "Azithromycin", dosage: "250mg", packaging: "6 ເມັດ x 10 ແຝງ x 69 ກັບ/ແກັດ", indicationLA: "ໃຊ້ໃນການປິ່ນປົວການຕິດເຊື້ອຕາມທາງເດີນຫາຍໃຈອັກເສບປອດ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.MACROLIDES },
  { slug: "azithromax-500", sku: "CBF-032", nameLA: "AZITHROMAX 500", nameEN: "AZITHROMAX 500", genericName: "Azithromycin", dosage: "500mg", packaging: "3 ເມັດ x 10 ແຝງ x 120 ກັບ/ແກັດ", indicationLA: "ໃຊ້ໃນການປິ່ນປົວການຕິດເຊື້ອຕາມທາງເດີນຫາຍໃຈອັກເສບປອດ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.MACROLIDES },
  { slug: "claritab-500", sku: "CBF-033", nameLA: "CLARITAB 500", nameEN: "CLARITAB 500", genericName: "Clarithromycin", dosage: "500mg", packaging: "10 ເມັດ x 25 ແຝງ x 32 ກັບ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອປິ່ນປົວການອັກເສບອາມີດານ, ຫູຊັ້ນກາງ, ຫຼອດລົມ, ປອດ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.MACROLIDES },
  { slug: "ery-250", sku: "CBF-034", nameLA: "ERY 250", nameEN: "ERY 250", genericName: "Erytromycin stearate", dosage: "250mg", packaging: "10 ເມັດ x 40 ແຝງ x 25 ກັບ/ແກັດ", indicationLA: "ເປັນຢາຕ້ານເຊື້ອທີ່ມີຜົນກວ້າງຂວາງໃຊ້ປິ່ນປົວອາການຕິດເຊື້ອ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.MACROLIDES },
  { slug: "ery-500", sku: "CBF-035", nameLA: "ERY 500", nameEN: "ERY 500", genericName: "Erytromycin stearate", dosage: "500mg", packaging: "10 ເມັດ x 25 ແຝງ x 32 ກັບ/ແກັດ", indicationLA: "ເປັນຢາຕ້ານເຊື້ອທີ່ມີຜົນກ້ວາງຂວາງໃຊ້ປິ່ນປົວອາການຕິດເຊື້ອ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.MACROLIDES },
  { slug: "ery-dry", sku: "CBF-036", nameLA: "ERY. DRY", nameEN: "ERY. DRY", genericName: "Erythromycin", dosage: "125mg/5ml", packaging: "ຂວດ 60 ມລ/ກັບ, 108 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວການຕິດເຊື້ອຕາມທາງເດີນປັດສະວະ, ລະບົບສືບພັນລວມທັງຕ່ອມໂປສຕັດ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.MACROLIDES },
  { slug: "ciproflox", sku: "CBF-037", nameLA: "CIPROFLOX", nameEN: "CIPROFLOX", genericName: "Ciprofloxacin", dosage: "200mg/100ml", packaging: "100 ມລ x 48 ຂວດ/ແກັດ", indicationLA: "ກໍລະນີຕິດເຊື້ອຮຸນແຮງທີ່ ຢາຕ້ານເຊື້ອທຳມະດາຊະນິດອື່ນບໍ່ສາມາດຍັບຍັ້ງໄດ້...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.QUINOLONES },
  { slug: "levoflox-500", sku: "CBF-038", nameLA: "LEVOFLOX-500", nameEN: "LEVOFLOX-500", genericName: "Levofloxacin", dosage: "500mg", packaging: "100 ມລ/ຂວດ x 48 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວອາການຕິດເຊື້ອຮ້າຍແຮງຫຼືປານກາງເຊັ່ນ: ອັກເສບຜົ້ງດັງອັກເສບຫູຊັ້ນກາງ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.QUINOLONES },
  { slug: "norflox-400", sku: "CBF-039", nameLA: "NORFLOX-400", nameEN: "NORFLOX-400", genericName: "Norfloxacin", dosage: "400mg", packaging: "10 ເມັດ x 20 ແຝງ x 24 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວການຕິດເຊື້ອຕ່າງໆເຊັ່ນ: ການຕິດເຊື້ອທາງເດີນອາຫານ, ການຕິດເຊື້ອທາງເດີນປັດສະວະ.", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.QUINOLONES },
  { slug: "ofloxin-200", sku: "CBF-040", nameLA: "OFLOXIN 200", nameEN: "OFLOXIN 200", genericName: "Ofloxacin", dosage: "200mg", packaging: "10 ເມັດ x 20 ແຝງ x 24 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວການອັກເສບຫຼອດລົມຮຸນແຮງ, ອັກເສບປອດ, ຕິດເຊື້ອChlamydia...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.QUINOLONES },
  { slug: "bidiseptol", sku: "CBF-041", nameLA: "BIDISEPTOL", nameEN: "BIDISEPTOL", genericName: "Sulfamethoxazole + Trimethoprim", dosage: "200mg + 40mg", packaging: "ຂວດ 60 ມລ/ກັບ, 96 ຂວດ/ແກັດ", indicationLA: "ປິ່ນປົວພະຍາດທີ່ເກີດມາຈາກການຕິດເຊື້ອເຊັ່ນ: ອາການອັກເສບ, ຕາມທາງເດີນຫາຍໃຈ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.SULFONAMIDES },
  { slug: "biseptrim", sku: "CBF-042", nameLA: "BISEPTRIM", nameEN: "BISEPTRIM", genericName: "Sulfamethoxazole + Trimethoprim", dosage: "400mg + 80mg", packaging: "10 ເມັດ x 20 ແຝງ x 24 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວການຕິດເຊື້ອລະບົບຫາຍໃຈ, ອັກເສບຫູກາງ, ອັກເສບທາງເດີນປັດສະວະ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.SULFONAMIDES },
  { slug: "metronidazol-iv", sku: "CBF-043", nameLA: "METRONIDAZOL", nameEN: "METRONIDAZOL", genericName: "Metronidazole", dosage: "500mg/100ml", packaging: "100 ມລ x 48 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອປ້ອງກັນ ແລະ ປິ່ນປົວການຊຶມເຊື້ອທີ່ອາດເກີດຂຶ້ນພາຍຫຼັງການຜ່າຕັດ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.TINIDAZOLES },
  { slug: "metronidazol-tab", sku: "CBF-044", nameLA: "METRONIDAZOL 250", nameEN: "METRONIDAZOL 250", genericName: "Metronidazole", dosage: "250mg", packaging: "10 ເມັດ x 40 ແຝງ x 25 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປ້ອງກັນການຕິດເຊື້ອເຊິ່ງເກີດມາຈາກເຊື້ອພະຍາດປະເພດ Anaertobies...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.TINIDAZOLES },
  { slug: "metrozol-500", sku: "CBF-045", nameLA: "METROZOL 500", nameEN: "METROZOL 500", genericName: "Metronidazole", dosage: "500mg", packaging: "10 ເມັດ x 20 ແຝງ x 24 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປ້ອງກັນການຕິດເຊື້ອເຊິ່ງເກີດມາຈາກເຊື້ອພະຍາດປະເພດ Anaertobies...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.TINIDAZOLES },
  { slug: "gentamicin", sku: "CBF-046", nameLA: "GENTAMICIN", nameEN: "GENTAMICIN", genericName: "Gentamicin Sulphate", dosage: "80mg/2ml", packaging: "2 ມລ x 10 ຫຼອດ x 100 ກັບ/ແກັດ", indicationLA: "ນໍາໃຊ້ໃນກໍລະນີຕິດເຊື້ອຕາມລະບົບທາງເດີນປັດສະວະ ແລະ ລະບົບສືບພັນ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTIBIOTICS, categorySub: CategorySub.AMINOGLYCOSIDES },
  { slug: "meben-500", sku: "CBF-047", nameLA: "MEBEN 500", nameEN: "MEBEN 500", genericName: "Mebendazole", dosage: "500mg", packaging: "1 ເມັດ x 12 ແຝງ x 48 ກັບ/ແກັດ", indicationLA: "ໃຊ້ຖ່າຍພະຍາດເສັ້ນດ້າຍ ແລະ ໂຕກົມຊະນິດຕ່າງໆ", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANTI_PARASITIC, categorySub: CategorySub.NONE },
  { slug: "alumag", sku: "CBF-048", nameLA: "ALUMAG", nameEN: "ALUMAG", genericName: "Aluminium hydroxide + Magnesium Trisilicate", dosage: "120mg + 250mg", packaging: "1000 ເມັດ x 15 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ບັນເທົາອາການຈຸກແໜ້ນທ້ອງອັນເນື່ອງມາຈາກມີແກັສໃນກະເພາະອາຫານ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.GASTROINTESTINAL, categorySub: CategorySub.NONE },
  { slug: "berberin", sku: "CBF-049", nameLA: "BERBERIN", nameEN: "BERBERIN", genericName: "Berberin Hydrochloride", dosage: "50mg", packaging: "500 ເມັດ x 108 ຂວດ/ແກັດ", indicationLA: "ແບກເບຣິນ50ເປັນຢາທີ່ສະກັດຈາກພືດທຳມະຊາດ (ເຄືອແຮ່ມ) ໃຊ້ໃນກໍລະນີ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.GASTROINTESTINAL, categorySub: CategorySub.NONE },
  { slug: "cimetidin-200", sku: "CBF-050", nameLA: "CIMETIDIN 200", nameEN: "CIMETIDIN 200", genericName: "Cimetidine", dosage: "200mg/2ml", packaging: "2 ມລ x 10 ຫຼອດ x 88 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວບາດແຜໃນກະເພາະອາຫານ ແລະ ກະເພາະລໍາໄສ້ເນື່ອງຈາກການນໍາໃຊ້ຢາ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.GASTROINTESTINAL, categorySub: CategorySub.NONE },
  { slug: "cimetidine", sku: "CBF-051", nameLA: "CIMETIDINE", nameEN: "CIMETIDINE", genericName: "Cimetidine", dosage: "400mg", packaging: "10 ເມັດ x 25 ແຝງ x 32 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວອາການອັກເສບ ຫຼື ເປັນແຜໃນລຳໄສ້ອ່ອນຕອນຕົ້ນ (Duodenal)...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.GASTROINTESTINAL, categorySub: CategorySub.NONE },
  { slug: "hammate-100", sku: "CBF-052", nameLA: "HAMMATE 100", nameEN: "HAMMATE 100", genericName: "Berberin Hydrochloride", dosage: "100mg", packaging: "10 ແຄັບຊຸນ x 2 ແຝງ x 192 ກັບ/ແກັດ", indicationLA: "ເປັນຢາທີ່ສະກັດຈາກພືດທຳມະຊາດ(ເຄືອແຮ່ມ) ໃຊ້ໃນກໍລະນີມີອາການຊຶມເຊື້ອ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.GASTROINTESTINAL, categorySub: CategorySub.NONE },
  { slug: "ome-cap", sku: "CBF-053", nameLA: "OME-CAP", nameEN: "OME-CAP", genericName: "Omeprazole", dosage: "20mg", packaging: "10 ແຄັບຊຸນ x 2 ແຝງ x 200 ກັບ/ແກັດ", indicationLA: "ປິ່ນປົວອາການກົດໄຫຼຍ້ອນ, ເປັນບາດແຜໃນກະເພາະອາຫານ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.GASTROINTESTINAL, categorySub: CategorySub.NONE },
  { slug: "omepaz", sku: "CBF-054", nameLA: "OMEPAZ", nameEN: "OMEPAZ", genericName: "Omeprazole", dosage: "40mg/vial", packaging: "1 ກ່ອງ x 200 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວອາການກົດກະເພາະໄຫຼຍ້ອນ-ອັກເສບຫຼອດອາຫານ (ແສບໝາກໂພກ-ເອື້ອມສົ້ມ)...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.GASTROINTESTINAL, categorySub: CategorySub.NONE },
  { slug: "sorbitol", sku: "CBF-055", nameLA: "SORBITOL", nameEN: "SORBITOL", genericName: "Sorbitol", dosage: "5g / sach", packaging: "25 ຊອງ x 5 g x 45 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວພະຍາດກ່ຽວກັບລະບົບລະລາຍອາຫານເຊັ່ນ: - ການຍ່ອຍອາຫານຊ້າ ຫຼື ຍ່ອຍຍາກ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.GASTROINTESTINAL, categorySub: CategorySub.NONE },
  { slug: "subtilis", sku: "CBF-056", nameLA: "SUBTILIS", nameEN: "SUBTILIS", genericName: "Bacillus Subtilis", dosage: "100 millions/1g", packaging: "50 ຊອງ x 1 g/ກັບ x 66 ກັບ/ແກັດ", indicationLA: "ໃຊ້ໃນກໍລະນີເກີດອາການປັ່ນປວ່ນໃນກະເພາະ-ລຳໄສ້, ອາການຖອກທ້ອງຍ້ອນການໃຊ້ຢາຕ້ານເຊື້ອແກ່ຍາວ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.GASTROINTESTINAL, categorySub: CategorySub.NONE },
  { slug: "amlodipine", sku: "CBF-057", nameLA: "AMLODIPINE", nameEN: "AMLODIPINE", genericName: "Amlodipine besylate", dosage: "10mg", packaging: "10 ເມັດ x 10 ແຝງ x 50 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວໂຣກຄວາມດັນເລືອດສູງ (ໃນຄົນເຈັບທີ່ມີພາວະແຊກຊ້ອນເຊັ່ນ: ໂຣກເບົາຫວານ )...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.CARDIOVASCULAR, categorySub: CategorySub.NONE },
  { slug: "atorvastatin", sku: "CBF-058", nameLA: "ATORVASTATIN", nameEN: "ATORVASTATIN", genericName: "Atorvastatin Calcium", dosage: "20mg", packaging: "10 ເມັດ x 10 ແຝງ x 135 ກັບ/ແກັດ", indicationLA: "ໃຊ້ເພື່ອປິ່ນປົວໂຣກໄຂມັນ Cholesterol ໃນເລືອດສູງ ແລະ ປັ່ນປ່ວນ Lipid ໃນເລືອດ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.CARDIOVASCULAR, categorySub: CategorySub.NONE },
  { slug: "enalapril-20", sku: "CBF-059", nameLA: "ENALAPRIL 20", nameEN: "ENALAPRIL 20", genericName: "Enalapril Maleate", dosage: "20mg", packaging: "10 ເມັດ x 3 ແຝງ x 50 ກັບ/ແກັດ", indicationLA: "ຢາ Enalapril ເປັນຢາທາງເລືອກ ໃຊ້ສໍາລັບກໍລະນີ: - ຄວາມດັນເລືອດສູງທີ່ບໍ່ຮູ້ສາເຫດ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.CARDIOVASCULAR, categorySub: CategorySub.NONE },
  { slug: "losartan-50", sku: "CBF-060", nameLA: "LOSARTAN 50", nameEN: "LOSARTAN 50", genericName: "Losartan potassium", dosage: "50mg", packaging: "10 ເມັດ x 3 ແຝງ x 135 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວໂຣກຄວາມດັນເລືອດສູງໃນຄົນເຈັບທີ່ມີພາວະແຊກຊ້ອນເຊັ່ນ: ໂຣກເບົາຫວານ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.CARDIOVASCULAR, categorySub: CategorySub.NONE },
  { slug: "nikethamide", sku: "CBF-061", nameLA: "NIKETHAMIDE", nameEN: "NIKETHAMIDE", genericName: "Nikethamide", dosage: "500mg/2ml", packaging: "2 ມລ x 10 ຫຼອດ x 100 ກັບ/ແກັດ", indicationLA: "ໃຊ້ເປັນຢາເຊີດ ກໍລະນີ ຊັອກ ຫຼື ເປັນລົມ ໂດຍບໍ່ທັນຮູ້ສາເຫດຈະແຈ້ງ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.CARDIOVASCULAR, categorySub: CategorySub.NONE },
  { slug: "gliben-5", sku: "CBF-062", nameLA: "GLIBEN 5", nameEN: "GLIBEN 5", genericName: "Glibenclamide", dosage: "5mg", packaging: "10 ເມັດ x 10 ແຝງ x 162 ກັບ/ແກັດ", indicationLA: "Glibenclamide ແມ່ນຈັດຢູ່ໃນກຸ່ມຂອງຢາປົວໂຣກເບົາຫວານ ໝວດ Sulfonylureas...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTI_DIABETIC, categorySub: CategorySub.NONE },
  { slug: "metformin-500", sku: "CBF-063", nameLA: "METFORMIN 500", nameEN: "METFORMIN 500", genericName: "Metformin HCl", dosage: "500mg", packaging: "10 ເມັດ x 40 ແຝງ x 25 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວໂຣກເບົາຫວານທີ່ ຕໍ່ຢາ Insulin (type II). ໃຊ້ເປັນຢາດ່ຽວໃນກໍລະນີທີ່ບໍ່ສາມາດຄວບຄຸມລະດັບນໍ້າຕານໄດ້ດ້ວຍການຄວບຄຸມອາຫານ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTI_DIABETIC, categorySub: CategorySub.NONE },
  { slug: "bromex", sku: "CBF-064", nameLA: "BROMEX", nameEN: "BROMEX", genericName: "Bromhexine hydrochloride", dosage: "4mg/5ml", packaging: "ຂວດ 60 ມລ/ກັບ x 96 ຂວດ/ແກັດ", indicationLA: "ເປັນຢາຊ່ວຍຂັບ ແລະ ລະລາຍເສມຫະ, ບັນເທົາອາການໄອເຊິ່ງມີສາເຫດມາຈາກອາການອັກເສບປອດ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.RESPIRATORY, categorySub: CategorySub.NONE },
  { slug: "bisolmex", sku: "CBF-065", nameLA: "BISOLMEX", nameEN: "BISOLMEX", genericName: "Bromhexine hydrochloride", dosage: "8mg", packaging: "10 ເມັດ x 10 ແຝງ x 50 ກັບ/ແກັດ", indicationLA: "ເປັນຢາລະລາຍເສມຫະ, ບັນເທົາອາການໄອ, ໃຊ້ໃນກໍລະນີອັກເສບຫຼອດລົມ, ອັກເສບປອດແບບຮຸນແຮງ ຫຼື ຊຳເຮື້ອ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.RESPIRATORY, categorySub: CategorySub.NONE },
  { slug: "bisolmex-s", sku: "CBF-066", nameLA: "BISOLMEX - S", nameEN: "BISOLMEX - S", genericName: "Bromhexine hydrochloride", dosage: "4mg", packaging: "10 ເມັດ x 25 ແຝງ x 72 ກັບ/ແກັດ", indicationLA: "ເປັນຢາໃຊ້ລະລາຍເສມຫະໃນອາການຫວັດ, ກໍລະນີອັກເສບຫຼອດລົມບັນເທົາອາການໄອ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.RESPIRATORY, categorySub: CategorySub.NONE },
  { slug: "saltamol", sku: "CBF-067", nameLA: "SALTAMOL", nameEN: "SALTAMOL", genericName: "Salbutamol Sulphate", dosage: "2mg", packaging: "10 ເມັດ x 25 ແຝງ x 72 ກັບ/ແກັດ", indicationLA: "ໃຊ້ເປັນຢາຊ່ວຍຂະຫຍາຍຫຼອດລົມ, ໃຊ້ປ້ອງກັນ ແລະ ປິ່ນປົວອາການຫາຍໃຈພືດ ຫຼື ຫາຍໃຈຍາກ (Wheezing)...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.RESPIRATORY, categorySub: CategorySub.NONE },
  { slug: "terpin-benzoat", sku: "CBF-068", nameLA: "TERPIN BENZOAT", nameEN: "TERPIN BENZOAT", genericName: "Terpin Benzoate", dosage: null, packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.RESPIRATORY, categorySub: CategorySub.NONE },
  { slug: "cetirizine", sku: "CBF-069", nameLA: "CETIRIZINE", nameEN: "CETIRIZINE", genericName: "Cetirizine Hydrochloride", dosage: "10mg", packaging: "10 ເມັດ x 10 ແຝງ x 162 ກັບ / ແກັດ", indicationLA: "ໃຊ້ໃນການປ້ອງກັນ ຫຼື ປິ່ນປົວອາການໄຂ້ຕາມລະດູການ ແລະ ອາການອື່ນໆທີ່ເປັນໂຣກພູມແພ້ທາງເດີນຫາຍໃຈສ່ວນເທິງ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANTI_ALLERGIC, categorySub: CategorySub.NONE },
  { slug: "cetirizine-syrup", sku: "CBF-070", nameLA: "CETIRIZINE Syrup", nameEN: "CETIRIZINE Syrup", genericName: "Cetirizine Hydrochloride", dosage: "5mg/5ml", packaging: "ຂວດ 60 ມລ/ກັບ x 96 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ໃນການປ້ອງກັນ ຫຼື ປິ່ນປົວອາການໄຂ້ຕາມລະດູການ ແລະ ອາການອື່ນໆທີ່ເປັນໂຣກພູມແພ້ທາງເດີນຫາຍໃຈສ່ວນເທິງ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANTI_ALLERGIC, categorySub: CategorySub.NONE },
  { slug: "chlorphemin", sku: "CBF-071", nameLA: "CHLORPHEMIN", nameEN: "CHLORPHEMIN", genericName: "Chlorpheniramine Maleate", dosage: "4mg", packaging: "10 ເມັດ x 25 ແຝງ x 72 ກັບ/ແກັດ", indicationLA: "ປິ່ນປົວອາການຕ່າງໆເນື່ອງມາຈາກພູມແພ້ເຊັ່ນ: ມຸ່ນມານ, ຟົດຟື້ນຄັນ, ອັກເສບດັງ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANTI_ALLERGIC, categorySub: CategorySub.NONE },
  { slug: "chlorpheniramine", sku: "CBF-072", nameLA: "CHLORPHENIRAMINE", nameEN: "CHLORPHENIRAMINE", genericName: "Chlorpheniramine Maleate", dosage: "2mg/5ml", packaging: "ຂວດ 60 ມລ x 96 ຂວດ/ແກັດ", indicationLA: "ເປັນຢາແກ້ອາການແພ້ຕ່າງໆ ເຊັ່ນ: ອາການແພ້ອາກາດ, ອາການແພ້ຍ້ອນຝຸ່ນລະອອງ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANTI_ALLERGIC, categorySub: CategorySub.NONE },
  { slug: "dexamethasone", sku: "CBF-073", nameLA: "DEXAMETHASONE", nameEN: "DEXAMETHASONE", genericName: "Dexamethasone Acetate", dosage: "0.5mg", packaging: "500 ເມັດ x 108 ຂວດ/ແກັດ", indicationLA: "ປິ່ນປົວອາການອັກເສບ ແລະ ອາການແພ້, ໃຊ້ໄດ້ໃນທຸກກໍລະນີທີ່ນໍາໃຊ້ໝວດຢາ Corticosteroide...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANTI_ALLERGIC, categorySub: CategorySub.NONE },
  { slug: "fexofen", sku: "CBF-074", nameLA: "FEXOFEN", nameEN: "FEXOFEN", genericName: "Fexofenadine HCI", dosage: "60mg", packaging: "10 ເມັດ x 10 ແຝງ x 50 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວອາການພູມແພ້ຕ່າງໆເຊັ່ນ: ຄັນດັ່ງ, ຕັນດັງ, ຈາມ, ນໍ້າມຸກໄຫຼ, ຄັນໃນຮູຄໍ, ນໍ້າຕາໄຫຼ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANTI_ALLERGIC, categorySub: CategorySub.NONE },
  { slug: "polaremin", sku: "CBF-075", nameLA: "POLAREMIN", nameEN: "POLAREMIN", genericName: "Chlorpheniramin maleat", dosage: "2mg", packaging: "10 ເມັດ x 10 ແຝງ x 174 ກັບ/ແກັດ", indicationLA: "ປິ່ນປົວອາການຕ່າງໆເນື່ອງມາຈາກພູມແພ້ເຊັ່ນ: ຈາມ, ນໍ້າມຸກໄຫຼ, ຄັນ, ນໍ້າຕາໄຫຼ, ລົມເປັນຜິດ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANTI_ALLERGIC, categorySub: CategorySub.NONE },
  { slug: "diazepam", sku: "CBF-076", nameLA: "DIAZEPAM", nameEN: "DIAZEPAM", genericName: "Diazepam", dosage: "10mg/2ml", packaging: "2 ມລ x 10 ຫຼອດ x 100 ກັບ/ແກັດ", indicationLA: "ໃຊ້ໃນກໍລະນີຫຼຸດຜ່ອນຄວາມເຄັ່ງຕຶງທາງປະສາດ, ລະງັບຄວາມກັງວົນ, ລະງັບອາການລະເມີ ຫຼື ປ່ວງຍ້ອນພິດເຫຼົ້າ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.EFFECTIVE_TO_PSYCHOTIC, categorySub: CategorySub.NONE },
  { slug: "divalum-5", sku: "CBF-077", nameLA: "DIVALUM 5", nameEN: "DIVALUM 5", genericName: "Diazepam", dosage: "5mg", packaging: null, indicationLA: null, isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.EFFECTIVE_TO_PSYCHOTIC, categorySub: CategorySub.NONE },
  { slug: "divalum-10", sku: "CBF-078", nameLA: "DIVALUM 10", nameEN: "DIVALUM 10", genericName: "Diazepam", dosage: "10mg", packaging: null, indicationLA: null, isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.EFFECTIVE_TO_PSYCHOTIC, categorySub: CategorySub.NONE },
  { slug: "lidocain-2", sku: "CBF-079", nameLA: "LIDOCAIN 2%", nameEN: "LIDOCAIN 2%", genericName: "Lidocain Hydroclorid", dosage: "40mg/2ml", packaging: "2 ມລ x 10 ຫຼອດ x 100 ກັບ/ແກັດ", indicationLA: "ໃຊ້ທຳມິນສະເພາະທີ່ກ່ອນກວດພະຍາດ: ສ່ອງກະເພາະ-ສົ່ງທ້ອງ, ໃສ່ອຸປະກອນເຕັກນິກການແພດ ຫຼື ການດໍາເນີນການຜ່າຕັດ ແລະ ອື່ນໆ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANESTHETICS, categorySub: CategorySub.NONE },
  { slug: "aceclofenac", sku: "CBF-080", nameLA: "ACECLOFENAC", nameEN: "ACECLOFENAC", genericName: "Aceclofenac Sodium", dosage: "100mg", packaging: "10 ເມັດ x 10 ແຝງ x 50 ກັບ/ແກັດ", indicationLA: "ເປັນຢາທາງເລືອກທີ່ໃຊ້ລົດອາການປວດ ແລະ ແກ້ອາການອັກເສບ - ກໍລະນີຂໍ້ອັກເສບແບບຊຳເຮື້ອ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "becongen", sku: "CBF-081", nameLA: "BECONGEN", nameEN: "BECONGEN", genericName: "Paracetamol + Chlorpheniramine", dosage: "300mg + 1mg", packaging: "ຂວດ 60 ມລ/ກັບ x 96 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ເປັນຢາລົດໄຂ້, ແກ້ຕົວຮ້ອນ, ແກ້ອາການປວດ ເຊັ່ນ: ປວດຫົວ ປວດແຂ້ວ, ປວດເມື່ອຍຕາມກ້າມຊີ້ນ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "cetamol-syrup", sku: "CBF-082", nameLA: "CETAMOL Syrup", nameEN: "CETAMOL Syrup", genericName: "Paracetamol", dosage: "120mg/5ml", packaging: "ຂວດ 60 ມລ/ກັບ x 96 ຂວດ/ແກັດ", indicationLA: "Cetamol ເປັນຢາລົດໄຂ້, ແກ້ຕົວຮ້ອນບັນເທົາອາການປວດທີ່ເກີດຈາກຫຼາຍສາຍເຫດເຊັ່ນ: ປວດຫົວເນື່ອງມາຈາກຫວັດ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "cetamol-1000", sku: "CBF-083", nameLA: "CETAMOL 1000", nameEN: "CETAMOL 1000", genericName: "Paracetamol", dosage: "1000mg/100ml", packaging: "100 ມລ x 48 ຂວດ/ແກັດ", indicationLA: "ເປັນຢາແກ້ອາການປວດ, ລົດໄຂ້. - ສໍາລັບແກ້ປວດ: ໃຊ້ບັນເທົາອາການປວດລະດັບປານກາງ ແລະ ຮຸນແຮງ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "cetamol", sku: "CBF-084", nameLA: "CETAMOL", nameEN: "CETAMOL", genericName: "Paracetamol", dosage: "300mg/2ml", packaging: "2 ມລ x 10 ຫຼອດ x 100 ກັບ/ແກັດ", indicationLA: "ເປັນຢາໃຊ້ລົດໄຂ້-ແກ້ປວດເຊິ່ງມີສາຍເຫດຈາການຕິດເຊື້ອເຊັ່ນ: ອັກເສບອາມີດານ, ການຕິດເຊື້ອລະບົບຫາຍໃຈສ່ວນເທິງ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "diclofenac", sku: "CBF-085", nameLA: "DICLOFENAC", nameEN: "DICLOFENAC", genericName: "Diclofenac Sodium", dosage: "75mg/3ml", packaging: "3 ມລ x 10 ຫຼອດ x 87 ກັບ/ແກັດ", indicationLA: "ປິ່ນປົວອາການອັກເສບເຊັ່ນ: ອັກເສບຂໍ້ກະດູກແບບຮຸນແຮງ ຫຼື ຊຳເຮື້ອ, ກຸ່ມອາການອັກເສບ-ໄຄ່ບວມ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "freecold", sku: "CBF-086", nameLA: "FREECOLD", nameEN: "FREECOLD", genericName: "Paracetamol + Phenylephrine HCL + Chlorpheniramine Maleate", dosage: "500mg + 10mg + 2mg", packaging: "4 ເມັດ x 25 ແຝງ x 30 ກັບ/ແກັດ", indicationLA: "ຢາແກ້ຫວັດ, ມີອາການຕັນດັ່ງ, ນໍ້າມູກຍ້ອຍ, ນໍ້າຕາໄຫຼ, ຈາມ, ເຈັບຫົວ, ໄຂ້ເນື່ອງຈາກຫວັດ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "kiddycold", sku: "CBF-087", nameLA: "KIDDYCOLD", nameEN: "KIDDYCOLD", genericName: "Paracetamol + Chlorpheniramin", dosage: "325mg + 1mg", packaging: "25 ຊອງ x 3g ; 60 ກັບ/ແກັດ", indicationLA: "ລົດໄຂ້ - ແກ້ຕົວຮ້ອນ, ແກ້ອາການເຈັບ - ປວດຕ່າງໆ, ບັນເທົາອາການເປັນຫວັດສໍາລັບເດັກ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "mefenal-500", sku: "CBF-088", nameLA: "MEFENAL 500", nameEN: "MEFENAL 500", genericName: "Mefenamic Acid", dosage: "500mg", packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "meloxcam", sku: "CBF-089", nameLA: "MELOXCAM", nameEN: "MELOXCAM", genericName: "Meloxicam", dosage: "15mg", packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "norpyrine", sku: "CBF-090", nameLA: "NORPYRINE", nameEN: "NORPYRINE", genericName: "Paracetamol", dosage: null, packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "para-dek", sku: "CBF-091", nameLA: "PARA-DEK", nameEN: "PARA-DEK", genericName: "Paracetamol", dosage: "250mg/5ml", packaging: "ຂວດ 60 ມລ x 96 ຂວດ/ແກັດ", indicationLA: "PARA-DEK ນໍ້າເຊື່ອມເປັນຢາລົດໄຂ້, ແກ້ຕົວຮ້ອນ, ບັນເທົາອາການປວດທີ່ເກີດຈາກຫຼາຍສາຍເຫດ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "para-cbf", sku: "CBF-092", nameLA: "PARA-CBF", nameEN: "PARA-CBF", genericName: "Paracetamol", dosage: "500mg", packaging: "10 ເມັດ x 50 ແຝງ x 40 ກັບ/ແກັດ", indicationLA: "ແກ້ປວດເລັກນ້ອຍ-ປານກາງ, ແກ້ປວດຫົວ, ປວດແຂ້ວ, ປວດປະຈໍາເດືອນ, ປວດຕາມກ້າມຊີ້ນ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "salicylate-extra", sku: "CBF-093", nameLA: "SALICYLATE-EXTRA", nameEN: "SALICYLATE-EXTRA", genericName: "Methyl Salicylate", dosage: null, packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "voltanac-50", sku: "CBF-094", nameLA: "VOLTANAC 50", nameEN: "VOLTANAC 50", genericName: "Diclofenac Sodium", dosage: "50mg", packaging: "500 ເມັດ/ຂວດ; 108 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວອາການອັກເສບຂໍ້ກະດູກຊຳເຮື້ອ ຫຼື ຮຸນແຮງ, ບັນເທົາປວດ ປະດົງ, ອັກເສບກະດູກ...", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.ANALGESIC_ANTIPYRETIC, categorySub: CategorySub.NONE },
  { slug: "babyvit", sku: "CBF-095", nameLA: "BABYVIT", nameEN: "BABYVIT", genericName: "Thiamine Hydrochloride + Pyridoxine Hydrochloride + Cyanocobalamin + Nicotinamide + Riboflavin", dosage: "60mg + 24mg + 60mcg + 240mg + 24mg / 60ml", packaging: "ຂວດ 60 ມລ x 96 ຂວດ/ແກັດ", indicationLA: "ຊ່ວຍປ້ອງກັນແລະ ປິ່ນປົວອາການທີ່ເກີດຈາກການຂາດວິຕາມິນ ບີຍ້ອນຂາດສານອາຫານ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.VITAMINS_MINERALS, categorySub: CategorySub.NONE },
  { slug: "bidizym", sku: "CBF-096", nameLA: "BIDIZYM", nameEN: "BIDIZYM", genericName: "Vitamin B1 + Vitamin B6 + Vitamin B2 + Vitamin PP + Vitamin B5", dosage: "1mg + 4mg + 4mg + 40mg + 6mg / 2ml", packaging: "2 ມລ x 12 ຫຼອດ x 128 ກັບ/ແກັດ", indicationLA: "ເປັນຢາທີ່ໃຊ້ເພື່ອປ້ອງກັນ ແລະ ປິ່ນປົວບັນດາອາການທີ່ເນື່ອງມາຈາກການຂາດວິຕາມິນໝວດ B...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.VITAMINS_MINERALS, categorySub: CategorySub.NONE },
  { slug: "folic", sku: "CBF-097", nameLA: "FOLIC", nameEN: "FOLIC", genericName: "Folic Acid", dosage: null, packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.VITAMINS_MINERALS, categorySub: CategorySub.NONE },
  { slug: "neurobit", sku: "CBF-098", nameLA: "NEUROBIT", nameEN: "NEUROBIT", genericName: "Vitamin B1 + B6 + B12", dosage: null, packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.VITAMINS_MINERALS, categorySub: CategorySub.NONE },
  { slug: "neurobit-fort", sku: "CBF-099", nameLA: "NEUROBIT FORT", nameEN: "NEUROBIT FORT", genericName: "Thiamine HCl + Pyridoxine HCl + Cyanocobalamin", dosage: "250mg + 250mg + 1000mcg", packaging: "10 ເມັດ x 20 ແຝງ x 24 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວອາການອັກເສບຂອງປາຍເສັ້ນປະສາດ, ອັກເສບເສັ້ນປະສາດສູນກາງ ແລະ ອາການອັກເສບຫຼາຍເສັ້ນປະສາດພ້ອມໆກັນ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.VITAMINS_MINERALS, categorySub: CategorySub.NONE },
  { slug: "vita-c-50", sku: "CBF-100", nameLA: "VITA C 50", nameEN: "VITA C 50", genericName: "Ascorbic acid + Glucose", dosage: "50mg + 650mg", packaging: "15 ເມັດ x 50 ຊອງ x 8 ກັບ/ແກັດ", indicationLA: "ເສີມສ້າງພູມຕ້ານທານໃຫ້ແກ່ຮ່າງກາຍໃນກໍລະນີມີການຕິດເຊື້ອ, ເປັນຫວັດ, ປ້ອງກັນການຕິດເຊື້ອ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.VITAMINS_MINERALS, categorySub: CategorySub.NONE },
  { slug: "vitamin-b1", sku: "CBF-101", nameLA: "VITAMIN B1", nameEN: "VITAMIN B1", genericName: "ThiaminHCl", dosage: "100mg/1ml", packaging: "1 ມລ x 100 ຫຼອດ x 36 ກັບ/ແກັດ", indicationLA: "ໃຊ້ປິ່ນປົວອາການບວມ (Beri-beri) ທີ່ເນື່ອງມາຈາກການຂາດວິຕາມິນບີ 1 ປິ່ນປົວບາງກໍລະນີກ່ຽວກັບເສັ້ນປະສາດ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.VITAMINS_MINERALS, categorySub: CategorySub.NONE },
  { slug: "vitamin-b6", sku: "CBF-102", nameLA: "VITAMIN B6", nameEN: "VITAMIN B6", genericName: "Pyridoxin HCl", dosage: "100mg/1ml", packaging: "1 ມລ x 100 ຫຼອດ x 36 ກັບ/ແກັດ", indicationLA: "ໃຊ້ໃນກໍລະນີແພ້ທ້ອງໃນໄລຍະຖືພາ, ພະຍາດ Parkinson, ກະຕຸ້ນປະສາດ (Chorea), ປະສາດອັກເສບ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.VITAMINS_MINERALS, categorySub: CategorySub.NONE },
  { slug: "vitamin-b12", sku: "CBF-103", nameLA: "VITAMIN B12", nameEN: "VITAMIN B12", genericName: "Vitamin B12", dosage: null, packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.VITAMINS_MINERALS, categorySub: CategorySub.NONE },
  { slug: "alcohol-70", sku: "CBF-104", nameLA: "ALCOHOL 70°", nameEN: "ALCOHOL 70°", genericName: "Ethyl Alcohol", dosage: "70°", packaging: "60 ມລ x 15 ຂວດ x 12 ກັບ/ແກັດ", indicationLA: "Alcohol 70° ສ່ວນໃຫຍ່ແມ່ນໃຊ້ ສໍາລັບຂ້າເຊື້ອບໍລິເວນຜິວໜັງ ເຊັ່ນ: ໃຊ້ທໍາຄວາມສະອາດ-ຂ້າເຊື້ອບໍລິເວນຜິວໜັງກ່ອນຈະສັກຢາ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.DISINFECTANTS_ANTISEPTIC, categorySub: CategorySub.NONE },
  { slug: "alcohol-90", sku: "CBF-105", nameLA: "ALCOHOL 90°", nameEN: "ALCOHOL 90°", genericName: "Ethyl Alcohol", dosage: "90°", packaging: "500 ມລ x 20 ຂວດ/ແກັດ, 1000 ມລ x 10 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ສໍາລັບ ທໍາຄວາມສະອາດ-ຂ່າເຊື້ອ ເຄື່ອງມື ແລະ ອຸປະກອນທາງ ການແພດ...", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.DISINFECTANTS_ANTISEPTIC, categorySub: CategorySub.NONE },
  { slug: "antiseptic-hand-gel", sku: "CBF-106", nameLA: "ANTISEPTIC HAND GEL", nameEN: "ANTISEPTIC HAND GEL", genericName: "Alcohol", dosage: null, packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.DISINFECTANTS_ANTISEPTIC, categorySub: CategorySub.NONE },
  { slug: "cbf-alcohol-spray", sku: "CBF-107", nameLA: "CBF-ALCOHOL SPRAY", nameEN: "CBF-ALCOHOL SPRAY", genericName: "Alcohol", dosage: null, packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.DISINFECTANTS_ANTISEPTIC, categorySub: CategorySub.NONE },
  { slug: "c-scrub", sku: "CBF-108", nameLA: "C-SCRUB", nameEN: "C-SCRUB", genericName: "Chlorhexidine", dosage: null, packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.DISINFECTANTS_ANTISEPTIC, categorySub: CategorySub.NONE },
  { slug: "hydrogen", sku: "CBF-109", nameLA: "HYDROGEN", nameEN: "HYDROGEN", genericName: "Hydrogen Peroxide", dosage: "6%", packaging: "30 ມລ/ຂວດ 24 ຂວດ/ກັບ 12 ກັບ/ແກັດ", indicationLA: "ນໍ້າຢາຂ້າເຊື້ອໃຊ້ສໍາຫຼັບທໍາຄວາມສະອາດແຜຖະຫຼອກ, ແຜປິດ, ແຜຕິດເຊື້ອ, ແຜໃນຫູ ແລະ ຜົ້ງປາກ.", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.DISINFECTANTS_ANTISEPTIC, categorySub: CategorySub.NONE },
  { slug: "metylen", sku: "CBF-110", nameLA: "METYLEN", nameEN: "METYLEN", genericName: "Methylene blue", dosage: "2%/30ml", packaging: "30 ມລ/ຂວດ 12 ຂວດ/ກັບ 36 ກັບ/ແກັດ", indicationLA: "ໃຊ້ໃນກໍລະນີສົບເປື່ອຍ, ປາກເປື່ອຍ, ຕຸ່ມເປື່ອຍ, ຕຸ່ມພອງ... ທາບໍລິເວນບາດ 2 - 3 ເທື່ອ/ມື້ ຫຼັງອາຫານ ແລະ ກ່ອນນອນ", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.DISINFECTANTS_ANTISEPTIC, categorySub: CategorySub.NONE },
  { slug: "petadine-10", sku: "CBF-111", nameLA: "PETADINE 10%", nameEN: "PETADINE 10%", genericName: "Povidone Iodine", dosage: "10%", packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.DISINFECTANTS_ANTISEPTIC, categorySub: CategorySub.NONE },
  { slug: "aqua-cbf", sku: "CBF-112", nameLA: "AQUA CBF", nameEN: "AQUA CBF", genericName: "Sterile Water", dosage: null, packaging: null, indicationLA: null, isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.OTHERS, categorySub: CategorySub.NONE },
  { slug: "distilled-water", sku: "CBF-113", nameLA: "DISTILLED WATER", nameEN: "DISTILLED WATER", genericName: "Distilled water for Injection", dosage: null, packaging: "10 ມລ x 100 ຫຼອດ x 18 ກັບ/ແກັດ", indicationLA: "Distilled water ໃຊ້ເປັນພູມລະລາຍຢາສັກປະເພດຝຸ່ນ ຫຼື ຜ່າຈາງນໍ້າຢາສັກກ່ອນທີ່ຈະນໍາໃຊ້ (ໃຊ້ໃນການສັກ).", isPrescription: BooleanState.FALSE, isActive: BooleanState.TRUE, category: Category.OTHERS, categorySub: CategorySub.NONE },
  { slug: "monuvir", sku: "CBF-114", nameLA: "MONUVIR", nameEN: "MONUVIR", genericName: "Molnupiravir", dosage: "200mg", packaging: "20 ແຄັບຊຸນ x 84 ຂວດ/ແກັດ", indicationLA: "ໃຊ້ສໍາລັບການປິ່ນປົວພະຍາດໂຄວິດ 19 ໃນຜູ້ໃຫຍ່ທີ່ມີອາການ ເລັກນ້ອຍຫາປານກາງ", isPrescription: BooleanState.TRUE, isActive: BooleanState.TRUE, category: Category.OTHERS, categorySub: CategorySub.NONE }
];

  const createdProducts = [];


  for (const product of products) {
    try {
      // เช็คก่อนว่ามีข้อมูลนี้อยู่แล้วหรือยัง (เช็คจาก SKU หรือ Slug ก็ได้)
      const existingProduct = await database.product.findUnique({
        where: { sku: product.sku },
      });

      if (!existingProduct) {
        const p = await database.product.create({
          data: {
            ...product,
            createdById: admin.id,
          },
          
        });
             createdProducts.push(p);
        console.log(`✅ Inserted: ${product.sku} - ${product.nameLA}`);
      } else {
        console.log(`⏩ Skipped (Already exists): ${product.sku}`);
      }
    } catch (error) {
      console.error(`❌ Error inserting ${product.sku}:`, error);
    }

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