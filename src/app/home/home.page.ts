import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { Message } from '../models/message.model';
import { OpenaiService } from '../services/openai.service';
import { CustomValidators } from '../utils/custom-validators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonContent, {static: false}) content!: IonContent;

  messages: Message[] = [];

  form = new FormGroup({
    promt: new FormControl('', [Validators.required, CustomValidators.noWhiteSpace])
  })

  loading: boolean = false;

  constructor(
    private openAi: OpenaiService
  ) {}

  submit() {
    if(this.form.valid) {



    let promt = this.form.value.promt as string;

   // === Mensaje del Usuario ===
    let userMsg : Message = {sender: 'me', content: promt}
    this.messages.push(userMsg);

    // === Mensaje del Bot ===
    let botMsg : Message = {sender: 'bot', content: ''}
    this.messages.push(botMsg);

    this.scrollToBottom();
    this.form.reset();
    this.form.disable();

    this.loading = true;


    this.openAi.sendQuestion(promt).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.typeText(res.bot)
        this.form.enable();
      }, error: (error: any) => {
          console.log(error);
      }
    })
  }

    /* setTimeout(() => {
      this.loading = false;
      this.typeText('Estoy bien, y tu?')
      this.form.enable();
    }, 2000); */

  }

  typeText(text: string) {
    let textIndex = 0;
    let messagesLastIndex = this.messages.length - 1;

    let interval = setInterval(() => {
      if(textIndex < text.length) {
        this.messages[messagesLastIndex].content += text.charAt(textIndex);
        textIndex++
      }else {
        clearInterval(interval);
        this.scrollToBottom();
      }
    }, 15)
  }

  scrollToBottom() {
    this.content.scrollToBottom(2000)
  }
}
