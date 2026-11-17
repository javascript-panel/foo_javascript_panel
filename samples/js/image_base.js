'use strict';
include('lastfm');

class ImageBase {
	constructor () {
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
		this.mx = 0;
		this.my = 0;
		this.artists = new Map();
		this.history = new Set();
		this.limits = [1, 3, 5, 10, 15, 20];
		this.exts = ['webp', 'jpg', 'jpeg', 'png', 'gif', 'heif', 'heic', 'avif', 'jxl'];
		this.folder = '';
		this.artist = '';
		this.image_index = 0;
		this.time = 0;
		this.counter = 0;
	}

	containsXY (x, y) {
		return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	}

	download () {
		if (!Tagged(this.artist))
			return;

		const url = 'https://www.last.fm/music/' + encodeURIComponent(this.artist) + '/+images';
		const task_id = utils.HTTPRequestAsync(GET, url, LastFm.headers);
		this.artists.set(task_id, this.artist);
	}

	http_request_done (task_id, success, response_text, status, response_headers) {
		const artist = this.artists.get(task_id);

		if (!artist)
			return; // we didn't request this id

		if (!success || status != 200) {
			console.log(N, "HTTP status:", status);
			console.log(response_text);
			return;
		}

		const filename_base = ArtistFolder(artist) + utils.ReplaceIllegalChars(artist) + '_';
		lastfm.download_images(response_text, filename_base, this.properties.limit.value);
	}

	playback_new_track () {
		this.counter = 0;
		this.refresh();
	}
}
