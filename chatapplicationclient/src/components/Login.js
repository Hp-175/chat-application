import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import './styles.css';


function Login(props) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const handleSubmit = async e => {
        e.preventDefault();
        props.loginUser({
        username,
        password
        });
        
      }
    return (
        <div class="login-form form">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div class="content">
                    <div class="input-field">
                        <input type="text" onChange={e => setUserName(e.target.value)} placeholder="Username" autocomplete="nope" id="userName" />
                    </div>
                    <div class="input-field">
                        <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" autocomplete="new-password" id="password" />
                    </div>
                </div>
                <div class="action">
                    <Link to="/signup" style={{ textDecoration: 'none' }}><button>Signup</button></Link>
                    <button type="submit">Login</button>
                </div>
            </form >
        </div >
    );
}

export default Login;