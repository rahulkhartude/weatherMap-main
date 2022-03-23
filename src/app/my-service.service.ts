import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  private apiKey = "439d4b804bc8187953eb36d2a8c26a02"
  
  private city = "https://openweathermap.org/data/2.5/find?"
  private allWeatherData ="https://openweathermap.org/data/2.5/onecall?"
  // private cityRemPart="q=&appid=439d4b804bc8187953eb36d2a8c26a02&units=metric"
  //private allweatherRem ="lat=18.5196&lon=73.8553&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02"
  private f="https://openweathermap.org/data/2.5/onecall?lat=45.9165&lon=14.8695&units=imperial&appid=439d4b804bc8187953eb36d2a8c26a02"
  private c="https://openweathermap.org/data/2.5/onecall?lat=45.9165&lon=14.8695&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02"  
  constructor(private http: HttpClient) { }

  getdataAccotoCity(city: any) {
  return  this.http.get(`${this.city}q=${city}&appid=${this.apiKey}&units=metric`)

  }
getAllWeatherData(lat:any,lon: any,unit:any) {
  return this.http.get(`${this.allWeatherData}lat=${lat}&lon=${lon}&units=${unit}&appid=${this.apiKey}`)
}

// getAllWeatherDataImperial(lat:any,lon: any,) {
//   return this.http.get(`${this.allWeatherData}lat=${lat}&lon=${lon}&units=imperial&appid=${this.apiKey}`)
// }

}
