
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import {moduleKey,jwtKey} from '../config/keys';
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'

module.exports= { 

    localize: (req, res, next) => {

		    let locale =req.acceptsLanguages()[0];
		    locale = locale.includes("-")?locale.slice(0, -3):locale;
		    req.i18n.setLocale(locale);
		    next();

		},

	checkInvalidInput:async (error, req, res, next)=>{
		if(error){
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('invalid_input'), null, req));
		}
		next();
	},

	checkModule:async (req,res,next)=>{
		let Module = req.header("Module"); 
		if (Module != moduleKey){
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('invalid_module'), null, req));
		  }
   
		next();
   },
   checkAuthorizaion:async (req,res,next)=>{
		let authorization = req.header("authorization")

		console.log('token ', authorization)
		
		if(!authorization){ 
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('unauthorized'), null, req))
		 }
		authorization = authorization.split(" "); 
		if( authorization[0] != 'Bearer'){  
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('unauthorized'), null, req))
		 }
		authorization = authorization[1]; 
		
		let Module = req.header("Module");
		if (!authorization || Module != moduleKey) {
		
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('unauthorized'), null, req))
		}
		try { 
				let decode = await jwt.verify(authorization,jwtKey);

				req.user_info = decode;
				next();

		}catch (e) {
			console.log(e)
			return  res.status(400).send(BAD_REQUEST( req.i18n.__('unauthorized'), null, req))

		}
 },

	hassPasswordGenerate:async(password)=>{
				
		var salt = await bcrypt.genSaltSync(10);
		var hashpass =await bcrypt.hashSync(password, salt);

		return hashpass;
	},

	verifyPassword:async(password,hashpass)=>{

		return bcrypt.compareSync(password, hashpass);

	},

	tokenGenerate: async(payload=null) => {

			return jwt.sign(payload,jwtKey);
	},

	tokenVerify: async(token=null) => {

			return jwt.verify(token, jwtKey)
	},

}