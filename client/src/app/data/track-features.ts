import * as chroma from 'chroma-js';

export class TrackFeatures {
	static FeatureTypes = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence'];
	//palette developed with Chroma.js Color Scale Helper (https://gka.github.io/palettes/#diverging)
	//	 left: red, orangered, deeppink, orange, yellow
	//	right: yellow, lightgreen, yellowgreen, greenyellow, forestgreen
	//the result is a divergent bezian gradient that phases from red -> pink -> orange -> yellow -> light green -> darkgreen
	static ColorPalette:string[] = ['#ff0000','#ff6c6c','#ffa446','#ffd421','#ffff00','#aee763','#79cb2b','#4fab27','#228b22'];
	static BezierInterpolator:any = undefined;
	static bezInited:boolean = false;

	id:string;
	featureToPercent:{} = {};

	constructor(objectModel:{}) {
		this.id = objectModel['id'];
		TrackFeatures.FeatureTypes.forEach((key) => {
			this.featureToPercent[key] = objectModel[key];
		});

		if (!TrackFeatures.bezInited) {
			TrackFeatures.BezierInterpolator = chroma.bezier(chroma.scale(TrackFeatures.ColorPalette).colors(5));
			TrackFeatures.bezInited = true;
		}
	}

	color(featureKey:string):string {
		try {
			return TrackFeatures.BezierInterpolator(this.featureToPercent[featureKey]).hex();
		} catch (error) {
			console.log('error getting color from bezian interpolation: ' + error);
		}
		return '#ffffff';
	}

	percent(feature:string):string {
		return (this.featureToPercent[feature]*100).toFixed() + '%';
	}
}
