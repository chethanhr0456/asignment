const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    tablename:{
        type:String,
        requried:true
    },
    startdate:{
        type:String,
        requried:true
    },
    enddate:{
        type:String,
        requried:true
    },
    priority:{
        type:String,
        requried:true
    },
    addedon:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('TaskTracker', taskSchema);

