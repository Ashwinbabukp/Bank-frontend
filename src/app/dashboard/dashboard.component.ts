import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ToasterService } from '../services/toaster.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: string = '';
  balance: number = 0;
  balanceSuccessStatus: boolean = true;
  // found transfer
  transferForm = this.fb.group({
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  });
  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private fb: FormBuilder,
    private navigaet:Router
  ) {}
  ngOnInit(): void {
    if (localStorage.getItem('loginUsername')) {
      this.user = localStorage.getItem('loginUsername') || '';
    }
  }
  // get balance
  getbalance() {
    const acno = localStorage.getItem('loginUserAcno');
    //make api service call
    this.api.getbalance(acno).subscribe({
      next: (output: any) => {
        this.balanceSuccessStatus = true;
        this.balance = output;
      },
      error: (err: any) => {
        //alert(err:error)
        this.balanceSuccessStatus = false;
        this.toaster.showWarning(err.error, 'Warning');
      },
    });
  }
  //transfer
  transfer() {
    if (this.transferForm.valid) {
      let creditacno = this.transferForm.value.acno
      let amount = this.transferForm.value.amount
      this.api.fundtransfer(creditacno,amount).subscribe({
        next:(response:any)=>{
          console.log(response);
          this.toaster.showSuccess(response,"Success")
        },
        error:(err:any)=>{
          this.toaster.showError(err.error,"Failed")
        }
      })
    } else {
      this.toaster.showWarning('Invalid Form','Warning');
    }
  }

  deleteAcno(){
    this.api.deleteAccout().subscribe({
      next: (res:any)=>{
        this.toaster.showSuccess(res,'Success');
        this.logoutAcno(1)
      },
      error:(err:any)=>{
        this.toaster.showError(err.message,'Error')
      },
    });
  }
  logoutAcno(n:number){
    localStorage.removeItem('token')
    localStorage.removeItem('loginUserAcno');
    localStorage.removeItem('loginUsername');
    if (n ==0){
      this.toaster.showWarning('Logging out','Success')
    }
    setTimeout(()=>{
      this.navigaet.navigateByUrl('');
    },2000);
  }
}
