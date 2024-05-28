import {useState} from 'react';
import Dashpage from './Dashpage';



const Admin=()=>{
  const [adname,setAdname]=useState('');
  const [adpassword,setAdpassword]=useState('');
  const [islog,setIslog]=useState(false);
  
  const HandleName=(e)=>{
    setAdname(e.target.value)
  }
  const Handlepassword=(e)=>{
    setAdpassword(e.target.value)
  }
  const HandleSubmit=()=>{
    if (adname === 'Admin' && adpassword === 'admin'){
        setIslog(true);
    }
    else{
        console.log("error");
    }
  }



   if(!islog){
    return(
        <>
        <div className="row my-5">
      <div className="col-md-4 offset-md-4">
        <div className="card">
          <div className="card-body">
              <div className="form-group">
                <label htmlFor="">UserName: </label>
                <input className="form-control" type="text" name="name" onChange={HandleName} />
              </div>
              <div className="form-group">
                <label htmlFor="">password: </label>
                <input className="form-control" type="password" name="password" onChange={Handlepassword} />
                </div>
              <div className="form-group">
                <button className="btn form-control btn-primary" onClick={HandleSubmit}>submit</button>
              </div>
          </div>
        </div>
      </div>
    </div>
        </>
    )}
    else{
      return(
        <Dashpage />
      )
    }


}
export default Admin;