import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) {    
   }

  busy(){
    this.busyRequestCount++;
    this.spinnerService.show(undefined,{
      // type:'la-ball-spin-clockwise-fade-rotating',
      // bdColor:'rgba(255,255,255,0)',
      // color:'#333333'
      bdColor:"rgba(51,51,51,0.8)",
      size:"medium",
      color:"#fff",
     // type:"ball-atom"
      type:"ball-spin-clockwise-fade-rotating"
    })
  }

  idle(){    
    this.busyRequestCount--;
    if(this.busyRequestCount <= 0){
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
