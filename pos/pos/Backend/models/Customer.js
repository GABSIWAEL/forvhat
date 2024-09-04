
const { DataTypes } = require('sequelize');

const sequelize = require('../database');



const Customer = sequelize.define('Customer', {

    name: {

        type: DataTypes.STRING,

        allowNull: false,

    },

    clientType: DataTypes.STRING,



    phone: {

        type: DataTypes.STRING,

    },

});



module.exports = Customer;

