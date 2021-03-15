import password_Validator from 'password-validator'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'
import 'dotenv/config'

const phone_prefix = process.env.phone_prefix

module.exports = {

    PasswordValidator: async(password) => { 
    	 
    },

    MobileValidator:async(req, res, next)=> {


        req.checkBody('mobile').notEmpty().withMessage(req.i18n.__('emptyphone')).isLength({max: 10, min:10}).withMessage(req.i18n.__('phonelength')).custom(val => {
    
            return /^[0-9]*$/.test(val);
    
        }).withMessage(req.i18n.__('phonetype'));
    
        const errors = req.validationErrors();
        
        const response = {};
    
        if (errors) {
    
            errors.forEach(function (err) {

                response[err.param] = err.msg
    
            });
    
            return res.status(400).send(BAD_REQUEST(null, response, req));
    
        }

        req.body.mobile = +`${phone_prefix}${req.body.mobile}`
    
        next();
    
    },

    CustomerOtherInformationValidator:async(req, res, next)=> {

        req.checkBody('companyregno').notEmpty().withMessage(req.i18n.__('emptycompanyregno'))
    
        req.checkBody('vatno').notEmpty().withMessage(req.i18n.__('emptyvatno'))

        req.checkBody('landline').notEmpty().withMessage(req.i18n.__('emptylandline')).custom(val => {

            return /^[0-9]*$/.test(val);
    
        }).withMessage(req.i18n.__('landlinetype'))
    
        const errors = req.validationErrors();
        const response = {};
    
        if (errors) {
    
            errors.forEach(function (err) {

                response[err.param] = err.msg
    
            });
    
            return res.status(400).send(BAD_REQUEST(null, response, req));
    
        }
    
        next();
    
    }
}