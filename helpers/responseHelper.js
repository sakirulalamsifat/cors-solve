
module.exports = {

    //200 series

     OK: (payload, message, req)=>{

        return {
            issuccess:true,
            payload: payload || null,
            message: message || req.i18n.__('Ok'),
        };

    },

    //400 series

     BAD_REQUEST: ( message, payload, req) =>{

        return {
            issuccess:false,
            errors: payload || null,
            message: message || req.i18n.__('bad_request'),
        };

    },
    //401
    UNAUTHORIZED: ( message, req)=>{

        return {
            issuccess:false,
            message: message || req.i18n.__('unauthorized'),
        };

    },
    //404
     NOT_FOUND :(message, req)=>{

        return {
            issuccess:false,
            message: message || req.i18n.__('notfound'),
        };

    },

    //422
     UNPROCESSABLE_ENTITY :( message, payload, req)=>{

        return {
            issuccess:false,
            errors: payload || null,
            message: message || req.i18n.__('unprocessable'),
        };

    },

    //500 series

     INTERNAL_SERVER_ERROR :(message, req)=>{

        return {
            issuccess:false,
            message: message || req.i18n.__('internalservererror'),
        };

    },

}