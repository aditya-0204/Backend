class APIError extends Errors{
    constructor(
        statusCode,
        Message = "Something Went Wrong",
        errors=[],
        stackck =""
    ){
        super(message)
        this.statusCode = statusCode
        this.Message = Message;
        this.errors = errors;
        this.data = null
        this.success = false;
        if(stackck){
            this.stack = stackck
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    
    }

}
export default APIError;