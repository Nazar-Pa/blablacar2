import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from '../database.service';
import * as moment from 'moment';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-publish-ride',
  templateUrl: './publish-ride.component.html',
  styleUrls: ['./publish-ride.component.css']
})
export class PublishRideComponent implements OnInit {

  selected: Date = new Date();
  cityFrom: String = 'Bakı';
  cityTo: String = 'Quba';
  cities: String[] = ['one', 'two', 'three', 'four', 'five', 'six', 'seven','eight', 'nine', 'ten', 'eleven', 'twelve'];
  numbOfSeats: number = 1;
  time: string = "08:45";
  uid!: string | any;

  publishRideForm = new FormGroup({
    cityFrom: new FormControl('', Validators.required),
    cityTo: new FormControl('', Validators.required),
    selected: new FormControl(new Date(), Validators.required),
    time: new FormControl('', Validators.required),
    numbOfSeat: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    car: new FormControl('', Validators.required)
  })

  constructor(private databaseService: DatabaseService,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => this.uid = user?.uid)
  }


  submit() {

    const [hours, minutes] = this.time.split(':');
    const [month, day, year] = this.publishRideForm.value.selected.toLocaleDateString().split('/');

    const date = new Date(+year, +month-1, +day, +hours, +minutes, +0);

    const newRoute = {
      from: this.publishRideForm.value.cityFrom,
      to: this.publishRideForm.value.cityTo,
      date: moment(date).format('YYYY-MM-DD hh:mm'),
      numbOfPass: this.publishRideForm.value.numbOfSeat,
      u_id: this.uid
    }
    
    this.databaseService.createRoute(newRoute).subscribe();

    this.publishRideForm.value.numbOfSeat = this.numbOfSeats;
    if (!this.publishRideForm.valid) return;
  }

  handleClick(sign: string) {
    if(this.numbOfSeats >= 2 && sign == "subtract"){
      this.numbOfSeats = this.numbOfSeats - 1;
    } else if(sign == "add") {
      this.numbOfSeats = this.numbOfSeats + 1;
    }
  }

  // get cityFrom() {
  //   return this.publishRideForm.get('cityFrom');
  // }

  // get cityTo() {
  //   return this.publishRideForm.get('cityTo');
  // }

  // get date() {
  //   return this.publishRideForm.get('date');
  // }

  // get time() {
  //   return this.publishRideForm.get('time');
  // }

  // get car() {
  //   return this.publishRideForm.get('car');
  // }
}
