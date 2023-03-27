import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import Cities from 'src/shared/Cities';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  routesList!: any;
  subscription!: Subscription;
  searchField!: any;
  numbOfPassengers: number = 1; 
  isDropDownShowing: boolean = false;
  selected: Date = new Date();
  cityFrom!: string;
  cityTo!: string;
  cities: string[] = [];


  constructor(private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.cities = Cities;
    this.subscription = this.databaseService.currentRoutes.subscribe(result => this.routesList = result);
    this.subscription = this.databaseService.currentSearchParams.subscribe(result => 
      {this.searchField = result
      this.cityFrom = this.searchField ? this.searchField.cityFrom : 'Bakı';
      this.cityTo = this.searchField ? this.searchField.cityTo : 'Quba';
      this.selected = this.searchField ? this.searchField.selected : new Date();
      this.numbOfPassengers = this.searchField ? this.searchField.numberOfPass : 1;
    });
  }

  searchForm = new FormGroup({
    cityFrom: new FormControl(this.searchField?.cityFrom, Validators.required),
    cityTo: new FormControl(this.searchField?.cityTo, Validators.required),
    selected: new FormControl(this.searchField?.date, Validators.required),
    numberOfPass: new FormControl(this.searchField?.numberOfPass)
  })

  onSubmit() {
    this.searchForm.value.numberOfPass = this.numbOfPassengers;

    if (!this.searchForm.valid) return;

    const [month, day, year] = this.searchForm.value.selected.toLocaleDateString().split('/');

    const date1 = new Date(+year, +month-1, +day, 0, 0, 0);
    const date2 = new Date(+year, +month-1, +day, 23, 59, 0);

    console.log(date1, date2)

    const filterField = {
      from: this.searchForm.value.cityFrom,  
      to: this.searchForm.value.cityTo,
      date1: moment(date1).format('YYYY-MM-DD HH:mm:ss'),  
      date2: moment(date2).format('YYYY-MM-DD HH:mm:ss'),
      numbOfPass: this.searchForm.value.numberOfPass
    }

    this.databaseService.getFilteredRoutes(filterField).subscribe(routes => {
      this.routesList = routes
      console.log(routes)
    })
  }

  handleClick(sign: string) {
    if(this.numbOfPassengers >= 2 && sign == "subtract"){
      this.numbOfPassengers = this.numbOfPassengers - 1;
    } else if(sign == "add") {
      this.numbOfPassengers = this.numbOfPassengers + 1;
    }
  } 

  showDropCalendar() {
    this.isDropDownShowing = !this.isDropDownShowing;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
