import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistData } from '../../data/artist-data';
import { TrackData } from '../../data/track-data';
import { AlbumData } from '../../data/album-data';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css'],
  providers: [ SpotifyService ]
})
export class AlbumPageComponent implements OnInit {
	albumId:string;
	album:AlbumData;
	tracks:TrackData[];

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit() {
  	this.albumId = this.route.snapshot.paramMap.get('id');
    //inject spotifyService and use it to get the album data and the tracks for the album
    this.spotifyService.getAlbum(this.albumId)
      .then(albumData => this.album = albumData)
      .catch(error => console.log('error getting album: ' + error));

    this.spotifyService.getTracksForAlbum(this.albumId)
      .then(trackData => this.tracks = trackData)
      .catch(error => console.log('error getting tracks for album: ' + error));
  }

}
