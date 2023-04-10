const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
mongoose.set('strictQuery', false);

const PORT = 4002;
const TaskTracker = require('./model/tasks')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const dbURL = "mongodb://localhost:27017/tasktracker"
mongoose.connect(dbURL).then(() => {
    console.log('Connected to Database');
})

//! Adding Data To The Database
app.post('/add', async (req, res) => {
    try {
        const existTask = await TaskTracker.findOne({ tablename: req.body.tablename }).exec();
        if (existTask) {
            res.send({ message: "Task Already Exist... Try Adding another task" })
            return;
        }

        let taskdata = new TaskTracker({
            tablename: req.body.tablename,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            priority: req.body.priority,
            addedon: req.body.addedon

        })
        await taskdata.save()
        res.send({ message: "Task Added Successfully" })
    } catch {
        res.send({ message: "Error while adding Task" })
    }
})
//! Deleting Functions
app.delete('/delete-data/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await TaskTracker.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            res.send(`code with ${id} has been deleted successfully`)
        } else {
            res.send(`code with ${id} not found`)
        }
    } catch (err) {
        console.error(err);
    }
})

//! Editing Functions
app.get('/tasks/:id', async (req, res) => {
    let { id } = req.params
    try {
        const singleData = await TaskTracker.findById(id);
        res.send(singleData);
    } catch (err) {
        res.send(err)
    }
})
//! Updating
app.put("/update/:id",async (req,res)=>{
    const {id} = req.params
    await TaskTracker.updateOne({_id:id},{
        $set:{
            tablename:req.body.tablename,
            startdate:req.body.startdate,
            enddate:req.body.enddate,
            priority:req.body.priority,
            addedon:req.body.addedon
        }
    })
})

app.get('/home-data',async (req,res)=>{
    let homeData =  await TaskTracker.find()
    res.send(homeData)
})


app.listen(PORT, () => {
    console.log(`Running at ${PORT}`);
})
    





