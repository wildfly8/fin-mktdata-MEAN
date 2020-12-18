import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { ApiService } from '../services/api.service';
import { Sales } from '../sales';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  socket = io('http://localhost:4000');
  displayedColumns: string[] = ['itemId', 'itemName', 'totalPrice'];
  data: Sales[] = [];
  isLoadingResults = true;
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getSales();
    this.socket.on('update-data', function(data: any) {
      this.getSales();
      this.getChartData();
    }.bind(this));
  } 

  getSales() {
    this.api.getSales()
    .subscribe((res: any) => {
      this.data = res;
      console.log(this.data);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

}
