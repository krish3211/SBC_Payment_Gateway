import "./Invoice.css"
import logo from "./logo.png"
import {useParams} from "react-router-dom";
import { useRef } from "react";
import jsPDF from "jspdf";
const Invoice=()=>{
    const { id } = useParams();
    let temp = id.split("&");
    for (var i in temp){
        temp[i] =temp[i].split("=");
    }
    let obj = {};
     
        temp.forEach((v) => {
            let key = v[0];
            let value = v[1];
            obj[key] = value;
        });
    
    // console.log(obj);
    const reportTemplateRef = useRef(null);

	const handleGeneratePdf = () => {
		const doc = new jsPDF({
			orientation: "landscape",
            unit: "px",
            format: [2000, 2000]
		});

		// Adding the fonts.
		doc.setFont('Inter-Regular', 'normal');

		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('document');
			},
		});
	};
    return(
        <>
        <div ref={reportTemplateRef}>
        <main id="invoice-format">
        <header>
            <div id="main-logo">
            <img id="logo"  src={logo} alt="" />
            </div>
            <div id="brand-name">
                <h1>special coding</h1>
            </div>
        </header> 
        <div id="ribun-container">
            <div id="ribun">
                <p></p>
            </div>
            <div id="ribun-tag">
                <h2>invoice</h2>
            </div>
            <div id="ribun2">
                <p className="ribun2-color"></p>
            </div>
        </div>
        <div id="information-data">
         <table className="information-container">
            <thead>
                <tr className="table-row">
                    <th id="table-head1">invoice to:</th>
                </tr>
            </thead>
            <tbody>
                <tr className="table-row">
                    <th className="table-head">Name</th>
                    <th className="table-head">invoice#</th>
                    <td className="table-data">532425</td>
                </tr>
                <tr className="table-row">
                    <td className="table-data">detail of the transaction</td>
                    <th className="table-head">Date</th>
                    <td className="table-data">{obj["TXNDATE"]}</td>
                </tr>
            </tbody>
         </table>
        </div>
        <div id="data-table">
            <table >
                <thead>
                    <tr>
                        <th>s.no</th>
                        <th>txn-id</th>
                        <th>bank-txnid</th>
                        <th> order-id</th>
                        <th> txn-amount</th>
                        <th>status</th>
                        <th>payment-mode</th>
                        <th>txn date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                      <td>1</td> 
                      <td>{obj["TXNID"]}</td> 
                      <td>{obj["BANKTXNID"]}</td> 
                      <td>{obj["ORDERID"]}</td> 
                      <td>{obj["TXNAMOUNT"]}</td> 
                      <td>{obj["STATUS"]}</td> 
                      <td>{obj["PAYMENTMODE"]}</td>
                      <td>{obj["TXNDATE"]}</td>
                    </tr>
                </tbody>
            </table>
        </div> 
        <div id="table-footer">
           <table id="footer-data">
            <tr className="table-row2">
                <th className="table-head2">slot date</th>
                <td className="table-data2">21/1/23</td>
            </tr>
            <tr className="table-row2">
                <th className="table-head2">slot time</th>
                <td className="table-data2">5:30</td>
            </tr>
           </table>
        </div>   
        
</main>
</div>
<button className="button" onClick={handleGeneratePdf}>Generate PDF</button>
        </>
    )
}


export default Invoice;