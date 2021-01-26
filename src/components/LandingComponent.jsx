import React, { useEffect, useRef, useState } from 'react'

import M from 'materialize-css/dist/js/materialize.min.js';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from './Util';
function LandingComponent() {
    const [logedin, setLogedin] = useState(false);
    const [edatible, setEdatible] = useState(false);
    const [products, setProducts] = useState([]);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');

    const myModal = useRef();
    const imageName = useRef();
    const history = useHistory();
    useEffect(() => {
        if (!localStorage.getItem('aun_access_token') || localStorage.getItem('aun_access_token')==='' || localStorage.getItem('aun_access_token')===null ) {
            history.push('/login');
        }else{
            checkIfLogedIn();
        }
    }, []);

    function checkIfLogedIn() {
        // let res = await axios.post(`${BaseUrl}/api/auth/me?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xMjcuMC4wLjE6ODAwMFwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTYxMTU4NzMzOCwiZXhwIjoxNjExNTkwOTM4LCJuYmYiOjE2MTE1ODczMzgsImp0aSI6InhWOU1YM29xU2gySFdrZ04iLCJzdWIiOjEsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.xpfkCzSfL7sPB8R9WTB0wvPGCttUgZKsKP7k1jTNVEI`)
        axios.post(`${BaseUrl}/api/auth/me?token=${localStorage.getItem('aun_access_token')}`)
        .then((result) => {
            setLogedin(false);
            loadData();
        }).catch((err) => {
            setLogedin(false);
            M.toast({html:"Please login !",classes:'rounded orange'});
            history.push('/login');
        });
    }
    function loadData() {
        axios.post(`${BaseUrl}/api/auth/products?token=${localStorage.getItem('aun_access_token')}`)
        .then((result) => {
            setLogedin(true);
            setProducts(result.data.products);
        }).catch((err) => {
            setLogedin(false);
            M.toast({html:"Please login !",classes:'rounded orange'});
            history.push('/login');
        });
    }
    function logoutHandler(e) {
        e.preventDefault();
        axios.post(`${BaseUrl}/api/auth/logout?token=${localStorage.getItem('aun_access_token')}`)
        .then((result) => {
            // setLogedin(true);
            localStorage.removeItem('aun_access_token');
            M.toast({html:result.data.message,classes:"rounded green"});
            history.push('/login');
        }).catch(err=>{
            localStorage.removeItem('aun_access_token');
            history.push('/login');
        });
    }
    function editHandler(e,item) {
        e.preventDefault();

        setTitle('');
        setPrice('');
        setImage('');
        imageName.current.value = '';
        setDescription('');

        setEdatible(true);

        setTitle(item.title);
        setPrice(item.price);
        setDescription(item.description);
        setId(item.id);

        let instance = M.Modal.init(myModal.current);
        instance.open();
    }    
    function deleteHandler(e,item) {
        e.preventDefault();
        axios.post(`${BaseUrl}/api/auth/products/delete?token=${localStorage.getItem('aun_access_token')}`,item)
        .then((result) => {
            setLogedin(true);
            // console.log(result.data);
            console.log(result.data.products);
            setProducts(result.data.products);
        }).catch((err) => {
            setLogedin(false);
            M.toast({html:"Please login !",classes:'rounded orange'});
            history.push('/login');
        });
    }    
    function addNewProduct() {
        setEdatible(false);
        setTitle('');
        setPrice('');
        setImage('');
        imageName.current.value = '';
        setDescription('');

        // let instance = M.Modal.getInstance(myModal.current);
        let instance = M.Modal.init(myModal.current);
        instance.open();

    }
    function saveNewProduct() {
        if (checkAllData()) {
            axios.post(`${BaseUrl}/api/auth/products/store?token=${localStorage.getItem('aun_access_token')}`,{title:title,price:price,image:image,description:description},{headers:{'Content-Type': 'application/json','Accept':'application/json'}})
            .then((result) => {
                let instance = M.Modal.init(myModal.current);
                setLogedin(false);
                setProducts([]);
                setLogedin(true);
                instance.close();
                setProducts(result.data.products);
            }).catch((err) => {
                if (err.message == 'Request failed with status code 500') {
                    M.toast({html:"Please try again !",classes:'yellow rounded'});
                } else {   
                    setLogedin(false);
                    M.toast({html:"Please login !",classes:'rounded orange'});
                    history.push('/login');
                }
            });
        } 
        else {
            M.toast({html:"Please fill all the fields !",classes:'red rounded'});
        }
    }
    function checkAllData() {
        if (title !== ''  && description!=='' && price!=='') {
            return true;
        } else {
            return false;           
        }
    }
    function saveEditProduct() {
        if (checkAllData()) {
            setLogedin(false);
            axios.post(`${BaseUrl}/api/auth/products/update?token=${localStorage.getItem('aun_access_token')}`,{id:id,title:title,price:price,image:image,description:description},{headers:{'Content-Type': 'application/json','Accept':'application/json'}})
            .then((result) => {
                setProducts([]);
                setLogedin(true);
                let instance = M.Modal.init(myModal.current);
                instance.close();
                setProducts(result.data.products);
            }).catch((err) => {
                if (err.message == 'Request failed with status code 500') {
                    M.toast({html:"Please try again !",classes:'yellow rounded'});
                } else {   
                    setLogedin(false);
                    M.toast({html:"Please login !",classes:'rounded orange'});
                    history.push('/login');
                }
            });
        } 
        else {
            M.toast({html:"Please fill all the fields !",classes:'red rounded'});
        }

    }
    const imageSelectHandler = (e)=>{
        var fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = (e) => {
            setImage(e.target.result);
        };
    }

    return (
        <div>
            <nav>
                <div className="nav-wrapper gray">
                <Link to="/" className="brand-logo"  style={{ marginLeft:'20px' }}>Products</Link>
                <ul className="right" style={{ marginRight:'20px' }}>
                    {logedin?
                    <li><a href="/" onClick={logoutHandler}>Logout</a></li>
                    :
                    <li><Link to="/login">Login</Link></li>
                    }
                </ul>
                </div>
            </nav>
            {logedin?
                <div className="container">
                    <div className="row">
                        <div className="col s12 z-depth-2" style={{ borderRadius:'5px',marginTop:'10px' }}>
                            <p className="flow-text left">Product List</p>
                            <p className="right"><button onClick={addNewProduct} className="btn waves-effect waves-light btn-large">Add New</button></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <table>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product Title</th>
                                    <th>Product Description</th>
                                    <th>Product Price</th>
                                    <th>Product Image</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                                </thead>

                                <tbody>
                                    {products.map((item,index)=>{
                                    return <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>TK.{item.price}</td>
                                        <td><img style={{ maxWidth:'100px' }} src={item.image==null?"https://via.placeholder.com/100x100.png?text=NO+Image":`${BaseUrl}/uploads/product/${item.image}`} alt="" /></td>
                                        <td>  <a onClick={event=>editHandler(event,item)} className="btn-floating btn-large waves-effect waves-light blue darken-4 small" href="/"><i className="material-icons">edit</i></a>
                                        </td>
                                        <td>  <a onClick={event=>deleteHandler(event,item)} className="btn-floating btn-large waves-effect waves-light red darken-4 small" href="/"><i className="material-icons">delete</i></a>
                                        </td>                                        
                                    </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            :
                <div className="container">
                    <div className="row">
                        {/* <div className="col s6 offset-s5" style={{ marginTop:'100px' }}> */}
                        <div className="col s12 center-align" style={{ marginTop:'200px' }}>
                            <div className="preloader-wrapper big active">
                                <div className="spinner-layer spinner-blue-only">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div><div className="gap-patch">
                                    <div className="circle"></div>
                                </div><div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }


            <div id="modal1" className="modal" ref={myModal}>
                <div className="modal-content">
                <h4>{!edatible?"Add new product":"Update product"}</h4>
                
                
                <div className="row">
                    <form className="col s12">
                    <div className="row">
                        <div className="input-field col s6">
                        <input value={title} onChange={(event)=>{setTitle(event.target.value)}} id="Product_name" type="text" className="validate"/>
                        <label htmlFor="Product_name">Product name</label>
                        </div>
                        <div className="input-field col s6">
                        <input value={price} onChange={(event)=>{setPrice(event.target.value)}} id="last_name" type="number" className="validate"/>
                        <label htmlFor="last_name">Product Price</label>
                        </div>
                    </div>
                    {image!==''?<img style={{ maxWidth:'200px' }} src={image} alt=""/>:null}
                        <div className="file-field input-field">
                        <div className="btn">
                            <span>Choose Image</span>
                            <input type="file" onChange={imageSelectHandler}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input ref={imageName} className="file-path validate" type="text"/>
                        </div>
                        </div>
                    <div className="row">
                        <div className="input-field col s12">
                        <textarea value={description} onChange={(event)=>{setDescription(event.target.value)}} id="textarea1" className="materialize-textarea"></textarea>
                        <label htmlFor="textarea1">Description</label>
                        </div>
                    </div>
                    </form>
                </div>


                </div>
                <div className="modal-footer">
                <button onClick={!edatible?saveNewProduct:saveEditProduct} className="waves-effect green waves-green btn-flat">{!edatible?"Save":"Update"}</button>
                </div>
            </div>


        </div>
    )
}

export default LandingComponent
