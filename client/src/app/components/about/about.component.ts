import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { ProfileData } from 'src/app/data/profile-data';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [SpotifyService]
})
export class AboutComponent implements OnInit {
  name:string = null;
  profile_pic:string = "../../../assets/unknown.jpg";
  profile_link:string = null;

  //TODO: inject the Spotify service
  constructor(private spotify: SpotifyService) { }

  ngOnInit() {
    this.name = '???';
    this.profile_link = '_blank'; 
  }

  loadAboutMe() {
    console.log('hello from about.component.loadAboutMe()\n');
    this.spotify.aboutMe()
      .then(profile_data => {
        this.name = profile_data.name;
        this.profile_pic = profile_data.imageURL;
        this.profile_link = profile_data.spotifyProfile;
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  /*TODO: create a function which gets the "about me" information from Spotify when the button in the view is clicked.
  In that function, update the name, profile_pic, and profile_link fields */

}
