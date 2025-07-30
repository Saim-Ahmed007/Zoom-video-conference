import { User } from "../models/user.model.js"
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { Meeting } from "../models/meeting.model.js"

const login = async(req,res) => {
    const {userName, password} = req.body
    if(!userName || !password){
            return res.status(400).json({message: 'please provide'})
        }
    try {
        const user = await User.findOne({userName})
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message: 'User not found'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            let token = crypto.randomBytes(20).toString('hex')
            user.token = token
            await user.save()
            return res.status(httpStatus.OK).json({token: token})
        }
    } catch (error) {
        res.status(500).json({message: `something went wrong ${error}`})
    }
}

const register = async(req,res) => {
    const {name, userName, password} = req.body
    try {
        const existingUser = await User.findOne({userName})
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message: 'User already exist'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name: name,
            userName: userName,
            password: hashedPassword
        })
        await newUser.save()
        res.status(httpStatus.CREATED).json({message: 'User Created'})

    } catch (error) {
        res.json({message: `something went wrong ${error}`})
    }
}

const getUserHistory = async(req,res) => {
    const {token} = req.query
    try {
        const user = await User.findOne({token: token})
        const meetings = await Meeting.find({user_id : user.userName})
        res.json(meetings)
    } catch (error) {
        res.json({message: `Something went wrong ${error}`})
    }
}

const addToHistory = async(req, res) => {
    const {token, meeting_code} = req.body
    try {
        const user = await User.findOne({token: token})
        const newMeeting = new Meeting({
            user_id: user.userName,
            meetingCode: meeting_code
        })
        await newMeeting.save()
        res.status(httpStatus.CREATED).json({message: "Added code to history"})

    } catch (error) {
         res.json({message: `Something went wrong ${error}`})
    }
}

export {login, register, getUserHistory, addToHistory}