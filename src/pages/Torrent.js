import React from "react";
import { inject } from "mobx-react";

import Container from "../containers/Container";
import TorrentInfo from "../views/TorrentInfo";

import "./Torrent.css";

class Torrent extends React.Component {
  get torrents() {
    return this.props.store.torrents;
  }

  get id() {
    return this.props.match.params.id;
  }

  render() {
    return (
      <div className="Torrent">
        <Container store={this.torrents} id={this.id}>
          {torrent => <TorrentInfo item={torrent} />}
        </Container>
      </div>
    );
  }
}

export default inject("store")(Torrent);
