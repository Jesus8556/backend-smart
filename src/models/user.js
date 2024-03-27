const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

//TABLA USUARIOS
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        username:{
            type:String,
            required:true
        },
        email: {
            type: String,
            required: true
        },
        password:{
            type:String,
            required: true
        },
        role:{
            type:String,
            required:true
        }

    }
) 
userSchema.pre('save', async function (next){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password,salt)
        this.password = hashedPassword
        next()
    }catch(error){
        next(error)
    }
})

userSchema.post('save', async function (next){
    try{
        console.log("Called after saving a user")
    }catch(error){
        next(error)
    }
})

//TABLA GARAGE
const garageSchema = mongoose.Schema(
    {
        address: {
            type: String,
            required: true
        },
        description:{
            type:String,
            required:true
        },
        isAvailable: {
            type: String,
            required: true
        },
        pricePerHour:{
            type:Number,
            required: true
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Users'
        }

    }
) 

//TABLA RESERVA
const reservaSchema = mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Users'
        },
        garage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Garages'
        },
        date:{
            type:Date,
            default:Date.now,
            required:true
        },
        startTime:{
            type:Date,
            required:true
        },

        endTime:{
            type:Date,
            required:true
        },
        status:{
            type:String,
            required:true
        }
    }
) 
















const Users = mongoose.model('User', userSchema)
const Garages = mongoose.model('Garage', garageSchema)

module.exports = {Users, Garages}