import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css/dist/js/materialize.min.js';
import axios from 'axios';
import { BaseUrl } from './Util';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');   
    const history = useHistory();
    const loginHandler = ()=>{
        if (validateFields()) {
            axios.post(`${BaseUrl}/api/auth/login`,{email:email,password:password})
            .then((result) => {
                console.log(result.data.access_token);
                localStorage.setItem('aun_access_token',result.data.access_token);
                M.toast({html:'Login successfull !',classes:"green rounded"});
                history.push('/');
            }).catch((err) => {
                console.log(err);
            });
        }
    }
    const validateFields = ()=>{
        if (email === '' || password === '') {
            M.toast({html:'Both Email and Password is srequired !',classes:"orange rounded"});
            return false;
        }else{
            return true;
        }
    }

    return (
        <>
            <nav>
                <div className="nav-wrapper gray">
                <Link to="/login" className="brand-logo">Login</Link>
                <ul className="right">
                    <li><Link to="/">Products</Link></li>
                </ul>
                </div>
            </nav>
                  <div className="container">
            <div className="row">
                <div className="input-field col s11 m10">
                <input value={email} onChange={(event)=>{setEmail(event.target.value)}} id="email" type="email" className="validate"/>
                <label htmlFor="email">Email</label>
                </div>
            </div>
            <div className="row">
                <div className="input-field col s11 m10">
                <input value={password} onChange={(event)=>{setPassword(event.target.value)}} id="password" type="password" className="validate"/>
                <label htmlFor="password">Password</label>
                </div>
            </div>
            <div className="row">
                <div className="col s11">

                <button onClick={loginHandler} className="waves-effect waves-light btn"><i className="material-icons right">east</i>Login Now</button>
                </div>

            </div>

        </div>
        </>
    )
}

export default Login
