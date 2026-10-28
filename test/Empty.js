'use strict';

const files = utils.ListFiles(fb.ComponentPath + 'test\\empty\\'); // existing empty UTF8/UCS2-LE files
files.push('blah'); // dummy file name

files.forEach(file => {
	const text = utils.ReadTextFile(file);
	utils.ShowPopupMessage(text, file + ' ' + typeof text + ' ' + text.length);
});
