const express = require('express')
const router = express.Router()
const UserModel = require('../models/User')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('./verifyjwt');

// get, post, delete, patch

//localhost:3000/api/home

router.get('/token', (req, res)=>{
    const token = jwt.sign({_id:'ds_12345678'}, process.env.SECRET);

    res.send(token)
})

router.post('/add', async (req, res)=>{

    const schema = {
        name: Joi.string().min(5).required(),
        email: Joi.string().min(5).email().required(),
        password: Joi.string().min(6).required()
    }

    const {error} = Joi.validate(req.body, schema);
    if(error) return res.send(error.details[0].message)

    const salt = await bcrypt.genSalt(10) //generate a salt = random text
    const hashPassword = await bcrypt.hash(req.body.password, salt) //hass password
    
    const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })

    const save = await user.save()

    try{
        res.send(save)
    }catch(err){
        res.send(err)
    }
    
})

router.get('/all', verifyToken, async (req, res)=>{
    const users = await UserModel.find()

    try{
        res.send(users)
    }catch(err){
        res.send(err)
    }
})

//localhost:3000/api/user/123123

router.get('/user/:id', async (req, res)=>{
    const id = req.params.id;

    const user = await UserModel.findById(id)

    try{
        res.send(user)
    }catch(err){
        res.send(err)
    }
})

router.delete('/user/:id', async (req, res)=>{
    const id = req.params.id;

    const deletedUser =  await UserModel.deleteOne({
        _id:id
    })

    try{
        res.send(deletedUser)
    }catch(err){
        res.send(err)
    }
})

router.patch('/user/:id', async (req, res)=>{
    const id = req.params.id;

    const update = await UserModel.updateOne(
        {_id:id},
        {
            $set: req.body
        }
    )

    try{
        res.send(update)
    }catch(err){
        res.send(err)
    }

})



module.exports = router