import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { Message } from 'src/models/user';

@Component({
  selector: 'app-send-feedback',
  templateUrl: './send-feedback.component.html',
  styleUrls: ['./send-feedback.component.css']
})
export class SendFeedbackComponent implements OnInit{
  constructor(private data : DataService){}

  ngOnInit(): void {
    let email = sessionStorage.getItem("email")
    email = email===null ? '' : email
    this.data.getChatMessages(email).subscribe({
      next : (result)=>{
        this.messages = result.messages
      }
    })
  }

  messages : Message[] = []

  sendMessage(ref:NgForm){
    let email = sessionStorage.getItem("email")
    let data = {
      sender : 'user',
      message : ref.value.message,
      user : email===null ? '' : email,
      time  :new Date()
    }
    this.messages.push(data)
    this.data.sendChatMessage(data).subscribe({
      next : (result)=>{
        ref.reset()
        console.log(result)
      },
      error : console.log
    })
    
  }
}
