const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/emailSubscribe", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
});

// Define Subscription Schema
const subscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

// Define Subscription Model
const Subscription = mongoose.model("Subscription", subscriptionSchema);

// API Routes
app.post("/sendmail", async (req, res) => {
    const { email } = req.body;
    const newSubscription = new Subscription({ email });
    const existingUser = await Subscription.findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message: "Email already Subscribed", error: "error" });
    }

    newSubscription
        .save()
        .then(() => {
            let responseBody = {
                message: "Successfully Subscribed",
                success: "success",
            };
            res.status(200).json(responseBody);
        })
        .catch((err) => {
            let responseBody = {
                message: "Error: " + err,
                error: "error",
            };
            res.status(400).json(responseBody);
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
