import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { DatabaseService } from '../database.service';
import { ActivatedRoute, Router } from '@angular/router';
import Cities from 'src/shared/Cities';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'blablacar';

  user$ = this.authService.currentUser$;
  selected: Date = new Date();
  cityFrom: string = 'Bakı';
  cityTo: string = 'Quba';
  searchForm: FormGroup;
  cities: string[] = [];
  searchTerm$: any = new Subject();
  numbOfPassengers: number = 1; 
  isDropDownShowing: boolean = false;
  routesList!: any;
  subscription!: Subscription;
  serahcField: any;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router){
    this.searchForm = this.createFormGroupWithBuilder(formBuilder);
  }

  ngOnInit(): void {
    this.cities = Cities;
    // this.searchTerm$.pipe().subscribe((v: string) => {
    //   this.filteredCities = this.cities.filter(row => {
    //   return row.includes(v);
    // })
    // })
    
    this.subscription = this.databaseService.currentRoutes.subscribe(result => this.routesList= result);
    this.subscription = this.databaseService.currentSearchParams.subscribe(result => this.serahcField= result);
  }

  onSubmit() {
    this.searchForm.value.numberOfPass = this.numbOfPassengers;

    if (!this.searchForm.valid) return;

    const [month, day, year] = this.searchForm.value.selected.toLocaleDateString().split('/');

    const date1 = new Date(+year, +month-1, +day, 0, 0, 0);
    const date2 = new Date(+year, +month-1, +day, 23, 59, 0);

    const filterField = {
      from: this.searchForm.value.cityFrom,  
      to: this.searchForm.value.cityTo,
      date1: moment(date1).format('YYYY-MM-DD HH:mm:ss'),  
      date2: moment(date2).format('YYYY-MM-DD HH:mm:ss'),
      numbOfPass: this.searchForm.value.numberOfPass
    }

    this.serahcField = {
      cityFrom: this.searchForm.value.cityFrom,
      cityTo: this.searchForm.value.cityTo,
      selected: this.searchForm.value.selected,
      numberOfPass: this.searchForm.value.numberOfPass
    }

    this.databaseService.getSearchFields(this.serahcField)

    this.databaseService.getFilteredRoutes(filterField).subscribe(routes => {
      this.databaseService.filteredRoutes(routes)
    })

       this.router.navigate(['/search'])

    // this.databaseService.filteredRoutes()
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

  // get cityFrom(){
  //   return this._cityFrom
  // }

  // set cityFrom(value: String){
  //   this._cityFrom = value;
  //   this.isDropDownShowing = true
  //   this.searchTerm$.next(value)
  //   this.filteredCities = this.cities;
  // }

  // get cityTo(){
  //   return this._cityTo
  // }

  // set cityTo(value: String){
  //   this._cityTo = value;
  //   this.isDropDownShowing = false
  //   this.searchTerm$.next(value)
  //   this.filteredCities = this.cities;
  // }

  

  // dropDownOpen(){
  //   this.isDropDownShowing = !this.isDropDownShowing
  //   this.filteredCities = this.cities
  // }

  createFormGroupWithBuilder(formBuilder: FormBuilder) {
    return formBuilder.group({
      cityFrom: new FormControl(''),
      cityTo: new FormControl(''),
      selected: new FormControl(''),
      numberOfPass: new FormControl('')
    });
  }
}
