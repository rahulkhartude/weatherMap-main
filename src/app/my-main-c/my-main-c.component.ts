import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MyServiceService } from '../my-service.service'
import { DatePipe } from '@angular/common'
import { NgtscCompilerHost } from '@angular/compiler-cli/src/ngtsc/file_system';
import { throttleTime, map, scan } from 'rxjs/operators';
import { async } from 'rxjs';

@Component({
  selector: 'app-my-main-c',
  templateUrl: './my-main-c.component.html',
  styleUrls: ['./my-main-c.component.css'],
  providers: [DatePipe]
})
export class MyMainCComponent implements OnInit {
  @ViewChild('location') textField!: ElementRef;

  private apiKey = "439d4b804bc8187953eb36d2a8c26a02"
  cityData: any
  cityName = 'pune';
  myChart: any;

  // todaysDate = new Date();
  todaysDate: any
  lat: any // 18.5196,
  lon: any // 73.8553
  weatherIcon: any

  constructor(private _myService: MyServiceService, private datePipe: DatePipe) {

    Chart.register(...registerables);
  }

  offset: any
  cityArray: any[] = []
  ngOnInit(): void {
    // this.searchMethod("pune")
  }
   

  celFar:boolean=true

  unit:any="metric"
  celM(){
    this.celFar = true;
    this.unit="metric"
    console.log("cel")
    this.getWeatherDetails()
    
  }
  farM(){
    this.celFar = false;
    this.unit="imperial"
    console.log("far")
    this.getWeatherDetails()
  }



forautosearch:any

  searchMethod(name: any) {
    if (this.textField.nativeElement.value) {
      this.cityArray = []
      
      this._myService.getdataAccotoCity(name).subscribe(val => {
        this.cityData = val;
        for (let p = 0; p < this.cityData.list.length; p++) {
          this.cityArray.push(
            {
              name: this.cityData.list[p].name,
              country: this.cityData.list[p].sys.country,
              lat: this.cityData.list[p].coord.lat,

              lon: this.cityData.list[p].coord.lon
            });
        }
        console.log("city Array", this.cityArray)

        console.log("cityData", this.cityData)


      })

    }
    

  }
  selectedCityCountryIndex: any


  
  fetchData(lat: number, lon: number, i: number) {
    this.lat = lat
    this.lon = lon
    this.selectedCityCountryIndex = i
    this.getWeatherDetails()
    this.weatherIcon = `http://openweathermap.org/img/wn/${this.cityData.list[this.selectedCityCountryIndex].weather[0].icon}@2x.png`
    this.cityArray = []
  }



  weatherAllData: any
  flag = 1;
  getWeatherDetails() {
    // console.log("weather")
    
    this._myService.getAllWeatherData(this.lat, this.lon,this.unit).subscribe(data => {
      this.weatherAllData = data
      console.log(this.weatherAllData)
      //for my date and time in other countries 
      this.offset = this.weatherAllData.timezone_offset



      this.getData()
      this.getLabelData()
      this.dailyTempArrayMethod()
      this.getNextDaysMethod()
      if (this.flag) {
        this.DisplayChart()
        this.flag = 0;
      }
      else {
        this.myChart.destroy();
        this.DisplayChart()
      }

    })
  }

  DisplayChart() {
    this.myChart = new Chart("ChartData", {
      type: 'line',
      data: {
        labels: this.GraphLabel,
        datasets: [{
          label: 'HOURLY DATA',
          data: this.GraphData,
          borderColor: 'red',
          borderWidth: 1,
          // position: "top"
        }]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },

        responsive: false,
        maintainAspectRatio: false
      }
    });

  }
  dailyTempArray: any[] = []
  userCityName: any
  userCountryName: any
  temprature: any
  feelsLike: any
  descriptions: any
  windSpeed: any
  pressure: any
  humidity: any
  uvi: any
  dewPoint: any
  visibility: any
  timezone: any
  getData() {
    this.userCityName = this.cityData.list[this.selectedCityCountryIndex].name
    this.userCountryName = this.cityData.list[this.selectedCityCountryIndex].sys.country
    this.temprature = this.weatherAllData.current.temp
    this.temprature = Math.round(this.temprature)
    this.dewPoint = this.weatherAllData.current.dew_point
    this.windSpeed = this.weatherAllData.current.wind_speed
    this.pressure = this.weatherAllData.current.pressure
    this.humidity = this.weatherAllData.current.humidity
    this.uvi = this.weatherAllData.current.uvi

    this.dewPoint = Math.round(this.dewPoint)
    //  this.windSpeed = Math.round(this.windSpeed)
    this.pressure = Math.round(this.pressure)
    this.humidity = Math.round(this.humidity)
    this.uvi = Math.round(this.uvi)


    this.timezone = this.weatherAllData.timezone

    // this.todaysDate.toLocaleString('en-US', { timeZone: "Europe/London" });
    // console.log(this.todaysDate)
    this.todaysDate = new Date().toLocaleString("en-US", { timeZone: this.timezone })
    console.log(this.todaysDate)



    this.visibility = this.weatherAllData.current.visibility
    this.visibility = this.visibility / 1000
    this.visibility = this.visibility.toFixed(1)


  }

  GraphLabel: any[] = [];
  GraphData: any[] = [];
  getLabelData() {
    this.GraphData = [];
    this.GraphLabel = [];
    for (var i = 0; i < this.weatherAllData.hourly.length; i++) {
      this.GraphLabel.push([this.weatherAllData.hourly[i].weather[0].description, this.weatherAllData.hourly[i].wind_speed]);
      this.GraphData.push(this.weatherAllData.hourly[i].temp);
    }
    // console.log("dfdfgfgf")
    // console.log(this.GraphData)
    // console.log(this.GraphLabel)
  }
  dailyMaxTempArray: any[] = []
  dailyMinTempArray: any[] = []
  dailyDescArray: any[] = []
  dailyIconArray: any[] = []
  dailyTempArrayMethod() {
    this.dailyMaxTempArray = []
    this.dailyMinTempArray = []
    // console.log("length",this.weatherAllData.daily.length)
    for (let i = 0; i < this.weatherAllData.daily.length; i++) {
      this.dailyMaxTempArray.push(Math.round(this.weatherAllData.daily[i].temp.max))
      this.dailyMinTempArray.push(Math.round(this.weatherAllData.daily[i].temp.min))

    }
    console.log(this.dailyMaxTempArray)
    console.log(this.dailyMinTempArray)

  }

  max: any
  min: any
  desc: any
  dIcon: any
  temp: Date[] = [];
  getNextDaysMethod() {
    this.temp = []
    // this.nextDaysArray=[]
    // for (var i = 0; i < this.weatherAllData.daily.length; i++) {
    //   var temp=new Date(this.weatherAllData.daily[i].dt*1000)

    //   this.nextDaysArray.push(temp)
    // }
    // console.log(this.nextDaysArray)

    console.log(this.weatherAllData.daily)

    this.weatherAllData.daily.map((info: any) => {


      this.temp.push(new Date(info.dt * 1000))
      this.max = Math.round(info.temp.max)
      this.min = Math.round(info.temp.min)
      // this.max=Math.round(this.dailyMaxTempArray)
      this.dailyDescArray.push(info.weather[0].description)

      this.dailyIconArray.push(info.weather[0].icon)
      // this.dIcon = `http://openweathermap.org/img/w/${this.dIcon}.png`

    })

    console.log("fgfgf", this.temp)
  }

  tog = 0
  clickedIndex: any
  morn: any
  night: any
  eve: any
  after: any

  Fmorn: any
  Fnight: any
  Feve: any
  Fafter: any
  sunrise: any
  sunset: any
  thirdVar = 0

  FwindSpeed: any
  Fpressure: any
  Fhumidity: any
  Fuv: any
  FdewPoint: any

  isSelected: any;
  togMethod(i: any) {
    if (this.tog === 0 && this.thirdVar == 0) {
      this.tog = 1
    }
    else if (this.tog === 1 && this.thirdVar == 0) {
      this.tog = 0
    }
    this.isSelected = i
    this.clickedIndex = i
    console.log(this.clickedIndex)
    this.morn = this.weatherAllData.daily[this.clickedIndex].temp.morn
    this.morn = Math.round(this.morn)
    this.night = this.weatherAllData.daily[this.clickedIndex].temp.night
    this.night = Math.round(this.night)
    this.eve = this.weatherAllData.daily[this.clickedIndex].temp.eve
    this.eve = Math.round(this.eve)
    this.after = this.weatherAllData.daily[this.clickedIndex].temp.day
    this.after = Math.round(this.after)

    this.sunrise = this.weatherAllData.daily[this.clickedIndex].sunrise
    this.sunrise = new Date(this.sunrise * 1000);
    this.sunset = this.weatherAllData.daily[this.clickedIndex].sunset
    this.sunset = new Date(this.sunset * 1000);
    this.thirdVar = 0

    this.FwindSpeed = this.weatherAllData.daily[i].wind_speed
    this.FwindSpeed = Math.round(this.windSpeed)
    this.Fpressure = Math.round(this.weatherAllData.daily[i].pressure)
    this.Fuv = Math.round(this.weatherAllData.daily[i].uvi)
    this.Fhumidity = Math.round(this.weatherAllData.daily[i].humidity)
    this.FdewPoint = Math.round(this.weatherAllData.daily[i].dew_point)


    this.Fmorn = Math.round(this.weatherAllData.daily[i].feels_like.morn)
    this.Fafter = Math.round(this.weatherAllData.daily[i].feels_like.day)
    this.Feve = Math.round(this.weatherAllData.daily[i].feels_like.eve)
    this.Fnight = Math.round(this.weatherAllData.daily[i].feels_like.night)



  }


  oneDay(val: any) {
    this.isSelected = val
    this.thirdVar = 1
    this.clickedIndex = val
    this.togMethod(val)
  }

}
