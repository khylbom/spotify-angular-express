import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-thermometer',
  templateUrl: './thermometer.component.html',
  styleUrls: ['./thermometer.component.css']
})
export class ThermometerComponent implements OnInit {
  //define Input fields and bind them to the template.
  @Input() feature:string;
  @Input() color:string;
  @Input() percent:string;
  value:string;

  constructor(private domSanitizer:DomSanitizer) { }

  ngOnInit() {
    this.value = this.percent.substr(0, this.percent.length - 1);
    console.log(this.value);
  }

  get style() {
    return this.domSanitizer.bypassSecurityTrustHtml("width: " + this.color + "; width: " + this.percent);
    // return "background-color: " + this.color + "; width: " + this.percent;
  }

}
