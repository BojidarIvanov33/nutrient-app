module.exports = function (temp, product) {
  let output = temp.replace(/@ProductName/g, product.name);
  output = output.replace(/@Id/g, product.id);
  output = output.replace(/@group/g, product.group.toUpperCase());
  output = output.replace(/@calories/g, product.energy);
  output = output.replace(/@fat/g, product.fat);
  output = output.replace(/@carbohydrate/g, product.carbohydrate);
  output = output.replace(/@protein/g, product.protein);
  output = output.replace(/@sugar/g, product.sugar);
  // if (!product.organic) {
  //   output = output.replace(/@NotOrganic/g, "not-organic");
  // }
  return output;
};
