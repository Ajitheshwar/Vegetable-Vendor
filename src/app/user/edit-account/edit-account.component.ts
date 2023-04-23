import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { UserDetails } from 'src/models/user';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit{

  constructor(private data : DataService){}

  ngOnInit(): void {
    this.data.userDetailsObservable.subscribe((userObj)=>{
      
      this.userDetails = userObj
      // console.log(this.userDetails)
    })
  }

  // @ViewChild('profilePicInput') profilePicInput : any
  @ViewChild('previewImageContainer') previewImageContainer : any
  @ViewChild('clock') clock : any

  file : File | null = null
  userDetails : UserDetails= {
    _id : '',
    first_name : '',
    last_name : '',
    contact_number : '',
    email_address : '',
    image : ''
  }

  submitForm(ref : NgForm){
    this.data.updateUserDetailsInDB(this.userDetails)
  }

  previewImageUser(event : Event){
    let fileInput = (event.target as HTMLInputElement)
    if(fileInput.files && fileInput.files.length>0){
      let src = URL.createObjectURL(fileInput.files[0])
      this.previewImageContainer.nativeElement.src = src
      this.previewImageContainer.nativeElement.className = 'profile-image'
    }
  }

  uploadImage(event :Event){
    // let files = this.profilePicInput.nativeElement.files
    // console.log(event.target as HTMLFormElement) 
    this.clock.nativeElement.style.display = 'flex'
    if(event.target){
      let formData = new FormData(event.target as HTMLFormElement)
      this.data.uploadProfileImage(formData).subscribe({
        next : (result)=>{
          console.log(this.clock.nativeElement.style.display)
          this.clock.nativeElement.style.display = "none"
          console.log(result)
        },
        error : (error)=>[
          console.log(error)
        ]
      })
    }
  }
}
