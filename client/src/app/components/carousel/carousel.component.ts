import { Component, OnInit, Input } from '@angular/core';
import { ResourceData } from '../../data/resource-data';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @Input() carouselId:string;
  //alias child (card) component property name resources as 'results'
  @Input() resources:ResourceData[];

  constructor() { }

  ngOnInit() {
  }

}
