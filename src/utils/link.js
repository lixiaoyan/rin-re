const HOST = "https://bangumi.moe";
const HOST_STATIC = "https://static.bangumi.moe";

export const avatar = user => `${HOST_STATIC}/avatar/${user.emailHash}`;

export const download = torrent =>
  `${HOST}/download/torrent/${torrent.id}/${encodeURIComponent(
    torrent.title,
  )}.torrent`;

export const feed = () => `${HOST}/rss/latest`;
export const searchFeed = query =>
  `${HOST}/rss/search/${encodeURIComponent(query)}`;
