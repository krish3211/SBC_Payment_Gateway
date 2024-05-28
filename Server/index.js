const express = require("express");

const https = require("https");
const qs = require("querystring");
const cors = require("cors")
const checksum_lib=require("./Paytm/checksum");
const config =require("./Paytm/config");
const { json } = require("express");
const mongoose = require('mongoose');
const { CLIENT_RENEG_LIMIT } = require("tls");

mongoose.connect('mongodb://127.0.0.1:27017/bill')
  .then(() => console.log('Connected!'));
const app = express();
app.use(cors());

const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });


const PORT = process.env.PORT || 4000;

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

const Schema = mongoose.Schema;
const info = new Schema({
  name:String,
  email: String,
  phno:String,
  amount:String,
  payment : String,
  ORDERID:String,
  BANKTXNID:String,
  GATEWAYNAME:String,
  MID:String,
  ORDERID:String,
  PAYMENTMODE:String,
  REFUNDAMT:String,
  RESPCODE:String,
  RESPMSG:String,
  STATUS:String,
  TXNAMOUNT:String,
  TXNDATE:String,
  TXNID:String,
  BANKNAME:String,
  TXNTYPE:String
});
const Blog = mongoose.model('info', info);

app.get("/fetchall",(req,res)=>{
  Blog.find((err,val)=>{
    if (err){
      console.log(err);
    }else{
      res.json(val);
    }
  })
})

app.get("/fetchid/:id",(req,res)=>{
  var id = req.params['id'];
  Blog.findById(id,(err,val)=>{
    if (err){
      console.log(err);
    }else{
      res.json(val);
    }
  })
})

app.post("/update",[parseUrl, parseJson],async(req,res)=>{
  var detail = {
    _id:req.body.id,
    name:req.body.name,
    email:req.body.email,
    phno:req.body.phno,
    paymentmode:req.body.paymentmode,
    bankname:req.body.bankname,
    status:req.body.status
  }
  await Blog.findOneAndUpdate({_id:detail._id}, {
    name:detail.name,
    email: detail.email,
    phno:detail.phno,
    PAYMENTMODE:detail.paymentmode,
    BANKNAME:detail.bankname,
    STATUS:detail.status
},{returnOriginal: false});
})

app.post("/paynow", [parseUrl, parseJson], (req, res) => {
  // Route for making payment
  var paymentDetails = {
    amount:req.body.amount,
    customerId:req.body.customerId,
    customerEmail:req.body.customerEmail,
    customerPhone:req.body.customerPhone
  };

  if (
    !paymentDetails.amount ||
    !paymentDetails.customerId ||
    !paymentDetails.customerEmail ||
    !paymentDetails.customerPhone
  ) {
    res.status(400).send("Payment failed");
  } else {
    var params = {};
    params["MID"] = config.PaytmConfig.mid;
    params["WEBSITE"] = config.PaytmConfig.website;
    params["CHANNEL_ID"] = "WEB";
    params["INDUSTRY_TYPE_ID"] = "Retail";
    params["ORDER_ID"] = "TEST_" + new Date().getTime();
    params["CUST_ID"] = paymentDetails.customerId;
    params["TXN_AMOUNT"] = paymentDetails.amount;
    params["CALLBACK_URL"] = "http://localhost:4000/callback";
    params["EMAIL"] = paymentDetails.customerEmail;
    params["MOBILE_NO"] = paymentDetails.customerPhone;
    
   
    checksum_lib.genchecksum(params,config.PaytmConfig.key,function (err, checksum) {
       /* var txn_url =
          "https://securegw-stage.paytm.in/theia/processTransaction";*/ // for staging
         var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

        var form_fields = "";
        for (var x in params) {
          form_fields +=
            "<input type='hidden' name='" + x + "' value='" + params[x] + "' />";
        }
        const article = Blog.create({
          name:paymentDetails.customerId,
          email: paymentDetails.customerEmail,
         phno:paymentDetails.customerPhone,
         amount:paymentDetails.amount,
         payment:"Onprocess",
         ORDERID:params['ORDER_ID'],
        });
        form_fields +=
          "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' />";
          var html = '<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' +
          txn_url +
          '" name="f1">' +
          form_fields +
          '</form></body></html>';
        
         res.write(html);
        // res.send("hello world!");
        res.end();
      }
    );
  }
});

app.post("/callback", (req, res) => {
  // Route for verifiying payment
  var body = "";

  req.on("data", function (data) {
    body += data;
  });

  req.on("end", function () {
    var html = "";
    var post_data = qs.parse(body);

    // received params in callback
    // console.log("Callback Response: ", post_data, "n");

    // verify the checksum
    var checksumhash = post_data.CHECKSUMHASH;
    // delete post_data.CHECKSUMHASH;
    var result = checksum_lib.verifychecksum(
      post_data,
      config.PaytmConfig.key,
      checksumhash
    );
    console.log("Checksum Result => ", result, "n");

    // Send Server-to-Server request to verify Order Status
    var params = { MID: config.PaytmConfig.mid, ORDERID: post_data.ORDERID };

    checksum_lib.genchecksum(
      params,
      config.PaytmConfig.key,
      function (err, checksum) {
        params.CHECKSUMHASH = checksum;
        post_data = "JsonData=" + JSON.stringify(params);

        var options = {
          //hostname: "https://securegw.paytm.in/", // for staging
          hostname: 'securegw.paytm.in', // for production
          port: 443,
          path: "/merchant-status/getTxnStatus",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": post_data.length,
          },
        };
        // Set up the request
        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });
          post_res.on("end", async function () {
            // console.log("S2S Response: ", response, "n");
            var _result = JSON.parse(response);
            let doc = await Blog.findOneAndUpdate({ORDERID:_result['ORDERID']}, {
              payment:"Done",
              BANKTXNID:_result['BANKTXNID'],
              GATEWAYNAME:_result['GATEWAYNAME'],
              MID:_result['MID'],
              ORDERID:_result['ORDERID'],
              PAYMENTMODE:_result['PAYMENTMODE'],
              REFUNDAMT:_result['REFUNDAMT'],
              RESPCODE:_result['RESPCODE'],
              RESPMSG:_result['RESPMSG'],
              STATUS:_result['STATUS'],
              TXNAMOUNT:_result['TXNAMOUNT'],
              TXNDATE:_result['TXNDATE'],
              TXNID:_result['TXNID'],
              BANKNAME:_result['BANKNAME'],
              TXNTYPE:_result['TXNTYPE']
          },{returnOriginal: false});
            if (_result.STATUS == "TXN_SUCCESS") {
              let callurl = "http://localhost:3000/invoice/";
              let temp=_result["TXNDATE"].split(" ");
              _result["TXNDATE"]=temp.join("-");
              temp=_result["RESPMSG"].split(" ");
              _result["RESPMSG"]=temp.join("-");
              if (_result['BANKNAME']){
              temp=_result['BANKNAME'].split(" ");
              _result['BANKNAME']=temp.join("-");
              }
              for (var i in _result){
                callurl += i+"="+_result[i]+"&";
              }
              callurl = callurl.slice(0,-1);
              res.send('<form method="get" action="'+callurl+'" name="f1"></form><script>setTimeout(()=>{document.f1.submit()},1000);</script>');
            } else {
              let doc = await Blog.findOneAndUpdate({ORDERID:_result['ORDERID']}, {payment:"failed"},{returnOriginal: false});
              res.send("payment failed");
            }
          });
        });
        // post the data
        post_req.write(post_data);
        post_req.end();
      }
    );
  });
 
});

app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});