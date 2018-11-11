import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { ResourceData } from '../../data/resource-data';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [ SpotifyService ]
})
export class SearchComponent implements OnInit {
  searchString:string;
  searchCategory:string = 'artist';
  searchCategories:string[] = ['artist', 'album', 'track'];
  resources:ResourceData[];

  constructor(private spotifyService:SpotifyService) { }

  clearResults() { this.resources = null; }

  ngOnInit() {
  }

  search() {
    //call search function in spotifyService and parse response
    this.spotifyService.searchFor(this.searchCategory, this.searchString)
      .then(resourceData => {
        this.resources = resourceData;
        console.debug(this.resources);
      })
      .catch(error => console.error('error performing spotify search: ' + error))
  }

  changeSearchString(string) {
    this.searchString = string;
    console.debug(this.searchString);
  }

  changeCategory(category) {
    this.searchCategory = category;
    console.debug(this.searchCategory);
  }

}
