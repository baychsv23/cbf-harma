import { ArticleType, Category, Permission } from "@/generated/prisma/enums";
import { translations } from "./translation";

export const initialState = { success: false, message: "" };

export const timeToken = 60 * 60 * 10; //10h ;

export enum ViewMode {
  List = "list",
  Create = "create",
  Edit = "edit",
  View = "view",
}

export const modules = [
  {
    name: translations.account,
    permissions: [
      Permission.USER_VIEW,
      Permission.USER_CREATE,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,
    ],
  },
  {
    name: translations.product,
    permissions: [
      Permission.PRODUCT_VIEW,
      Permission.PRODUCT_CREATE,
      Permission.PRODUCT_UPDATE,
      Permission.PRODUCT_DELETE,
    ],
  },
  {
    name: translations.symptom,
    permissions: [
      Permission.SYMPTOM_VIEW,
      Permission.SYMPTOM_CREATE,
      Permission.SYMPTOM_UPDATE,
      Permission.SYMPTOM_DELETE,
    ],
  },
  {
    name: translations.article,
    permissions: [
      Permission.ARTICLE_VIEW,
      Permission.ARTICLE_CREATE,
      Permission.ARTICLE_UPDATE,
      Permission.ARTICLE_DELETE,
    ],
  },
  {
    name: translations.announcement,
    permissions: [
      Permission.ANNOUNCEMENT_VIEW,
      Permission.ANNOUNCEMENT_CREATE,
      Permission.ANNOUNCEMENT_UPDATE,
      Permission.ANNOUNCEMENT_DELETE,
    ],
  },
];

export const FB_LINK = "https://www.facebook.com/cbfpharmalao";
export const WA_LINK = "https://wa.me/8562098989689";

export const CATEGORY_SLUG_MAP: Record<Category, string> = {
  NUTRITION_ELECTROLYTE: "nutrition-electrolyte",
  ANTIBIOTICS: "antibiotics",
  ANTI_PARASITIC: "anti-parasitic",
  GASTROINTESTINAL: "gastrointestinal",
  CARDIOVASCULAR: "cardiovascular",
  ANTI_DIABETIC: "anti-diabetic",
  RESPIRATORY: "respiratory",
  ANTI_ALLERGIC: "anti-allergic",
  EFFECTIVE_TO_PSYCHOTIC: "effective-to-psychotic",
  ANESTHETICS: "anesthetics",
  ANALGESIC_ANTIPYRETIC: "analgesic-antipyretic",
  VITAMINS_MINERALS: "vitamins-minerals",
  DISINFECTANTS_ANTISEPTIC: "disinfectants-antiseptic",
  OTHERS: "others",
};

export const TYPE_SLUG_MAP: Record<ArticleType, string> = {
  ACTIVITY: "activity",
  HEALTH_KNOWLEDGE: "health-knowledge",
  NEWS: "news",
};
