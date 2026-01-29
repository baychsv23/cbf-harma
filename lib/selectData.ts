export const selectDataOfArticle = {
  slug: true,
  titleLA: true,
  titleEN: true,
  contentEN: true,
  contentLA: true,
  coverImage: true,
  type: true,
  products: {
    select: {
      slug: true,
      category: true,
      nameLA: true,
      nameEN: true,
      productImage: true,
    },
  },
  views: true,
  publishedAt: true,
};

export const selectDataOfProduct = {
  slug: true,
  nameLA: true,
  nameEN: true,
  category: true,
  categorySub: true,
  dosage: true,
  packaging: true,
  indicationLA: true,
  indicationEN: true,
  isPrescription: true,
  productImage: true,

  symptoms: { select: { nameLA: true, nameEN: true } },
};
