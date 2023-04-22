const mongoose=require('mongoose');
const { dailyEachProducts } = require('./daily-each-product');
const dailyDashboardSchema=new mongoose.Schema({
    date:{
      type:Date,
      default : Date.now
    },

  product: [{ type: mongoose.Schema.Types.ObjectId, ref: dailyEachProducts }],

  
      customers:[{
          type:mongoose.Schema.Types.ObjectId,
          ref:"user",

      }],
      revenue:{
          type:Number,
          default:0
      },
      profit:{
          type:Number,
          default:0
        },
      orders:{
          type:Number,
          default:0
      },
      loss:{
        type:Number,
        default:0
      }


});

const dailyDashboardModel=mongoose.model("dailyDashboard",dailyDashboardSchema);

module.exports=dailyDashboardModel;