const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); // to use css file in public folder

const date = require(__dirname + "/date.js");
const items =["watch gladiator", "Do 10 pressups","brush  my teeth"]; // var items is global can be accessed by all routes or functions
const workItems =[]; // let workItems is local can be accessed by only work route or function
// using ejs coppy and use following parameters as they are cant locate in the docs
app.set("view engine", "ejs"); //coppied as it was from docs dont change it
app.get("/", function(req, res){

    let day = date.getDate();
 res.render("list", {List_title: day, next_item: items });    

});
app.post("/", function(req, res){
    // console.log(req.body);
    let item = req.body.newItem;
    if (req.body.list === "work"){  
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
    // var item = req.body.newItem;
    // items.push(item);
    // res.redirect("/");
});

app.get("/work",function(req,res){
    res.render("list",{List_title: "work list", next_item: workItems})

});
// app.post("/work", function(req, res){
//     var items = req.body.newItem;
//     workItems.push(items);
//     res.redirect("/work");
// });




app.listen(3000, function(){
    console.log("server is running on port 3000");
});    
