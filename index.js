
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

const app = express();
const PORT = process.env.PORT|| 2000;
const publicDir = process.env.publicDir
const [ info, errorLog, debugLog ]= [ debug('info'), debug('warning'), debug('warnning') ];


// language config

i18n.expressBind(app, {locales: [ 'en' ] })

app.use(localize);


app.use(express.json({limit:'1024mb',strict:false}));
app.use (checkInvalidInput);
app.use(express.urlencoded({limit: '1024mb', extended: true}));
app.use(express.static(__dirname+`/${publicDir}`));

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

app.use("/api/auth/",Authentication);

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


app.listen(PORT, () => {

    info(`🚀 Magic happens at port number ${PORT}`);

});



