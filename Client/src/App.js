import './App.css';
import Payment from './components/Paymentpage';

import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Invoice from './components/Invoice';
import Admin from './components/Admin';
import Edit from './components/Edit';

function App() {  

  return (
   <Router>
    <Routes>
      <Route path="/" element={<Payment/>} />
      <Route path="/Invoice/:id" element={<Invoice/>} />
      <Route exact path="/admin" element={<Admin />} />
      <Route path='/edit/:id' element={<Edit />} />
    </Routes>
   </Router>
  );
}

export default App;
