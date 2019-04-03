import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.sass']
})

export class TimeComponent implements OnInit {
  message: string;
  response: any;
  cityName: any;
  dailyWeather: any;

  days: Array<string>;
  week: Array<string>;
  date: any = new Date();
  hour: any = this.date.getHours();
  day: any = this.date.getDate();
  month: any = this.date.getMonth()+1;
  year: any = this.date.getFullYear();

  celcium: number;

  constructor(private http: HttpClient) {
    this.days = ['monday', 'thuesday', 'wedsday', 'tuseday', 'friday'];
    this.weekGenerated();
  }

  weekGenerated(){
    this.week = new Array(5).fill({});

    for(let i = 0; i < 5; i++) {
      this.week[i] = this.day + i;
    }

    console.log(this.week, 'this.week')
  }
  
  converDeegrease(kelvin){
    const far = Math.floor(kelvin-272.15);
    this.celcium = far;
  }

  search(){
    new Promise(() => {
      console.log(1);
      this.http
        .get('https://api.openweathermap.org/data/2.5/weather?q=' + this.cityName + '&appid=5642631a5408cd74374a50283e5b52dd')
        .toPromise()
        .then(res => {
          this.response = res;
          console.log(2);

          this.http
            .get('https://api.openweathermap.org/data/2.5/forecast?id=' + this.response.id + '&APPID=5642631a5408cd74374a50283e5b52dd')
            .toPromise()
            .then(res => {
              this.dailyWeather = res;
              console.log(this.dailyWeather);
              this.converDeegrease(res)
            })
        })
    });
  }
  
  
  ngOnInit(){
    setInterval(()=>{
      this.message = new Date().toLocaleTimeString();
    }, 1000)
  }
}