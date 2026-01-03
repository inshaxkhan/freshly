import Order from "../models/Order.js"
import Product from "../models/Product.js"
import stripe from "stripe"

// place order COD: /api/order/cod
export const placeOrderCOD= async(req, res)=>{
    try {
        const { items, address } = req.body;
    const userId = req.userId;  // from auth middleware
        if(!address || items.length===0){
            return res.json({success:false, message:"Invalid data "})
        }

        //calculate amount using items
        let amount= await items.reduce(async(acc, item)=>{
            const product=await Product.findById(item.product)
            return (await acc) + product.offerPrice * item.quantity 
        }, 0)

        // add tax charge of 2%
        amount+=Math.floor(amount*0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD",
        });

        //stripe gateway initialize
        const stripeInstance=new stripe(process.env.STRIPE_SECRET_KEY);

        //create line items for stripe
        const line_items=productData.map((item)=>{
            return{
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:item.name
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02)*100
                },
                quantity:item.quantity,
            }
        })

        //create session
        const session=await stripeInstance.checkout.sessions.create({
            line_items,
            mode:"payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.json({success:true, url:session.url })
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}


// place order STRIPE: /api/order/stripe
export const placeOrderStripe= async(req, res)=>{
    try {
        const { items, address } = req.body;
        const {origin}=req.headers
    const userId = req.userId;  // from auth middleware
        if(!address || items.length===0){
            return res.json({success:false, message:"Invalid data "})
        }

        let productData=[];

        //calculate amount using items
        let amount= await items.reduce(async(acc, item)=>{
            const product=await Product.findById(item.product)

            //storing details in productData Array for stripe
            productData.push({
                name: product.name,
                price:product.offerPrice,
                quantity:product.quantity,
            })

            return (await acc) + product.offerPrice * item.quantity 
        }, 0)

        // add tax charge of 2%
        amount+=Math.floor(amount*0.02)

        const order= await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"Online",
        });

        return res.json({success:true, message:"Order placed successfully "})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}


// get orders by userId: /api/order/user
export const getUserOrders=async(req,res)=>{
    try {
        const userId = req.userId; // from middleware

        //display when 'order is COD' or 'order is paid online'
        const orders=await Order.find({
            userId,
            $or:[{paymentType:"COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt:-1})

        res.json({success:true, orders})

    } catch (error) { 
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

// get all orders for ADMIN/SELLER: /api/order/seller
export const getAllOrders=async(req,res)=>{
    try { 
        //display when 'order is COD' or 'order is paid online'
        const orders=await Order.find({
            $or:[{paymentType:"COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt:-1});

        res.json({success:true, orders});

    } catch (error) { 
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}


