'use strict';

window.DefineScript('JS Playlist', {
	author : 'Falstaff + marc2003',
	features : {
		drag_n_drop : true,
		grab_focus : true
	}
});

include(fb.ComponentPath + 'helpers.js');
include(Paths.jsplaylist + 'inputbox.js');
include(Paths.jsplaylist + 'topbar.js');
include(Paths.jsplaylist + 'scrollbar.js');
include(Paths.jsplaylist + 'headerbar.js');
include(Paths.jsplaylist + 'playlist.js');
include(Paths.jsplaylist + 'playlistmanager.js');
include(Paths.jsplaylist + 'settings.js');
include(Paths.jsplaylist + 'callbacks.js');
include(Paths.jsplaylist + 'main.js');
