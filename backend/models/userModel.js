const mongoose= require("mongoose")
const validator= require("validator")
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");
const crypto= require("crypto")
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter your name"],
        maxlength:[30,"Name can not exceed 30 characters"],
        minlength:[4, "Name can not less than 4 characters"]
    },
    email:{
        type:String,
        required:[true, "Please Enter your Email"],
        unique:true,
        validate:[validator.isEmail, "Please enter a valid email"],

    },
    password:{
        type:String,
        required:[true, "Please Enter your password"],
        minlength:[8, "Password be greater than 8 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String, 
        default:"user",
    },
    resetPaswordToken:String,
    resetPasswordExpire:Date,
});

userSchema.pre("save",async function(next){

    if (!this.isModified("password")) {
        next();
    }

    this.password= await bcrypt.hash(this.password, 10);
})
// JWT Token
userSchema.methods.getJWTToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}

// Compare Passwords
userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generating Password reset token
userSchema.methods.getResetPasswordToken= function(){
    // Generating Token
    const resetToken= crypto.randomBytes(20).toString("hex");
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPaswordToken= crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire= Date.now()+15*50*1000;
    return resetToken;

}

module.exports= mongoose.model("user",userSchema);