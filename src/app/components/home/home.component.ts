import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  data: any;
  date: Date = new Date();
  today: string;
  time: number;
  form: FormGroup;
  show: boolean = false;
  datalist: any = [];
  locations: any = [];

  constructor(private apiService: ApiService,
              private formBuilder: FormBuilder) {
    this.data = {}
    this.buildForm();
  }

  ngOnInit(): void {
    this.getData();
    this.time = this.date.getHours();
    this.today = `${this.date.getDate()} - ${this.date.getMonth()+1} - ${this.date.getFullYear()}`;
  }

  async getData() {
    let ip: string;
    await this.apiService.getIP().then((resp: any) => {
      ip = resp.ip;
    })
    await this.apiService.getLocation(ip).then((resp: any) => {
      this.data = {
        locationName: `${resp.LocalizedName}, ${resp.AdministrativeArea.LocalizedName}, ${resp.Country.LocalizedName}`,
        key: resp.Key
      }
    })
    this.setData(this.data.key);
  }

  async setData(key) {
    await this.apiService.getCurrentConditions(key).then((resp: any) => {
      this.data.watherText = resp[0].WeatherText;
      this.data.icon = resp[0].WeatherIcon;
      this.data.temperature = `${resp[0].Temperature.Metric.Value} °${resp[0].Temperature.Metric.Unit}`,
      this.data.realFeelTemperature = `${resp[0].RealFeelTemperature.Metric.Value} °${resp[0].RealFeelTemperature.Metric.Unit}`,
      this.data.humidity = `${resp[0].RelativeHumidity}`,
      this.data.airPressure = `${resp[0].Pressure.Metric.Value} ${resp[0].Pressure.Metric.Unit}`
      this.data.visibility = `${resp[0].Visibility.Metric.Value} ${resp[0].Visibility.Metric.Unit}`,
      this.data.windSpeed = `${resp[0].Wind.Speed.Metric.Value} ${resp[0].Wind.Speed.Metric.Unit}`,
      this.data.uvIndex = `${resp[0].UVIndex}`
    })
    await this.apiService.getForecastFiveDays(key).then((resp: any) => {
      let infoFiveDays = [];
      resp.DailyForecasts.forEach(forecast => {
        infoFiveDays.push({
          date: new Date(forecast.Date).getDay(),
          maxTemperature: `${forecast.Temperature.Maximum.Value} °${forecast.Temperature.Maximum.Unit}`,
          minTemperature: `${forecast.Temperature.Minimum.Value} °${forecast.Temperature.Minimum.Unit}`,
          iconDay: forecast.Day.Icon,
          weatherPhraseDay: forecast.Day.LongPhrase,
          iconNight: forecast.Night.Icon,
          weatherPhraseNight: forecast.Night.LongPhrase,
          sun: {
            rise: new Date(forecast.Sun.Rise),
            set: new Date(forecast.Sun.Set)
          },
          moon: {
            rise: new Date(forecast.Moon.Rise),
            set: new Date(forecast.Moon.Set)
          }
        })
      });
      this.data.forecast = infoFiveDays;
    })
  }

  buildForm() {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required]]
    })
  }

  showSidepanel() {
    this.show = true;
  }
  closeSidepanel() {
    this.show = false;
  }

  async getLocations(event: Event) {
    event.preventDefault();
    await this.apiService.autocompleteSearch(this.form.value.search).then((resp:any) => {
      let datalist = [];
      resp.forEach(location => {
        datalist.push({
          locationName: location.LocalizedName,
          fullLocationName: `${location.LocalizedName}, ${location.AdministrativeArea.LocalizedName}, ${location.Country.LocalizedName}`,
          key: location.Key
        })
      });
      this.datalist = datalist;
    })
  }

  changeLocation(location) {
    this.data.locationName = location.fullLocationName;
    this.data.key = location.key
    this.setData(location.key);
    this.datalist = [];
    this.show = false;
    this.form.setValue({search: ''});
  }

}
