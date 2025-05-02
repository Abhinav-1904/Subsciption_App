import express,{Request, Response} from 'express';
const router =express();
const port=3000;
router.use(express.json());
interface Discount{
  value:number;
  isPercentage:boolean;
}
interface Subscription {
  id: number;
  typeOf: 'monthly' | 'yearly';
  price: number;
  discount: Discount;
}
let subscription:Subscription[]=[];

function calculateDiscount(price:number, discount:Discount):number{
  if(discount.isPercentage){
    return price - (price * discount.value / 100);
  } else{
    return price - discount.value;
  }
}

router.post('/', (req:Request,res:any)=>{
  try{
    const {typeOf,price,discount}=req.body;
    if(!typeOf || !price || !discount){
      return res.status(400).json({message:'Please provide all required fields'});
    };
    var discountValue = 0;
    if(typeOf=='monthly'){
      discountValue = calculateDiscount(price.monthly, discount);
    }
    if(typeOf=='yearly'){
      discountValue = calculateDiscount(price.yearly, discount);
    }
    const new_subscription:Subscription = {
      id: subscription.length + 1,
      typeOf: typeOf,
      price: discountValue,
      discount: discount
    };
    subscription.push(new_subscription);
    res.status(201).json({message:'Subscription created successfully',subscription:new_subscription});
  }
  catch(err){
    console.error(err);
    res.status(500).json({message:'Internal server error'});
  }
})

router.get('/', (req:Request,res:Response)=>{
  res.json(subscription);
})

router.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})