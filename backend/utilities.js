const jwt=require('jsonwebtoken');

// Authorization
function authenticateToken(req,res,next){
    const authHeader=req.headers["authorization"];
    const token=authHeader && authHeader.split(" ")[1];
    // No token,unauthorized
    if(!token) return res.sendStatus(401);

    jwt.verify(token,process.env.SECRET,(err,user)=>{
        // Token Invalid, Forbidden
        if(err) return res.sendStatus(401);
        req.user=user;
        next();
    })
}

module.exports={
    authenticateToken,
}