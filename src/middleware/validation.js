
export const validation=(schemas)=>(req,res,next)=>{
    try{
         //  schemas = { body: JoiSchema, query: JoiSchema, params: JoiSchema }

    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, { abortEarly: false });
      if (error) throw error; //  throw error to global error handler
      req.body = value; // sanitized data
    }
    if(schemas.query){
        const {error,value}=schemas.query.validation(req.query,{ abortEarly: false });
        if (error) throw error;
        req.query = value;
    }

    if(schemas.params){
        const {error,value}=schemas.params.validation(req.params,{ abortEarly: false });
        if (error) throw error;
        req.params = value;
    }

    next();
    }catch(err){
        next(err);
    }
}