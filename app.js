const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); // to use css file in public folder

// const date = require(__dirname + "/date.js");

// comment out all the arrays and use mongoose mongodb database to store the items

// const items =["watch gladiator", "Do 10 pressups","brush  my teeth"]; // var items is global can be accessed by all routes or functions
// const workItems =[]; // let workItems is local can be accessed by only work route or function
// using ejs coppy and use following parameters as they are cant locate in the docs
app.set("view engine", "ejs"); //coppied as it was from docs dont change it

mongoose.connect("mongodb://localhost:27017/TodolistDB ");
const itemsSchema ={
    name: String
}
const Item= mongoose.model("Item", itemsSchema); //name of model must start with capital letter and be in sigular form
const item1 =new Item({
    name:"Welcome to your todolist"
});
const item2 = new Item({
    name:"Hit the + button to add a new item"

});
const item3 = new Item({    
    name:"<-- Hit this to delete an item"
});
const defaultItems =[item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);



app.get("/", async function(req, res){
    try {
        const foundItems = await Item.find({});

        if(foundItems.length === 0){
            Item.insertMany(defaultItems).then(function(){
            console.log("Successfully saved default items to DB")

        }).catch(function(err){
            console.log(err);//failure

    });
    res.redirect("/");


        }
        else{

        res.render("list", {List_title: "Today", next_item: foundItems });
        }

    } catch (err) {
        console.error("Error:", err);
        // Handle error appropriately
    }
});
app.get("/:custom", async function(req, res) {
    try {
        const custom = _.capitalize(req.params.custom);
        let foundList = await List.findOne({ name:custom });
        if (!foundList) {
            // Create a new list
            const list = new List({
                name: custom,
                items: defaultItems
            });
            await list.save();
        } else {
            // Show an existing list
            res.render("list", { List_title: foundList.name, next_item: foundList.items });
            // Return here to prevent further execution
            return;
        }
        res.redirect("/" + custom);
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred.");
    }
});



    // let day = date.getDay();
 
app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    }) ;
    if (listName === "Today"){
    item.save();
    res.redirect("/");
    }
    else{
        List.findOne({name:listName}).then(function(foundname ){
            foundname.items.push(item);
            foundname.save();
            res.redirect("/" + listName)
        })
    }

//    <-- bellow code was comenteed because it follows the old way of storing items in an array -->
    // let item = req.body.newItem;
    // if (req.body.list === "work"){  
    //     workItems.push(item);
    //     res.redirect("/work");
    // }
    // else{
    //     items.push(item);
    //     res.redirect("/");
    // }
    // var item = req.body.newItem;
    // items.push(item);
    // res.redirect("/");
});
// app.post("/delete", async function(req, res){
app.post("/delete", async function(req, res){
    const checkedItemId = req.body.checkedbox;
    const listName = req.body.listName.trim();

    try {
        if (listName === "Today") {
            await Item.findByIdAndDelete(checkedItemId);
            console.log("Successfully deleted checked item");
            res.redirect("/");


        } else {
            await List.findOneAndUpdate(
                { name: listName },
                { $pull: { items: { _id: checkedItemId } } 
            
            }
            );

            res.redirect("/" + listName);
        }
    } catch (err) {
        console.error("Error:", err);
        // Handle error appropriately
    }
});







// app.post("/delete", function(req, res){
//     const checkedItemId = req.body.checkedbox;
//     const listName = req.body.listName;

//     if(listName ==="Today"){
//     Item.findByIdAndDelete(checkedItemId)
//         .then(deletedItem => {
          
//             if (deletedItem) {
//                 console.log("Successfully deleted checked item");
//             } 
//                 else{
//         List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}});

//     }
//             res.redirect("/");
//         })
//         .catch(err => {
//             console.error("Error:", err);
//             // Handle error appropriately
//         });
//     }

// });


// app.get("/work",function(req,res){
//     res.render("list",{List_title: "work list", next_item: workItems})

// });
// app.post("/work", function(req, res){
//     var items = req.body.newItem;
//     workItems.push(items);
//     res.redirect("/work");
// });



app.listen(3000, function(){
    console.log("server is running on port 3000");
});    
