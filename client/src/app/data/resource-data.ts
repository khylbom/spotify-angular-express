export abstract class ResourceData {
	category:string = "unknown";
	name:string;
	imageURL:string;
	id:string;
	url:string;

	constructor(objectModel:{}) {
		this.name = objectModel['name'];
		this.id = objectModel['id'];
		if(objectModel['images'] && objectModel['images'].length > 0) {
			this.imageURL = objectModel['images'][0].url;
		} else if(objectModel['album'] && objectModel['album']['images'] && objectModel['album']['images'].length > 0) {
			this.imageURL = objectModel['album']['images'][0].url;
		} else {
			this.imageURL = '../../assets/unknown.jpg';
		}

		//modified this function slightly because it was angry the way it was
		// if('spotify' in objectModel['external_urls']) {
		if(objectModel['external_urls'] && objectModel['external_urls']['spotify']) {
			this.url = objectModel['external_urls']['spotify'];
		}
	}
}
