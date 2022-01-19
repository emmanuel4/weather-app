import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getIP() {
    return new Promise((resolve, reject) => {
      this.http.get(
        `https://api.ipify.org?format=json`,
      ).subscribe(response => {
        resolve(response);
      }, err => {
        console.error('reject get');
        console.error(err);
        reject(err.error);
      });
    });
  }

  getLocation(ip) {
    return new Promise((resolve, reject) => {
      this.http.get(
        `https://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=2SFLHg2EGtTVnYH55moe66GVN0S7rzMm&q=${ip}&language=es-mx&details=false`,
      ).subscribe(response => {
        resolve(response);
      }, err => {
        console.error('reject get');
        console.error(err);
        reject(err.error);
      });
    });
  }

  getCurrentConditions(key) {
    return new Promise((resolve, reject) => {
      this.http.get(
        `https://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=2SFLHg2EGtTVnYH55moe66GVN0S7rzMm&language=es-mx&details=true`,
      ).subscribe(response => {
        resolve(response);
      }, err => {
        console.warn('reject get');
        console.error(err);
        reject(err.error);
      });
    });
  }

  getForecastFiveDays(key) {
    return new Promise((resolve, reject) => {
      this.http.get(
        `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}?apikey=2SFLHg2EGtTVnYH55moe66GVN0S7rzMm&language=es-mx&details=true&metric=true`,
      ).subscribe(response => {
        resolve(response);
      }, err => {
        console.error('reject get');
        console.error(err);
        reject(err.error);
      });
    });
  }

  autocompleteSearch(text) {
    return new Promise((resolve, reject) => {
      this.http.get(
        `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=2SFLHg2EGtTVnYH55moe66GVN0S7rzMm&q=${text}&language=es-mx`,
      ).subscribe(response => {
        resolve(response);
      }, err => {
        console.error('reject get');
        console.error(err);
        reject(err.error);
      });
    });
  }
}
