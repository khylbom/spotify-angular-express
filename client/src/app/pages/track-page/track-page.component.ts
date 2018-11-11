import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrackData } from '../../data/track-data';
import { TrackFeatures } from '../../data/track-features';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-track-page',
  templateUrl: './track-page.component.html',
  styleUrls: ['./track-page.component.css'],
  providers: [ SpotifyService ]
})
export class TrackPageComponent implements OnInit {
	trackId:string;
	track:TrackData;
  audioFeatures:TrackFeatures;
  featureTypes:string[] = TrackFeatures.FeatureTypes;

  constructor(private route: ActivatedRoute, private spotifyService:SpotifyService) { }

  ngOnInit() {
  	this.trackId = this.route.snapshot.paramMap.get('id');
    //inject the spotifyService and use it to get the track data and it's audio features
    this.spotifyService.getTrack(this.trackId)
      .then(trackData => this.track = trackData)
      .catch(error => console.log('error getting track: ' + error));
    
    this.spotifyService.getAudioFeaturesForTrack(this.trackId)
      .then(trackFeatures => this.audioFeatures = trackFeatures)
      .catch(error => console.log('error getting track features: ' + error));
  }

}
