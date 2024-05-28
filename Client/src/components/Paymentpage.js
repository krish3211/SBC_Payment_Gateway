import "../index.css"
import Axios from 'axios';
import {useState} from 'react';
const Payment=()=>{

    const [cId,setCustomerId]=useState('');
  const [amount,setAmount]=useState('');
  const [cMail, setCustomerEmail]=useState('');
  const [cPhone,setCustomerPhone]=useState('');
  const [html,setHtml]=useState('');
 const HandleName=(e)=>{
    setCustomerId(e.target.value);
  }
  const HandlecustomerEmail=(e)=>{
    setCustomerEmail(e.target.value);
  }
  const  HandlecustomerPhone=(e)=>{
    setCustomerPhone(e.target.value);
  }
  const HandleSubmit=()=>{
    setAmount("1");
    const body={
      amount:amount,
          customerId:cId,
          customerEmail:cMail,
          customerPhone:cPhone,
    }
    const response= Axios.post("http://localhost:4000/paynow",body);
    // const response =  fetch('http://localhost:4000/paynow', {method: 'POST',mode: 'cors',headers: { 'Content-Type': 'application/json' },body:JSON.stringify(body)});
    // console.log(response.json())
    response.then((value) => {
      setHtml(value.data.slice(62,-14));
    });
    // window.location.replace('http://localhost:4000/paynow'); 
  
  }
    return(
        <div className="row my-5">
      <div className="col-md-4 offset-md-4">
        <div className="card">
          <div className="card-body">
              <div className="form-group">
                <label htmlFor="">Name: </label>
                <input className="form-control" type="text" name="name" onChange={HandleName} />
              </div>
              <div className="form-group">
                <label htmlFor="">Email: </label>
                <input className="form-control" type="text" name="email" onChange={HandlecustomerEmail} />
              </div>
              <div className="form-group">
                <label htmlFor="">Phone: </label>
                <input className="form-control" type="text" name="phone" onChange={HandlecustomerPhone}/>
              </div>
              <div className="form-group">
                <button className="btn form-control btn-primary" onClick={HandleSubmit} >PayNow</button>
              </div>
              <div dangerouslySetInnerHTML={{__html: html === ''?"":html}}></div>
              {html === ''?"":setTimeout(() => {document.f1.submit()}, 1000)}
          </div>
        </div>
      </div>
    </div>


    )
}


export default Payment;