import React,{useState} from 'react'
import {fs,storage} from '../Config/Config'

export const AddProducts = () => {

    const [title, setTitle]=useState('');
    const [description, setDescription]=useState('');
    const [price, setPrice]=useState('');
    const [image, setImage]=useState(null);
    const [imageError, setImageError]=useState('');

    const [uploadError, setUploadError]=useState('');
    const [successMsg, setSuccessMsg]=useState('');
    
    const types=['image/png','image/jpeg','image/PNG','image/jpg'];

    const handleImg=(e)=>{
        let selectedFile=e.target.files[0];
        if(selectedFile){
            if(selectedFile&&types.includes(selectedFile.type)){                
                setImage(selectedFile);
                setImageError('');
            }
            else{
                setImage(null);
                setImageError('Please select a valid image type (png or jpg)');
            }
        }
        else{
            console.log('select your file');
        }
    }
    
    const handleAddProducts=(e)=>{
        e.preventDefault();      
        const uploadTask = storage.ref(`product-images/${image.name}`).put(image);
        uploadTask.on('state_changed',snapshot=>{
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
        },err=>setUploadError(err.message),
        ()=>{
            storage.ref('product-images').child(image.name).getDownloadURL().then(url=>{
                fs.collection('Products').add({
                    title,
                    description,
                    price: Number(price),
                    url
                }).then(()=>{                    
                    setSuccessMsg('Product added successfully');
                    setTitle('');
                    setDescription('');
                    setPrice('');                   
                    document.getElementById('file').value = '';
                    setUploadError('');
                    setImageError('');
                    setTimeout(()=>{
                        setSuccessMsg('');
                    },3000)
                })
                .catch(err=>setUploadError(err.message))
            })
        })       
    }

    return (
        <div className='container'>
            <br></br>
            <br></br>
            <h1>Add Products</h1>
            <hr></hr>
            {successMsg&&<>
            <div className='success-msg'>{successMsg}</div>
            <br></br>
            </>}
            <form autoComplete="off" className='form-group'
            onSubmit={handleAddProducts}>
                <label>Product Title</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setTitle(e.target.value)} value={title}></input>
                <br></br>
                <label>Product Description</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setDescription(e.target.value)} value={description}></input>
                <br></br>
                <label>Product Price</label>
                <input type="number" className='form-control' required
                onChange={(e)=>setPrice(e.target.value)} value={price}></input>
                <br></br>
                <label>Upload Product Image</label>
                <input type="file" id="file" className='form-control' required
                onChange={handleImg}></input>
                {imageError&&<>
                    <br></br>
                    <div className='error-msg'>{imageError}</div>
                </>}
                <br></br>
                <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <button type="submit" className='btn btn-success btn-md'>
                        SUBMIT
                    </button>
                </div>
            </form>
            {uploadError&&<>
                <br></br>
                <div className='error-msg'>{uploadError}</div>
            </>}
        </div>
    )
}
