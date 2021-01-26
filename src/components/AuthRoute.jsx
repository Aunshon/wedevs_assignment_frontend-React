import axios from 'axios';
import React, { useState } from 'react'
import { Route,Redirect } from "react-router-dom";
import auth from './auth';
import {BaseUrl} from './Util';

export default function AuthRoute({ children, ...rest }) {
    
    const checkIfLogedIn = async ()=>{
        // let res = await axios.post(`${BaseUrl}/api/auth/me?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTYxMTU4NzMzOCwiZXhwIjoxNjExNTkwOTM4LCJuYmYiOjE2MTE1ODczMzgsImp0aSI6InhWOU1YM29xU2gySFdrZ04iLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.xpfkCzSfL7sPB8R9WTB0wvPGCttUgZKsKP7k1jTNVEI`)
        let res = await axios.post(`${BaseUrl}/api/auth/me`)
        console.log(res);
    }
    return (
        <Route
        {...rest}
        render={({ location }) =>
            // logedinUser.role == TAGS.ROLE_ADMIN ? (
            auth.isAuthenticated() ? (
            children
            ) : (
            <Redirect
                to={{
                pathname: "/login",
                state: { from: location }
                }}
            />
            )
        }
        />
    );
}