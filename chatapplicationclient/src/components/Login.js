import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function Login(props) {

    return (
        <div class="login-form form">
            <form>
                <h1>Login</h1>
                <div class="content">
                    <div class="input-field">
                        <input type="email" placeholder="Email" autocomplete="nope" />
                    </div>
                    <div class="input-field">
                        <input type="password" placeholder="Password" autocomplete="new-password" />
                    </div>
                    <a href="#" class="link">Forgot Your Password?</a>
                </div>
                <div class="action">
                    <Link to="/signup" style={{ textDecoration: 'none' }}><button>Signup</button></Link>
                    <button>Login</button>
                </div>
            </form >
        </div >
    );
}

export default Login;