// check: https://docs.medusajs.com/development/entities/extend-entity#response-fields
export default async function () {
  const imports = (await import(
    "@medusajs/medusa/dist/api/routes/store/products/index"
  )) as any;
  imports.allowedStoreProductsFields = [
    ...imports.allowedStoreProductsFields,
    "mpn",
  ];
  imports.defaultStoreProductsFields = [
    ...imports.defaultStoreProductsFields,
    "mpn",
  ];
}
