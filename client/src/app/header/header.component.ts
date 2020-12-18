import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  uiLabel: string;

  constructor() { }

  ngOnInit() {
    console.log('ngOnInit Header panel!');
    this.uiLabel = 'Shin';
  }

  onSubmit(text) {
    console.log('header: ' + text);
    this.uiLabel = text;
  }

}
