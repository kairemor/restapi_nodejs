const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency  = mongoose.Types.Currency;


const CommentSchema = new Schema({
    rating : {
        type : Number ,
        min : 1 , 
        max : 5 , 
        required : true 
    }, 
    comment :{
        type : String , 
        required : true , 
    }, 
    author : {
        type: String , 
        required : true 
    }, 
},{
    timestamps : true 
}); 
const DishesSchema = new Schema({
    name: {
        type : String , 
        unique : true ,
        required : true ,
    },
    description : {
        type:String ,
    },
    category : {
        type:String ,
        required : true, 
    },
    image : {
        type:String ,
        required : true , 
    },
    label : {
        type:String ,
        required : true , 
    },
    featured : {
        type:String ,
        required : true ,
    },
    price : {
        type: Currency , 
        required : true , 
    },
    comments : [CommentSchema] ,
},{
        timestamps : true ,
    }
);

const Dishes = mongoose.model('Dish', DishesSchema);

module.exports = Dishes ; 