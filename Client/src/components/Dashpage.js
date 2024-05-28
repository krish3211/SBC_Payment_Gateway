import { useEffect, useState } from "react";
import './Dashpage.css';
import { CSVLink } from "react-csv";

const Dashpage=()=>{
    const [items, setItems] = useState([]);
    const [query,setQuery] = useState("");
    useEffect(() => {
        fetch('http://localhost:4000/fetchall',{method:'GET'})
           .then((response) => response.json())
           .then((data) => {
              setItems(data);
           })
           .catch((err) => {
              console.log(err.message);
           });
     }, []);
     let count=0
     const cloneDeep = require('clone-deep');
     let copy = cloneDeep(items);
     for(let i=0;i<copy.length;i++){
        copy[i]._id = i
     }
   return(
    <>
    <input type="text" placeholder="Search.." name="search" className="search" onChange={(e)=>setQuery(e.target.value)}/>
    <table className="table">
  <thead className="thead-dark">
    <tr>
      <th scope="col">Sno</th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">PhoneNO</th>
      <th scope="col">Amount</th>
      <th scope="col">Date</th>
      <th scope="col">Payment Mode</th>
      <th scope="col">OrderID</th>
      <th scope="col">GatewayName</th>
      <th scope="col">BankTXINID</th>
      <th scope="col">BankName</th>
      <th scope="col">TXID</th>
      <th scope="col">status</th>
      <th scope="col">Mode</th>
    </tr>
  </thead>
  <tbody>
  {items
  .filter((item)=> 
  item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query) || item.phno.includes(query) || item.TXNDATE.includes(query) || item.ORDERID.toLowerCase().includes(query) || item.STATUS.toLowerCase().includes(query) )
  .map((item) => {return (
    <tr key={item._id}className={item.STATUS==='TXN_SUCCESS'?"":"table-danger"}>
      <th scope="row" >{count===items.length?count:count+=1}</th>
      <td>{item.name}</td>
      <td>{item.email}</td>
      <td>{item.phno}</td>
      <td>{item.amount}</td>
      <td>{item.TXNDATE}</td>
      <td>{item.PAYMENTMODE}</td>
      <td>{item.ORDERID}</td>
      <td>{item.GATEWAYNAME}</td>
      <td>{item.BANKTXNID}</td>
      <td>{item.BANKNAME}</td>
      <td>{item.TXNID}</td>
      <td>{item.STATUS==='TXN_SUCCESS'?"Success":"Failure"}</td>
      <td><button type="button" id={item._id} className="btn btn-link" onClick={e => window.location.href="http://localhost:3000/edit/"+e.target.id}>Edit</button></td>
    </tr>
  )})}
  </tbody>
</table>
<button type="button" className="btn btn-light"><CSVLink data={copy} filename ={'Transaction_data.csv'}>Download me</CSVLink></button>
    </>
    )
}


export default Dashpage;