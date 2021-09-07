
import 'dotenv/config'
import express from 'express';
import debug from 'debug';
import {readdir} from 'fs' ;
import cors from 'cors';
import i18n from 'i18n-2';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import fileupload from 'express-fileupload';
import {localize,checkAuthorizaion,checkInvalidInput} from './middleware';
import Authentication from './controller/authentication'
import  MerchentRegisterController from './controller/merchentregisterController'
import AddressController from './controller/addressController'
import PublicApiController from './controller/publicapiController'

const https = require('https');
const fs = require('fs');
const {constants} = require('crypto');

const app = express();
const PORT = process.env.PORT|| 2000;
const publicDir = process.env.imageupstorageLocation
const [ info, errorLog, debugLog ]= [ debug('info'), debug('warning'), debug('warnning') ];


// language config

i18n.expressBind(app, {locales: [ 'en' ] })

app.use(localize);

const options = {
    //secureOptions: constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1,

    key: fs.readFileSync('ssl/keyfile-encrypted.key'),
    cert: fs.readFileSync('ssl/97580e4c070d1482.crt'),
    ca: [ fs.readFileSync('ssl/gd1.crt')],
    passphrase: "Mlajan@123##"

    //...
 //  key: fs.readFileSync('ssl/server.key'),
 //  cert: fs.readFileSync('ssl/server.cert'),
  // rejectunauthorized:false

 };

app.use(express.json({limit:'1024mb',strict:false}));
app.use (checkInvalidInput);
app.use(express.urlencoded({limit: '1024mb', extended: true}));
app.use(express.static(publicDir));


app.use(morgan('dev'));
app.use(cors())


// validator module

app.use(expressValidator());

//initialize file upload

app.use(fileupload({
    limits: { fileSize: 1024 * 1024 },
    abortOnLimit: true,
    preserveExtension: true,
    responseOnLimit: 'One or more files exceeds the file limit of 1MB'
}));


app.use("/api/address/",AddressController)
app.use("/api/auth/",Authentication);
app.use('/api/public/', PublicApiController)
app.use("/api/merchent/", MerchentRegisterController)


//token check.....after below all route....

//only use supplier cirtificate upload, it's a fack api..
app.post('/api/fackupload',(req,res)=>{return res.status(200).send(); })

 app.use(checkAuthorizaion);

//dynamic routing so no need to include routes explicitly
 readdir('./routes', (err, files) => {

     files.forEach(file => {
         app.use(`/`, require(`./routes/` + file));

     });

 });

 //https.createServer(options,app).listen(PORT,()=>console.log(`app run on port ${PORT}`));
 
 
app.listen(PORT, () => {

    info(`🚀 Magic happens at port number ${PORT}`);

});



