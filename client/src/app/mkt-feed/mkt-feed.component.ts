import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-mkt-feed',
  templateUrl: './mkt-feed.component.html',
  styleUrls: ['./mkt-feed.component.css']
})
export class MktFeedComponent implements OnInit, AfterViewInit {

  socket = io('http://localhost:4000');
  vendorSources: string[];
  orderStatusTypes: string[];
  consoleMessages: string[] = [];
  selectedVendor: string;
  selectedOrderStatusType: string;
  tickers: string;
  tradeDate: string;
  @Output()
  submitEvent:EventEmitter<string> = new EventEmitter<string>();
  //@Input() 
  labelVal: string;

  constructor(private activatedRoute: ActivatedRoute, private appService: ApiService) { }

  ngOnInit(): void {
    console.log('ngOnInit Mkt Feed panel!');
    this.vendorSources = this.activatedRoute.data['value']['vendorSources'];
    this.selectedVendor = this.vendorSources[0];
    this.orderStatusTypes = this.activatedRoute.data['value']['orderStatusTypes'];
    this.selectedOrderStatusType = this.orderStatusTypes[0];
    this.socket.on('subscribe-MktdataFeed', function(data: any) {
      if(data !== undefined) {
        if(this.consoleMessages.length > 50) {
          this.clearConsole()
          return;
        }
        this.consoleMessages.push(new Date() + ' MktdataFeed received: ' + JSON.stringify(data));
        const container = document.getElementById("console");
        if(container != null) {
          container.scrollTop = container.scrollHeight;
        }
      }
    }.bind(this));
    this.socket.on('unsubscribe-MktdataFeed', function(data: any) {
      if(data !== undefined) {
        this.consoleMessages.push(new Date() + ' unsubscribe-MktdataFeed received: ' + JSON.stringify(data));
      }
    }.bind(this));
  }

  ngAfterViewInit() {         

  }  

  submit(input:string) {
    this.submitEvent.emit(input);
    this.labelVal = input;
  }

  simulateMktdataFeed() {

  }

  subscribeRealMktdataFeed() {
    this.socket.emit('subscribeMktdataFeed', {'vendor': this.selectedVendor, 'symbols': this.tickers.split(',')})
  }

  unsubscribeRealMktdataFeed() {
    this.socket.emit('unsubscribeMktdataFeed', {'vendor': this.selectedVendor, 'symbols': this.tickers.split(',')})
  }

  simulateTradeFeed() {

  }

  clearConsole() {
    this.consoleMessages = [];
  }

}
