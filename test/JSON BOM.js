const utf8bom = fb.ComponentPath + 'test\\json\\utf8bom.json';
const utf16le = fb.ComponentPath + 'test\\json\\utf16le.json';

const str1 = utils.ReadUTF8(utf8bom);
const str2 = utils.ReadTextFile(utf8bom);
const str3 = utils.ReadTextFile(utf16le);

const j1 = JSON.parse(str1);
const j2 = JSON.parse(str2);
const j3 = JSON.parse(str3);

utils.ShowPopupMessage(j1.artist.bio.content, 1);
utils.ShowPopupMessage(j2.artist.bio.content, 2);
utils.ShowPopupMessage(j3.artist.bio.content, 3);
