const Product= require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors= require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


// Create Product-->Admin
exports.createProduct=catchAsyncErrors(
    async(req,res,next)=>{
        req.body.user= req.user.id;
        const product=await Product.create(req.body);
        
        res.status(201).json({
            success:true,
            product
        })
    }
    
    );
// GEt all products
exports.getAllProducts= catchAsyncErrors(async(req,res)=>{

    const resultPerPage=5;
    const apiFeature=new ApiFeatures(Product.find(),req.query).search().filter().pagenation(resultPerPage);
    const products=await apiFeature.query;
    res.status(200).json({
        success:true,
        products
    })

});

//Get Product details 
exports.getProductDetails=catchAsyncErrors( async(req, res, next)=>{
    const product= await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not Found", 404))
    }
    res.status(200).json({
        success:true,
        product
    })
})

// Update Product --> ADMIN
exports.updateProduct=catchAsyncErrors( async (req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not Found", 404))
    }
    product =await Product.findByIdAndUpdate(req.params.id, req.body,{new:true,
    runValidators:true,
    userFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    });
});

// Delete Product
exports.deleteProduct=catchAsyncErrors( async (req,res,next)=>{
    const product= await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not Found", 404))
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    });
});

// Create new review or Updaate a review
exports.createProductReview= catchAsyncErrors(async (req,res,next)=>{
    const {rating,comment, productId}=req.body
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }
    const product= await Product.findById(productId);

    const isReviewed=product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString());
    if (isReviewed) {
        
    }
    else{
        product.reviews.push(review);
        product.numOfReviews= product.reviews.length;
    }
    let avg=0;
    product.reviews.forEach(rev=>{
        avg+=rev.rating;

    })
    product.ratings=avg/product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true
    })
});

// Get all Reviews of a product
exports.getProductReviews= catchAsyncErrors(async(req, res, next)=>{
    const product= await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews,
    });
});

// Delete Reviews of a Product
exports.deleteReview= catchAsyncErrors(async(req,res, next)=>{
    const product= await Product.findById(req.query.productId);
    const reviews= product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString());
    let avg=0;
    reviews.forEach(rev=>{
        avg+=rev.rating;

    })
    const ratings=avg/reviews.length;
    const numOfReviews= reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews, ratings, numOfReviews
    },
    {
        new:true,
        runValidators:true,
        userFindAndModify:false
    })
    res.status(200).json({
        success:true,
    });
})
