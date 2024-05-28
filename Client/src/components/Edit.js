import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export default function Edit() {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const urlid = id;
    useEffect(() => {
        fetch('http://localhost:4000/fetchid/'+urlid,{method:'GET',mode: 'cors'})
           .then((response) => response.json())
           .then((data) => {
              setItems(data);
           })
           .catch((err) => {
              console.log(err.message);
           });
     }, []);
     const [name,setName] =  useState(items.name);
    const [email,setEmail] = useState(items.email);
    const [phno,setPhno] = useState(items.phno);
    const [paymentmode,setPaymentmode] = useState(items.PAYMENTMODE);
    const [bankname,setBankname] = useState(items.BANKNAME);
    const [status, setStatus] = useState(items.STATUS);
    const handleName=(e)=>{
        setName(e.target.value);
      }
    const handleEmail=(e)=>{
        setEmail(e.target.value);
    }
    const handlePhno=(e)=>{
        setPhno(e.target.value);
    }
    const handlepaymode=(e)=>{
        setPaymentmode(e.target.value);
    }
    const handleBankname=(e)=>{
        setBankname(e.target.value);
    }
    const handleSuccess=()=>{
        setStatus('TXN_SUCCESS');
    }
    const handleFailure=()=>{
        setStatus('TXN_FAILURE');
    }
    const handleSubmit=()=>{
        const body={
            id:items._id,
            name:name===undefined?items.name:name,
                email:email===undefined?items.email:email,
                phno:phno===undefined?items.phno:phno,
                paymentmode:paymentmode===undefined?items.PAYMENTMODE:paymentmode,
                bankname:bankname===undefined?items.BANKNAME:bankname,
                status:status===undefined?items.STATUS:status
          }
        fetch("http://localhost:4000/update", {method: 'POST',mode: 'cors',headers: { 'Content-Type': 'application/json' },body:JSON.stringify(body)})
                           .then((response) => response.json())
        window.location.href='http://localhost:3000/admin'
        
    }
  return (
    <div className="row my-5">
    <div className="col-md-4 offset-md-4">
      <div className="card">
        <div className="card-body">
            <div className="form-group">
              <label htmlFor="">Name: </label>
              <input className="form-control" type="text" name="name"  placeholder={items.name} onChange={handleName}/>
            </div>
            <div className="form-group">
              <label htmlFor="">Email: </label>
              <input className="form-control" type="text" name="email"   placeholder={items.email} onChange={handleEmail}/>
            </div>
            <div className="form-group">
              <label htmlFor="">Phone: </label>
              <input className="form-control" type="text" name="phone" placeholder={items.phno} onChange={handlePhno}/>
            </div>
            <div className="form-group">
              <label htmlFor="">paymentmode: </label>
              <input className="form-control" type="text" name="UPI"  placeholder={items.PAYMENTMODE} onChange={handlepaymode} />
            </div>
            <div className="form-group">
              <label htmlFor="">BankName: </label>
              <input className="form-control" type="text" name="Bankname"  placeholder={items.BANKNAME} onChange={handleBankname}/>
            </div>
            <div className="form-group">
              <label htmlFor="">Status: </label><br/>
              Success:
              <input className="form-control" type="radio" name="Status" onClick={handleSuccess} />
              Failure:
              <input className="form-control" type="radio" name="Status" onClick={handleFailure}/>
            </div>
            <div className="form-group">
              <button className="btn form-control btn-primary" onClick={handleSubmit}>Update</button>
            </div>
        </div>
      </div>
    </div>
  </div>

  )
}
