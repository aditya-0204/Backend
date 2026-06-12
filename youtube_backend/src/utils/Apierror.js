class APIError extends Error{
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors=[],
        stack =""
    ){
        super(message)
        this.statusCode = statusCode
        this.Message = message;
        this.errors = errors;
        this.data = null
        this.success = false;
        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    
    }

}
export default APIError;