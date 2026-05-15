//  using promises
const asynchandler = (requesthandler)=>{
    (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next)).catch((error)=>next(error))
    }
}



 export default asynchandler;

// try catch
//  const asynchandler = (fn)=> async (req,res,next)=>{   // we are passing a function into another function 
//     try{ 
//         await fn(req,res,next)
//     }
//     catch(error){
//          res.status(error.code || 500).json({
//             success:false,
//             message:error.message || "Server Error"
//          })
//     }
//  }

