import React,{useState} from 'react'
import {auth,fs} from '../Config/Config'
import {useHistory} from 'react-router-dom'
import {Link} from 'react-router-dom'

export const Signup = () => {

    const history = useHistory();

    const [fullName, setFullName]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const handleSignup=(e)=>{
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email,password).then(()=>{
            fs.collection('users').add({
                FullName: fullName,
                Email: email,
                Password: password
            }).then(()=>{
                setSuccessMsg('Sign Up Successfull. You will now automatically get redirected to Login');
                setFullName('');
                setEmail('');
                setPassword('');
                setErrorMsg('');
                setTimeout(()=>{
                    history.push('/login');
                    setSuccessMsg('');
                },5000)
            }).catch(err=>setErrorMsg(err.message))
        }).catch(err=>setErrorMsg(err.message))
    }

    return (
        <div className='container'>
            <br></br>
            <br></br>
            <h1>Sign Up</h1>
            <hr></hr>
            {successMsg&&<>
            <div className='success-msg'>{successMsg}</div>
            <br></br>
            </>}
            <form className='form-group' autoComplete="off"
                onSubmit={handleSignup}>
                <label>Full Name</label>
                <input type="text" className='form-control' required
                    onChange={(e)=>setFullName(e.target.value)} value={fullName}
                />
                <br></br>
                <label>Email</label>
                <input type="email" className='form-control' required
                    onChange={(e)=>setEmail(e.target.value)} value={email}
                />
                <br></br>
                <label>Password</label>
                <input type="password" className='form-control' required
                    onChange={(e)=>setPassword(e.target.value)} value={password}
                />
                <br></br>
                <div className='btn-box'>
                    <span>Already have an account Login 
                    <Link to="login" className='link'> Here</Link></span>
                    <button type="submit" className='btn btn-success btn-md'>
                        SIGN UP
                    </button>
                </div>                
            </form>
            {errorMsg&&<>
                <br></br>
                <div className='error-msg'>{errorMsg}</div>
            </>}
        </div>
    )
}
