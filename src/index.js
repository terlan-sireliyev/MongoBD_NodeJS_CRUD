import express from "express";
import client from "../db/mongoDBConnect.js";
import { ObjectId } from "mongodb";
import dotenv from "dotenv"
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static("./public"));

const collection = client.db("sample_mflix").collection('users');

//get all users
app.get('/users', async (req, res) => {
    const users = await collection.find({}).toArray();
    res.send(users)
});

//get users with a limit
app.get('/users/limit', async (req, res) => {
    const limit = parseInt(req.query.limit ?? 10, 10);
    const users = await collection.find({}).limit(limit).toArray();
    res.send(users)
});

//get users by ID
app.get('/users/:id', async (req, res) => {
    const usersId = req.params.id;
    try {
        const objectId = ObjectId.isValid(usersId) ? new ObjectId(usersId) : null;

        if (!objectId) {
            return res.status(400).send('Invalid ObjectId');
        }
        const users = await collection.findOne({ _id: objectId });
        if (users) {
            res.send(users);
        } else {
            res.status(404).send('Users not found');
        }
    } catch (err) {
        res.status(500).send('Error occurred while fetching the users');
    }
});

//post user
app.post('/users', async (req, res) => {
    try {
        const { insertedId } = await collection.insertOne(req.body);
        console.log('Inserted user:', insertedId);
        res.status(201).send({ message: "New user has been created!", result: req.body });
    } catch (error) {
        res.status(400).send({ error: 'Invalid data' });
    }
});

//put user
app.put('/users/:id', async (req, res) => {
    const { _id, ...body } = req.body;
    const usersId = req.params.id;

    try {
        const objectId = ObjectId.isValid(usersId) ? new ObjectId(usersId) : null;

        const updateUsers = await collection.updateOne(
            { _id: new ObjectId(objectId) },
            { $set: body }
        );
        if (updateUsers.matchedCount === 0) {
            return res.status(404).send('Users not found');
        }
        res.send({ message: "Users updated successfully", result: body });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while updating the user');
    }
});

//delet user
app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await collection.deleteOne({
            _id: new ObjectId(id)
        })
        if (deleted.deletedCount === 0) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send({ message: "User deleted successfully", result: deleted });

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
});

// Start the server
app.listen(process.env.NODE_PORT, () => {
    console.log(`Server running on port ${process.env.NODE_PORT}...`);
});




