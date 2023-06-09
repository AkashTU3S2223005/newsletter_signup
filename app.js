const express = require("express");

const bodyparser = require("body-parser");

const https = require("https");

const request = require("request");
const { json } = require("body-parser");
const { url } = require("inspector");
const { urlToHttpOptions } = require("url");

const path = require("path")

const app = express();


app.use(express.static(path.join(__dirname,"/public")));//static folder to acess css and image files

app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {

    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;

    let data = {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
    };

    let jsondata = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/665b12860e/members";

    const options = {
        method: "POST",
        auth: "Akash:82af6b3463e62d9c29418396ca8dc993-us17"
    };

    const request = https.request(url, options, (response) => {

        if(response.statusCode===200){
          res.sendFile(__dirname+"/success.html");
        }
        else{
           res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsondata);
    request.end();
});



app.post("/failure",(req,res)=>{
    res.redirect("/");
});

app.listen("3000", () => {
    console.log("server is running on port 3000.........");
})


// api key 5e5b6b8ffeebf4042f18ceff797bdf95-us17

// id 665b12860e