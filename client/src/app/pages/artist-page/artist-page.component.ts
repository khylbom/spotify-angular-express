import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistData } from '../../data/artist-data';
import { TrackData } from '../../data/track-data';
import { AlbumData } from '../../data/album-data';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-artist-page',
  templateUrl: './artist-page.component.html',
  styleUrls: ['./artist-page.component.css'],
  providers: [ SpotifyService ]
})
export class ArtistPageComponent implements OnInit {
	artistId:string;
	artist:ArtistData;
	relatedArtists:ArtistData[];
	topTracks:TrackData[];
	albums:AlbumData[];

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit() {
  	this.artistId = this.route.snapshot.paramMap.get('id');
    //inject the spotifyService and use it to get the artist data, related artists, top tracks for the artist, and the artist's albums
    this.spotifyService.getArtist(this.artistId)
      .then(artistData => this.artist = artistData)
      .catch(error => console.log('error getting artist for artist-page: ' + error));
    
    this.spotifyService.getRelatedArtists(this.artistId)
      .then(artistData => this.relatedArtists = artistData)
      .catch(error => console.log('error getting related artists for artist-page: ' + error));
    
    this.spotifyService.getTopTracksForArtist(this.artistId)
      .then(trackData => this.topTracks = trackData)
      .catch(error => console.log('error getting top tracks for artist-page: ' + error));
    
    this.spotifyService.getAlbumsForArtist(this.artistId)
      .then(albumData => this.albums = albumData)
      .catch(error => console.log('error getting albums for artist-page: ' + error));
  }

}