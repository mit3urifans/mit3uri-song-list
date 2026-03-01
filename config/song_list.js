import music_list from '../public/music_list.json'

const splitTagText = (tagText) =>
    String(tagText || '')
        .split('，')
        .map(s => s.trim())
        .filter(Boolean);

const generate_available_alphabets = () => {
  let flags = {};
  return music_list
    .map(x => x.initial)
    .filter(y => y.length === 1 && !flags[y] && (flags[y] = 1))
    .sort() // sorted by default
};

const generate_available_tags = () => {
  let flags = {};
  return music_list
      .flatMap(x => splitTagText(x.tag))
      .filter(t => !flags[t] && (flags[t] = 1))
      .sort();
};

export const song_list = music_list
export const available_alphabets = generate_available_alphabets()
export const available_tags = generate_available_tags()
