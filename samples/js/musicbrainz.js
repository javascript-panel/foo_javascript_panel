'use strict';
include('list_base')

_.mixin({
	nest : (collection, keys) => {
		if (!keys.length)
			return collection;

		return _(collection)
			.groupBy(keys[0])
			.mapValues(values => {
				return _.nest(values, keys.slice(1));
			})
			.value();
	}
});

class MusicBrainz extends ListBase {
	constructor (x, y, w, h) {
		super (x, y, w, h)

		this.clickable_text_x = 0;
		this.spacer_w = 0;
		this.artist = '';
		this.mb_id = '';
		this.filename = '';
		this.filenames = {};

		this.properties = {
			mode : new Property('2K3.MUSICBRAINZ.MODE', 0) // 0 releases 1 links
		};

		utils.CreateFolder(Paths.artists);
	}

	draw_row (gr, text, colour, x, y, w, h, text_alignment) {
		gr.WriteTextSimple(text, panel.fonts.normal, colour, x, y, w, h, text_alignment || DWRITE_TEXT_ALIGNMENT_LEADING, DWRITE_PARAGRAPH_ALIGNMENT_CENTER, DWRITE_WORD_WRAPPING_NO_WRAP, DWRITE_TRIMMING_GRANULARITY_CHARACTER);
	}

	get () {
		let url;

		if (this.properties.mode.value == 0) {
			url = 'https://musicbrainz.org/ws/2/release-group?fmt=json&limit=100&offset=' + this.mb_offset + '&artist=' + this.mb_id;
		} else {
			url = 'https://musicbrainz.org/ws/2/artist/' + this.mb_id + '?fmt=json&inc=url-rels';
		}

		const task_id = utils.HTTPRequestAsync(GET, url, 'foo_javascript_panel_musicbrainz');
		this.filenames[task_id] = this.filename;
	}

	header_text () {
		return this.artist + ': ' + (this.properties.mode.value == 0 ? 'releases' : 'links');
	}

	http_request_done (task_id, success, response_text) {
		const f = this.filenames[task_id];

		if (!f)
			return;

		if (!success) {
			console.log(N, response_text);
			return;
		}

		let to_save;

		if (this.properties.mode.value == 0) {
			let data = JsonParse(response_text);
			let max_offset = Math.min(500, data['release-group-count'] || 0) - 100;
			let rg = data['release-groups'] || [];
			this.mb_data.push(...rg);

			if (this.mb_offset < max_offset) {
				this.mb_offset += 100;
				this.get();
			} else {
				to_save = JSON.stringify(this.mb_data);
			}
		} else {
			to_save = response_text;
		}

		if (to_save) {
			Save(f, to_save);

			if (f == this.filename) {
				this.reset();
			}
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

			if (x > this.x + this.clickable_text_x && x < this.x + this.clickable_text_x + Math.min(item.width, this.text_width) && typeof item.url == 'string') {
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
		case !this.in_range:
			break;
		default:
			let item = this.data[this.index];

			if (x > this.x + this.clickable_text_x && x < this.x + this.clickable_text_x + Math.min(item.width, this.text_width) && typeof item.url == 'string') {
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
		if (this.count == 0)
			return;

		if (this.properties.mode.value == 0) { // releases
			this.text_width = this.w - this.spacer_w - 10;

			for (let i = 0; i < Math.min(this.count, this.rows); i++) {
				let item = this.data[i + this.offset];

				if (item.url == 'SECTION_HEADER') {
					this.draw_row(gr, item.name, panel.colours.highlight, this.x, this.y + Scale(12) + (i * panel.row_height), this.text_width, panel.row_height);
				} else {
					this.draw_row(gr, item.name, panel.colours.text, this.x, this.y + Scale(12) + (i * panel.row_height), this.text_width, panel.row_height);
					this.draw_row(gr, item.date, panel.colours.highlight, this.x, this.y + Scale(12) + (i * panel.row_height), this.w, panel.row_height, DWRITE_TEXT_ALIGNMENT_TRAILING);
				}
			}
		} else { // links
			this.clickable_text_x = 0;
			this.text_width = this.w;

			for (let i = 0; i < Math.min(this.count, this.rows); i++) {
				this.draw_row(gr, this.data[i + this.offset].name, panel.colours.text, this.x, this.y + Scale(12) + (i * panel.row_height), this.text_width, panel.row_height);
			}
		}

		this.up_btn.paint(gr, panel.colours.text);
		this.down_btn.paint(gr, panel.colours.text);
	}

	rbtn_up (x, y) {
		panel.m.AppendMenuItem(MF_STRING, 1200, 'Releases');
		panel.m.AppendMenuItem(MF_STRING, 1201, 'Links');
		panel.m.CheckMenuRadioItem(1200, 1201, this.properties.mode.value + 1200);
		panel.m.AppendMenuSeparator();
		panel.m.AppendMenuItem(EnableMenuIf(IsUUID(this.mb_id)), 1210, 'Refresh');
		panel.m.AppendMenuSeparator();
		panel.m.AppendMenuItem(EnableMenuIf(utils.IsFile(this.filename)), 1999, 'Open containing folder');
		panel.m.AppendMenuSeparator();
	}

	rbtn_up_done (idx) {
		switch (idx) {
		case 1200:
		case 1201:
			this.properties.mode.value = idx - 1200;
			this.reset();
			break;
		case 1210:
			this.get();
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
		this.spacer_w = '0000'.calc_width(panel.fonts.normal);

		if (IsUUID(this.mb_id)) {
			if (this.properties.mode.value == 0) {
				this.mb_data = [];
				this.mb_offset = 0;
				this.filename = ArtistFolder(this.artist) + 'musicbrainz.releases.' + this.mb_id + '.json';

				if (utils.IsFile(this.filename)) {
					let data = _(JsonParseFile(this.filename))
						.orderBy(['first-release-date', 'title'], ['desc', 'asc'])
						.map(item => {
							return {
								name : item.title,
								width : item.title.calc_width(panel.fonts.normal),
								url : 'https://musicbrainz.org/release-group/' + item.id,
								date : item['first-release-date'].substring(0, 4),
								primary : item['primary-type'],
								secondary : item['secondary-types'].sort()[0] || null
							};
						})
						.nest(['primary', 'secondary'])
						.value();

					['Album', 'Single', 'EP', 'Other', 'Broadcast', 'null'].forEach(primary => {
						['null', 'Audiobook', 'Compilation', 'Demo', 'DJ-mix', 'Interview', 'Live', 'Mixtape/Street', 'Remix', 'Spokenword', 'Soundtrack'].forEach(secondary => {
							let group = _.get(data, primary + '.' + secondary);

							if (group) {
								let name = (primary + ' + ' + secondary).replace('null + null', 'Unspecified type').replace('null + ', '').replace(' + null', '');
								this.data.push({name : name, width : 0, url : 'SECTION_HEADER', date : ''});
								this.data.push(...group);
								this.data.push({name : '', width : 0, url : '', date : ''});
							}
						});
					});

					this.data.pop();

					if (FileExpired(this.filename, ONE_DAY)) {
						this.get();
					}
				} else {
					this.get();
				}
			} else {
				this.filename = ArtistFolder(this.artist) + 'musicbrainz.links.' + this.mb_id + '.json';

				if (utils.IsFile(this.filename)) {
					const url = 'https://musicbrainz.org/artist/' + this.mb_id;

					this.data = _(_.get(JsonParseFile(this.filename), 'relations', []))
						.map(item => {
							const url = decodeURIComponent(item.url.resource);
							return {
								name : url,
								url : url,
								width : url.calc_width(panel.fonts.normal)
							};
						})
						.sortBy(item => {
							return item.name.split('//')[1].replace('www.', '');
						})
						.value();

					this.data.unshift({
						name : url,
						url : url,
						width : url.calc_width(panel.fonts.normal)
					});

					if (FileExpired(this.filename, ONE_DAY)) {
						this.get();
					}
				} else {
					this.get();
				}
			}
		}

		this.count = this.data.length;
		this.offset = 0;
		this.index = 0;
		window.Repaint();
	}
}
