import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { ArtistData } from '../../data/artist-data';
import { AlbumData } from '../../data/album-data';
import { TrackData } from '../../data/track-data';
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

  ngOnInit() {
    // this.searchCategory = "artist";
    // console.log('default selected: ' + this.searchString);
  }

  search() {
    console.log("searching for " + this.searchCategory + "s... '" + this.searchString + "'...");
    //TODO: call search function in spotifyService and parse response
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

  parseResults():any[] {
    var results:any[] = this.resources.map(result => {
      switch(result.category) {
        case "artist": { return new ArtistData(result); }
        case "album": { return new AlbumData(result); }
        case "track": { return new TrackData(result); }
        default: { console.log("resource category unknown: " + result.category); return []; }
      }
    });
    console.log(results);
    return results;
  }

}
