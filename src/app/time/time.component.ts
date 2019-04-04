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
  week: Array<any>;
  info: Array<any>;
  dayInfo: Array<any>;

  date: any = new Date();
  hour: any = this.date.getHours();
  day: any = this.date.getDate();
  month: any = this.date.getMonth()+1;
  year: any = this.date.getFullYear();

  constructor(private http: HttpClient) {
    this.days = ['monday', 'thuesday', 'wedsday', 'tuseday', 'friday'];
  }

  weekGenerated(){
    this.week = new Array(5).fill({});

    this.dayInfo = new Array(); // Создаем массив для хранения информации на каждый день

    for(let i = 0; i < 5; i++) {
      this.week[i] = { numberOfMonth : this.day + i }; // Записываем все 5 последующих дней с текущего дня (числамми)
    }

    let info = this.dailyWeather.list;
      // dayInfo[i][0].main.temp - 272.15
      // console.log(info[0].main.temp)

    this.convertKelvinToCelcium(info);

    for(let j = 0; j < 5; j++) {
      let dayArray = [];
      for(let k = 0; k < 8; k++) {
        dayArray.push(info[k]);
      }

      this.dayInfo.push(dayArray);
      info.splice(0,8);
    }

    console.log(this.dayInfo);

  }

  //TODO: средняя температура

  convertKelvinToCelcium(arr){
    for(let i = 0; i < 40; i++){
      arr[i].main.temp = this.converDeegrease(arr[i].main.temp);
      arr[i].main.temp_min = this.converDeegrease(arr[i].main.temp_min);
      arr[i].main.temp_max = this.converDeegrease(arr[i].main.temp_max);
    }
  }

  converDeegrease(kelvin){
    return Math.floor(kelvin-272.15);
  }

  search(){
    new Promise(() => {
      this.http
        .get('https://api.openweathermap.org/data/2.5/weather?q=' + this.cityName + '&appid=5642631a5408cd74374a50283e5b52dd')
        .toPromise()
        .then(res => {
          this.response = res;

          this.http
            .get('https://api.openweathermap.org/data/2.5/forecast?id=' + this.response.id + '&APPID=5642631a5408cd74374a50283e5b52dd')
            .toPromise()
            .then(res => {
              this.dailyWeather = res;
              this.converDeegrease(res)
              this.weekGenerated();
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