import { createContext, useContext, useState } from "react";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import  httpStatus from 'http-status';

export const AuthContext = createContext()

const client = axios.create({
    baseURL: "http://localhost:3000/api/v1/users"
})

export const AuthProvider = ({children}) => {
    const authContext = useContext(AuthContext)
    const router = useNavigate()

    const [userData, setUserData] = useState(authContext)
    const handleRegister = async(name, userName, password) => {
        try {
            let request = await client.post('/register', {
                name: name,
                userName: userName,
                password: password
            })
            if(request.status === httpStatus.CREATED){
                return request.data.message
            }
        } catch (error) {
           throw new error 
        }
    } 

    const handleLogin = async(userName, password) => {
        try {
            let request = await client.post('/login', {
                userName: userName,
                password: password
            })
            if(request.status === httpStatus.OK){
                localStorage.setItem('token', request.data.token)
                router('/')
            }

        } catch (error) {
           throw new error 
        }
    }

    const getHistoryOfUser = async() => {
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem('token')
                }
            })
            return request.data
        } catch (error) {
            throw new error
        }
    }

    const addToUserHistory = async(meetingCode) => {
        try {
            let request = await client.post('add_to_activity', {
                token: localStorage.getItem('token'),
                meeting_code: meetingCode
            })
            return request
        } catch (error) {
            throw new error
        }
    }

    const data = {
        userData, setUserData, handleRegister, handleLogin, getHistoryOfUser, addToUserHistory
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}