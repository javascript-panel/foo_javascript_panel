'use strict';
include('list_base');

class ListenBrainz extends ListBase {
	constructor (x, y, w, h) {
		utils.CreateFolder(Paths.artists);
		super(x, y, w, h);

		this.artist = '';
		this.mb_id = '';
		this.filename = '';
		this.filenames = new Map();
		this.ini_file = Paths.data + 'listenbrainz.ini';
		this.token = utils.ReadINI(this.ini_file, 'ListenBrainz', 'Token');
	}

	font_changed () {
		this.size();
		this.reset();
	}

	get () {
		if (!IsUUID(this.token) || !IsUUID(this.mb_id))
			return;

		const headers = JSON.stringify({
			'Authorization' : 'Token ' + this.token,
			'Content-Type' : 'application/json'
		});

		const data = JSON.stringify([{
			'artist_mbids': [this.mb_id],
			'algorithm': 'session_based_days_1800_session_300_contribution_3_threshold_10_limit_100_filter_True_skip_30'
		}]);

		const task_id = utils.HTTPRequestAsync(POST, 'https://labs.api.listenbrainz.org/similar-artists/json', headers, data);
		this.filenames.set(task_id, this.filename);
	}

	header_text () {
		return this.artist + ': similar artists';
	}

	http_request_done (task_id, success, response_text) {
		const f = this.filenames.get(task_id);

		if (!f)
			return;

		if (!success) {
			console.log(N, response_text);
			return;
		}

		Save(f, response_text);

		if (f == this.filename) {
			this.reset();
		}
	}

	lbtn_up (x, y) {
		if (!this.containsXY(x, y))
			return false;

		switch (true) {
		case this.up_btn.lbtn_up(x, y):
		case this.down_btn.lbtn_up(x, y):
		case !this.in_range:
			break;
		default:
			let item = this.data[this.index];

			if (x > this.x && x < this.x + Math.min(item.width, this.w) && typeof item.url == 'string') {
				utils.Run(item.url);
			}
			break;
		}

		return true;
	}

	move (x, y) {
		this.mx = x;
		this.my = y;
		window.SetCursor(IDC_ARROW);

		if (!this.containsXY(x, y))
			return false;

		this.index = Math.floor((y - this.y - Scale(12)) / panel.row_height) + this.offset;
		this.in_range = this.index >= this.offset && this.index < this.offset + Math.min(this.rows, this.count);
		switch (true) {
		case this.up_btn.move(x, y):
		case this.down_btn.move(x, y):
			break;
		case !this.in_range:
			break;
		default:
			let item = this.data[this.index];

			if (x > this.x && x < this.x + Math.min(item.width, this.w) && typeof item.url == 'string') {
				window.SetCursor(IDC_HAND);
				TT(item.url);
			} else {
				TT('');
			}
			break;
		}

		return true;
	}

	paint (gr) {
		if (!IsUUID(this.token)) {
			gr.WriteTextSimple('Use the right click menu to set your ListenBrainz token.', panel.fonts.normal, panel.colours.text, this.x, this.y + Scale(12), this.w, this.h);
			return;
		}

		if (this.count == 0)
			return;

		for (let i = 0; i < Math.min(this.count, this.rows); i++) {
			gr.WriteTextSimple(this.data[i + this.offset].name, panel.fonts.normal, panel.colours.text,
				this.x, this.y + Scale(12) + (i * panel.row_height), this.w, panel.row_height,
				DWRITE_TEXT_ALIGNMENT_LEADING, DWRITE_PARAGRAPH_ALIGNMENT_CENTER, DWRITE_WORD_WRAPPING_NO_WRAP, DWRITE_TRIMMING_GRANULARITY_CHARACTER
			);
		}

		this.up_btn.paint(gr, panel.colours.text);
		this.down_btn.paint(gr, panel.colours.text);
	}

	rbtn_up (x, y) {
		panel.m.AppendMenuItem(MF_STRING, 1100, 'ListenBrainz token');
		panel.m.AppendMenuSeparator();
		panel.m.AppendMenuItem(EnableMenuIf(utils.IsFile(this.filename)), 1999, 'Open containing folder');
		panel.m.AppendMenuSeparator();
	}

	rbtn_up_done (idx) {
		switch (idx) {
		case 1100:
			var token = utils.InputBox(window.Name, 'Enter your ListenBrainz token', this.token);

			if (token != this.token) {
				this.token = token;
				utils.WriteINI(this.ini_file, 'ListenBrainz', 'Token', this.token);
				this.reset();
			}
			break;
		case 1999:
			Explorer(this.filename);
			break;
		}
	}

	refresh () {
		if (panel.metadb) {
			const temp_artist = panel.tf(DEFAULT_ARTIST);
			const temp_id = panel.tf('$if3($meta(musicbrainz_artistid,0),$meta(musicbrainz artist id,0),)');

			if (this.artist == temp_artist && this.mb_id == temp_id)
				return;

			this.artist = temp_artist;
			this.mb_id = temp_id;
			this.update();
		} else {
			this.artist = '';
			this.mb_id = '';
			this.filename = '';
			this.data = [];
			this.count = 0;
			window.Repaint();
		}
	}

	reset () {
		this.count = 0;
		this.data = [];
		this.artist = '';
		this.refresh();
	}

	update () {
		this.data = [];
		this.filename = '';

		if (IsUUID(this.mb_id)) {
			this.filename = ArtistFolder(this.artist) + 'listenbrainz.similiar.' + this.mb_id + '.json';

			if (utils.IsFile(this.filename)) {
				this.data = JsonParseFile(this.filename).map(item => {
					return {
						name : item.name,
						width : item.name.calc_width(panel.fonts.normal),
						url : 'https://musicbrainz.org/artist/' + item.artist_mbid
					};
				});

				if (FileExpired(this.filename, ONE_DAY)) {
					this.get();
				}
			} else {
				this.get();
			}
		}

		this.count = this.data.length;
		this.offset = 0;
		this.index = 0;
		window.Repaint();
	}
}
