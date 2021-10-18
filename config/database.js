

// import Sequelize from 'sequelize'
// require('dotenv').config()

// //read veriable from .env file.......
// const  dbname = process.env.dbname
// const  dbserver = process.env.dbserver
// const  dbusername = process.env.dbusername
// const  dbpassword = process.env.dbpassword


// //connect mssql DB......
// const sequelize = new Sequelize(dbname, dbusername, dbpassword, {
//     dialect: 'mssql',
//     operatorsAliases: false,
//     host: dbserver,
//     dialectOptions: {
//         encrypt: true,
//     },
//     options: {
//    packetSize: 32768
//  },
//     logging: false,
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//       },
// });


// //Check connection establish or not......
// sequelize.authenticate()

//     .then(function () {

//         console.log("Database CONNECTED! ");

//     })
//     .catch(function (err) {

//        // console.log(err)
//         console.log("Unable to connect database !!");
//     })


// module.exports = sequelize;


