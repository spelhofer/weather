import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.sass']
})

export class TimeComponent implements OnInit {
  selectedDay: any = {}; //Выбраный день
  currentDaySpecificTime: any; //Время выбранного дня
  isNight: boolean; //смена дня и ночи
  currentTime: string; //текущее время
  cityName: string = 'lviv'; //временно для поисковика
  allWeekInfoArray: Array<any>; //массив с данными сгенерированая неделя+масив с температурой + масив обьектов с временем по текущей дате
  days: Array<string>; // отрисовка дней недели
  today: string = new Date().toLocaleDateString(); // текущий день, дата
  times: Array<any>; // переделать, пока масив захардкоженого времени по текущей дате
  dayNames: Array<string>; // масив дней, для отрисовки в days 
  show: boolean  = false;
  constructor(private http: HttpClient) {
    this.show = false;
    this.times = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.isNight = this.getIsNight();
  }

  getIsNight() {
    var time = new Date().getHours()
    return time < 18 && time > 7 ? false : true;
  }

  drawDays(allWeek, dailyWeather){
    var obj = {};
    var week = [];
    var counter = 0;
    var days = new Date(dailyWeather.list[0].dt_txt);
    var currentIndex = days.getDay();
    var dayIndex = currentIndex;

    for(var i = currentIndex; i < currentIndex + 5; i++){
      if(dayIndex > 6){
        dayIndex = 0;
      }

      week.push(this.dayNames[dayIndex]);
      obj[this.dayNames[dayIndex]] = allWeek[counter];

      counter++;
      dayIndex++;
    }
    
    this.days = week;
  }

  convertTemperature(temp){
    return Math.floor(temp - 272.15);
  }

  weekGenerated(res: any){
    var list = res.list;

    var allWeek = [];

    var lastDay = new Date(list[0].dt_txt).getDate();
    var dayArray = [];

    for (var i = 0; i < list.length; i++){
      var currentDay = new Date(list[i].dt_txt);
      var result = currentDay.getDate();
      
      if(lastDay === result){
        dayArray.push(list[i]);
      } else {
        allWeek.push(dayArray);
        dayArray = [];
        dayArray.push(list[i]);
      }

      lastDay = result;
    }

    this.allWeekInfoArray = allWeek.map(x => this.extractDayInfo(x));

    this.drawDays(allWeek, res);
  }

  extractDayInfo(dayInfo) {
    var minTemp = dayInfo[0].main.temp_min;
    var maxTemp = dayInfo[0].main.temp_max; 
    var hoursData: any = {};

    for (var i = 0; i < dayInfo.length; i++){
      minTemp = Math.min(minTemp, dayInfo[i].main.temp_min);
      maxTemp = Math.max(maxTemp, dayInfo[i].main.temp_max);
      var hour = new Date(dayInfo[i].dt_txt).getHours().toString();
      hoursData[hour] = dayInfo[i];
    }

    return {
      date: new Date(dayInfo[0].dt_txt).getDate(),
      minTemp: minTemp,
      maxTemp: maxTemp,
      hoursData: hoursData
    };
  }

  setTimeInfo(time){
    var timeNumber = parseInt(time);
    this.currentDaySpecificTime = this.selectedDay.hoursData[timeNumber];
    console.log('a' , this.currentDaySpecificTime)
  }
  
  setActiveClass(index){
    var activeElements = document.querySelectorAll(".active");
    var activeElement = document.getElementsByClassName("main--dayContainer")[index];

    activeElements.forEach(element => {
      element.classList.remove("active");
    });
    
    activeElement.classList.add("active")
  }

  checkDay(index){
    this.selectedDay = this.allWeekInfoArray[index];
    this.setActiveClass(index);
  }

  search(){
    return this.http
        .get('https://api.openweathermap.org/data/2.5/weather?q=' + this.cityName + '&appid=5642631a5408cd74374a50283e5b52dd')
        .toPromise()
        .then(res => {
          return this.http
            .get('https://api.openweathermap.org/data/2.5/forecast?id=' + (<any>res).id + '&APPID=5642631a5408cd74374a50283e5b52dd')
            .toPromise()
            .then(res => {
              this.weekGenerated(res);
              })
          })
    } 
    
  ngOnInit(){
    setInterval(()=>{
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000)
  }
}