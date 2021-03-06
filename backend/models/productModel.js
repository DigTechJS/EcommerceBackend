const mongoose=require("mongoose");
const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Product Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Please Enter Product description"]
    },
    price:{
        type:Number,
        required:[true,"Please Enter Product price"],
        maxlength:[6,"Price can not exceed 8 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
        }
    ],
    category:{
        type:String,
        required:[true,"Please Enter Product category"]
    },
    stock:{
        type:Number,
        required:[true,"Please Enter Product stock"],
        maxlength:[4,"Price can not exceed 4 characters"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }
],
user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
},
createdAt:{
    type:Date,
    default:Date.now
}
});

module.exports= mongoose.model("Product",productSchema);