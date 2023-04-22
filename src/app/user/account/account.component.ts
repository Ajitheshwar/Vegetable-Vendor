import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { UserDetails } from 'src/models/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, AfterViewInit{

  constructor(private data : DataService){}

  @ViewChild('profileImage') profileImage : any

  ngOnInit() : void{
    this.data.getUserDetails()
    
  }

  ngAfterViewInit(): void {
    
    this.data.userDetailsObservable.subscribe((userObj)=>{
      this.userObj = userObj
      if(Object.keys(userObj).length > 0){
        this.profileImage.nativeElement.style.backgroundImage = `url("${this.userObj.image}")`
        this.name = this.userObj.first_name[0].toUpperCase() + this.userObj.first_name.substring(1) + " " + this.userObj.last_name[0].toUpperCase() + this.userObj.last_name.substring(1)
      }
    })
    
  }
  userObj : UserDetails = {
    _id : '',
    first_name : '',
    last_name : '',
    image : '',
    contact_number : '',
    email_address : '',
  }
  name : string = ''
}
