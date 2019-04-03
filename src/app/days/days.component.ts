import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrls: ['./days.component.sass']
})
export class DaysComponent implements OnInit {
  days: Array<string>;
  temperature: Array<string>;

  constructor() { 
    this.days = ['monday', 'thuesday', 'wedsday', 'tuseday', 'friday', 'satturday', 'sunday'];
    this.temperature = ['12c', '14c', '17c', '8c', '12c', '10c', '12c'];

  }

  ngOnInit() {
  }

}
