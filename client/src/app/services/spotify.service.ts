import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeatures } from '../data/track-features';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    console.log('hello from spotify.service.sendRequestToExpress()\n')
    console.log('SpotifyService sending request to express at ' + this.expressBaseUrl + endpoint);
    var result;
    //use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    return this.http.get(this.expressBaseUrl + endpoint)
      .toPromise()
      .then(res => { return res; })
      // .then(res => JSON.stringify(res))
      // .then(data => JSON.parse(data))
      // .then(result => {
      //   console.log(typeof(result) + ": " + result);
      //   console.log('display name: ' + result.display_name);
      //   return result;
      // })
      .catch(error => {
        console.log('from sendRequestToExpress(): ' + error);
        return error;
      })
  }

  aboutMe():Promise<ProfileData> {
    console.log('hello from spotify.service.aboutMe()\n');
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    return this.sendRequestToExpress('/search/' + category + '/' + encodeURIComponent(resource)).then((data) => {
      if(category == 'artist') {
        return data.artists.items.map((artist) => {
          return new ArtistData(artist);
        });
      }
      else if(category == 'track') {
        return data.tracks.items.map((track) => {
          return new TrackData(track);
        });
      }
      else if(category == 'album') {
        return data.albums.items.map((album) => {
          return new AlbumData(album);
        });
      }
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    return this.sendRequestToExpress('/artist/' + encodeURIComponent(artistId)).then((data) => {
      return new ArtistData(data);
    });
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
   return this.sendRequestToExpress('/artist-related-artists/' + encodeURIComponent(artistId)).then((data) => {
     return data.artists.map((artist) => {
        return new ArtistData(artist);
      });
   });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    return this.sendRequestToExpress('/artist-top-tracks/' + encodeURIComponent(artistId)).then((data) => {
      return data.tracks.map((track) => {
        return new TrackData(track);
      });
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    return this.sendRequestToExpress('/artist-albums/' + encodeURIComponent(artistId)).then((data) => {
      return data.items.map((album) => {
        return new AlbumData(album);
      });
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    return this.sendRequestToExpress('/album/' + encodeURIComponent(albumId)).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    return this.sendRequestToExpress('/album-tracks/' + encodeURIComponent(albumId)).then((data) => {
      return data.items.map((artist) => {
        return new TrackData(artist);
      });
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    return this.sendRequestToExpress('/track/' + encodeURIComponent(trackId)).then((data) => {
      return new TrackData(data);
    });
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeatures> {
    return this.sendRequestToExpress('/track-audio-features/' + encodeURIComponent(trackId)).then((data) => {
      return new TrackFeatures(data);
    });
  }
}
