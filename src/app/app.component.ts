import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'blablacar';

  _cityFrom: String = 'Bakı';
  _cityTo: String = '';
  isDropDownShowing: boolean = false;
  isDropDownShowingTo: boolean = false;
  searchForm: FormGroup;
  cities: String[] = ['one', 'two', 'three', 'four', 'five', 'six', 'seven','eight', 'nine', 'ten', 'eleven', 'twelve'];
  filteredCities: String[] = [];
  searchTerm$: any = new Subject();
  url!: string;

  constructor(private formBuilder: FormBuilder, 
    public authService: AuthenticationService,
    private router: Router){
    this.searchForm = this.createFormGroupWithBuilder(formBuilder);
  }

  ngOnInit(): void {
    // this.searchTerm$.pipe().subscribe((v: string) => {
    //   this.filteredCities = this.cities.filter(row => {
    //   return row.includes(v);
    // })
    // })
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }

  onSubmit() {
    console.log(this.searchForm.value)
  }

  setUrl() {
    this.authService.getUrl("publish-ride")
  }

  dropDownOpen(){
    this.isDropDownShowing = !this.isDropDownShowing
    this.filteredCities = this.cities
  }

  createFormGroupWithBuilder(formBuilder: FormBuilder) {
    return formBuilder.group({
      cityFrom: new FormControl(''),
      cityTo: new FormControl(''),
      date: new FormControl(''),
      numberOfPass: new FormControl('')
    });
  }
}
