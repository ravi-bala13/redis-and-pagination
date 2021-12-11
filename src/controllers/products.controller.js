const express = require("express");

const redis = require("../configs/redis")

const Product = require("../models/products.model");

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        const product = await Product.create(req.body);

        const products = await Product.find().lean().exec(); //get all data from db

        redis.set("redis_key", JSON.stringify(products));  //set data to redis

        return res.status(200).send(product);

    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed to create"})
    }
    
});
// *************pagination
router.get("/:page/:size", async (req, res) => {

    try {
     
        const page = +req.params.page || 1;
        
        const size = +req.params.size || 2;
        
        const skip = (page - 1) * size;
        

        let totalPage = Math.ceil(await Product.find().countDocuments() / size);

        const product = await Product.find().skip(skip).limit(size).lean().exec();

        return res.status(200).json({product, totalPage});
        

    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed to create"})
    }
    
});




router.get("/", (req, res) => {

    try {
     

        redis.get("redis_key", async function(err, product_val){
            // console.log('product_val:', product_val)
            if(err) console.log('err:', err);

            if(product_val){
                return res.status(200).json({from_redis: JSON.parse(product_val)});
            }

            const product = await Product.find().lean().exec();

            redis.set("redis_key", JSON.stringify(product));

            return res.status(200).json({from_db: product});
            
        })

        

    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed to create"})
    }
    
});

router.get("/:id", (req, res) => {

    try {

        redis.get(`redis_key.${req.params.id}`, async function(err, product_val){
            // console.log('product_val:', product_val)
            if(err) console.log('err:', err);

            if(product_val){
                return res.status(200).json({from_redis: JSON.parse(product_val)});
            }

            const product = await Product.findById(req.params.id).lean().exec();

            redis.set(`redis_key.${req.params.id}`, JSON.stringify(product));

            return res.status(200).json({from_db: product});
            
        })

        

    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed to create"})
    }
    
});

router.patch("/:id", async (req, res) => {

    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});

        redis.set(`redis_key.${req.params.id}`, JSON.stringify(product));

        const products = await Product.find().lean().exec();

        redis.set("redis_key", JSON.stringify(products));

        return res.status(200).json(product);        

    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed to create"})
    }
    
});

router.delete("/:id", async (req, res) => {

    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        redis.del(`redis_key.${req.params.id}`);

        const products = await Product.find().lean().exec();

        redis.set("redis_key", JSON.stringify(products));

        return res.status(200).json(product);        

    } catch (e) {
        return res.status(500).json({message: e.message, status: "Failed to create"})
    }
    
});

module.exports = router;