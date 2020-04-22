import { Component, OnInit , ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from '../services/feedback.service';
import { Feedback, ContactType } from '../shared/feedback';
import {visibility , expand} from '../animations/app.animation';
import { flyInOut } from '../animations/app.animation';
import {Params, ActivatedRoute} from '@angular/router';

import { from } from 'rxjs';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style': 'display:block;'
  },
  animations:[
    flyInOut(),
    visibility(),
    expand()
  ]
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  visibility="hidden";
  errMess: string;
  test:boolean;
  feedbackcopy: Feedback;
  sv:boolean=false;
  @ViewChild('fform') feedbackFormDirective;

  formErrors ={
    'firstname':'',
    'lastname':'',
    'telnum':'',
    'email':''
  };

  validationMassages ={
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  constructor(private fb: FormBuilder,
              private fbs: FeedbackService, 
              private route:ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    // this.feed.getFeedbacks().subscribe(
    //   (feedbacks) => this.feedbackPost = this.feedbackPost,
    //   errmess => this.errMess = <any> errmess 
    // );
     
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required,Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any){
    if(!this.feedbackForm){ return; }
    const form = this.feedbackForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        //clear previous error message
        this.formErrors[field] ='';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const message = this.validationMassages[field];
          for(const key in control.errors){
            if (control.errors.hasOwnProperty(key)){
              this.formErrors[field] += message[key] + '';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.fbs.submitFeedback(this.feedback)
    .subscribe(feedback=>{ this.feedbackcopy = feedback;this.visibility = 'shown';this.test = false;},errmess =>this.formErrors =<any>errmess);this.feedbackcopy = null;
    { setTimeout(() => 
      {
        this.feedback = this.feedback; this.sv = false; 
        setTimeout(() => this.feedback = null, 5000);
      }
      , 6000);
    };
 this.feedbackForm.reset({
      firstname:'',
      lastname:'',
      telnum:'',
      email:'',
      agree:false,
      contacttype: 'None',
      message:''
    });
    //  this.feedbackFormDirective.resetForm();
  }

}
