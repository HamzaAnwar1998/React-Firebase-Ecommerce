import React from 'react'
import logo from '../Images/logo.png'
import {Link} from 'react-router-dom'
import { auth } from '../Config/Config'
import {useHistory} from 'react-router-dom'

export const Navbar = ({user}) => {

    const history = useHistory();

    const handleLogout=()=>{
        auth.signOut().then(()=>{
            history.push('/');
        })
    }

    return (
        <div className='navbar'>
            <div className='leftside'>
                <div className='logo'>
                    <img src={logo} alt="logo"/>
                </div>
            </div>
            <div className='rightside'>
                {!user&&<>
                    <div><Link className='navlink' to="signup">SIGN UP</Link></div>
                    <div><Link className='navlink' to="login">LOGIN</Link></div>
                </>}
                {user&&<>
                    <div><Link className='navlink' to="/">{user}</Link></div>
                    <div><Link className='navlink' to="/cart">Cart</Link></div>
                    <div className='btn btn-danger btn-md'
                    onClick={handleLogout}>LOGOUT</div>
                </>}                  
            </div>
        </div>
    )
}
