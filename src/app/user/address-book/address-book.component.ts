import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { Address } from 'src/models/user';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit{
  constructor(private data : DataService){}

  ngOnInit(): void {
    this.data.getAddresses().subscribe({
      next : (result)=>{
        this.addresses = result.message
        this.loadedAddresses = true
      }
    })
  }

  displayAddAddress : boolean = false
  loadedAddresses : boolean = false;
  addresses : Address[] = []
  other : string = 'Other'

  displayForm(){
    this.displayAddAddress = true
  }

  addAddress(ref : NgForm){
    let obj = ref.value
    if(obj.title==='Other'){
      obj.title = obj.other
    }
    delete obj.other
    this.data.addAddress(obj).subscribe({
      next : (result)=>{
        console.log(result.message)
        this.addresses.push(obj)
      },
      error : (error)=>{
        console.log(error)
      }
    })
  }

  deleteAddress(id : string,index : number){
    this.data.deleteAddress(id).subscribe({
      next : (result)=>{
        console.log(result)
        this.addresses.slice(index,1)
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }
}
