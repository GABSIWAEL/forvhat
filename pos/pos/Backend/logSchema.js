const { User, Customer, Product, Facture, FactureProduct, Sale, Supplier, Report } = require('./models'); // Adjust the path as needed

const logModelSchema = (model) => {
    console.log(`Model: ${model.name}`);
    console.log('Attributes:', model.rawAttributes);
    console.log('Associations:', model.associations);
};

logModelSchema(User);
logModelSchema(Customer);
logModelSchema(Product);
logModelSchema(Facture);
logModelSchema(FactureProduct);
logModelSchema(Sale);
logModelSchema(Supplier);
logModelSchema(Report);
