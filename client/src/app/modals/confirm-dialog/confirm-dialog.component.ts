import { BsModalRef } from 'ngx-bootstrap/modal';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  message: string;
  btnOktext: string;
  btnCancelText: string;
  result: boolean;


  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  confirm(){
    this.result = true;
    this.bsModalRef.hide();
  }
  decline(){
    this.result = false;
    this.bsModalRef.hide();
  }

}
