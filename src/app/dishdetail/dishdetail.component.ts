import { Component, OnInit ,Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {formatDate} from '@angular/common';
import { visibility,flyInOut,expand } from '../animations/app.animation';
import { from } from 'rxjs';

// const comments:any[] = [];


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()

  ] 
})
export class DishdetailComponent implements OnInit {

  @ViewChild('fform') feedbackFormDirective;


  formErrors ={
    'author':'',
    'comment':''
  };

  validationMassages ={
    'author': {
      'required':      'Author  Name is required.',
      'minlength':     'Author  Name must be at least 3 characters long.',
      'maxlength':     'Author Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'comment is required.',
      'minlength':     'comment must be at least 4 characters long.',
      'maxlength':     'comment cannot be more than 55 characters long.'
    },
  };

    dish: Dish;
    dishIds:string[];
    prev:string;
    errMess: string;
    next:string;
    feedbackForm: FormGroup;
    comments:any=[];
    dishcopy: Dish;
    visibility = 'shown';
    

    constructor(private dishservice: DishService,
      private route: ActivatedRoute,
      private location: Location,
      private fb: FormBuilder,
      @Inject('BaseURL') public BaseURL) {
        this.opinionForm();
       }
  
    ngOnInit() {
      this.dishservice.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(params['id']);}))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any> errmess);
    }

    
    setPrevNext(dishId: string){
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];

    }
  
    goBack(): void {
      this.location.back();
    }

    opinionForm(){
      this.feedbackForm = this.fb.group({
        author:['',[Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
        rating:[5, Validators.required],
        comment:['',[Validators.required, Validators.minLength(4), Validators.maxLength(55)]],
        date:formatDate(new Date(), 'mediumDate', 'en')
  
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
          if(control && control.dirty && !control.valid && control.touched){
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
  
    onSubmit(){
      this.comments = this.feedbackForm.value;
      console.log(this.comments);
      this.dishcopy.comments.push( this.comments );
      this.dishservice.putDish(this.dishcopy).subscribe( dish => {
        this.dish = dish ; this.dishcopy = dish;
      },
      errmess => {this.dish = null; this.dishcopy = null; this.errMess = <any> errmess; });
      // console.log(comments);
  
      this.feedbackForm.reset({
        author:'',
        rating:5,
        comment:'',
        date:formatDate(new Date(), 'mediumDate', 'en')
      });
    }
    formatLabel(rating: number) {
      if (rating >= 6) {
        return Math.round(rating / 1);
      }
  
      return rating;
    }


  
}
