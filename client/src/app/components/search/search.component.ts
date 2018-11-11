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
    console.log("searching for " + this.searchCategory + "s... '" + this.searchString + "'...");
    //call search function in spotifyService and parse response
    this.spotifyService.searchFor(this.searchCategory, this.searchString)
      .then(resourceData => {
        this.resources = resourceData;
        console.log(this.resources);
      })
      .catch(error => { console.log(error); })
  }

  changeSearchString(string) {
    this.searchString = string;
    console.log(this.searchString);
  }

  changeCategory(category) {
    this.searchCategory = category;
    console.log(this.searchCategory);
  }

  showCarouselResults():boolean {
    return (this.searchCategory === 'artist' || this.searchCategory === 'album');
  }

  showTrackListResults():boolean {
    return (this.searchCategory == 'track');
  }

}
