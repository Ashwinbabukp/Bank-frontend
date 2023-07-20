import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToasterService } from '../services/toaster.service';
import jspdf from 'jspdf'
import autoTable from 'jspdf-autotable'



@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  allTransactions: any=[]
  search_key: string = '';
  constructor(private api:ApiService,private toaster:ToasterService){}

  ngOnInit(): void {
    this.api.transactions().subscribe({
      next:(response:any)=>{
        this.allTransactions = response
        console.log(this.allTransactions);
      },
      error:(err:any)=>{
        this.toaster.showError(err.error,"Fail");
      },
    });
  }

  generatePdf () {
    const pdf = new jspdf();
    autoTable(pdf,{html:'#userDetails'});
    pdf.output('dataurlnewwindow',{filename:'Mini-statement.pdf'});
    pdf.save('ministatement.pdf');
  }

}
