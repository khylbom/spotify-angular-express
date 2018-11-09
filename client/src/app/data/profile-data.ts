export class ProfileData {
	name:string;
	spotifyProfile:string;
	imageURL:string;

	constructor(objectModel:{}) {
		console.log('constructing ProfileData...')
		this.name = objectModel['display_name'];
		this.spotifyProfile = objectModel['external_urls']['spotify'];
		if(objectModel['images'].length > 0) {
			this.imageURL = objectModel['images'][0].url;
		} else {
			this.imageURL = '../../assets/unknown.jpg';
		}
		console.log('name: %s\nspotifyProfile: %s\nimageURL: %s', this.name, this.spotifyProfile, this.imageURL);
	}
}
