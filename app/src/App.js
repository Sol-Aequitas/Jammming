import React, { useState, useCallback } from 'react';
import Playlist from "./components/Playlist";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Spotify from "./components/Spotify";
import "../src/App.css";



const App = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [playlistName, setPlaylistName] = useState("New Playlist");
    const [playlistTracks, setPlaylistTracks] = useState([]);

    const search = useCallback((term) => {
        Spotify.search(term).then(setSearchResults);
    }, []);

    const addTrack = useCallback(
        (track) => {
            if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
            return;
            
            setPlaylistTracks((prevTracks) => [...prevTracks, track]);
        },
        [playlistTracks]
    );

    const removeTrack = useCallback((track) => {
        setPlaylistTracks((prevTracks) => prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
        );
    }, []);

    const updatePlaylistName = useCallback((name) => {
        setPlaylistName(name);
    }, []);

    const savePlaylist = useCallback(() => {
        const trackUris = playlistTracks.map((track) => track.uri);
        Spotify.savePlaylist(playlistName, trackUris)
        .then(() => {
            setPlaylistName("New Playlist");
            setPlaylistTracks([]);
        })
        .catch((error) => {
            console.log("Error saving playlist:", error);
        });
    }, [playlistName, playlistTracks]);

    return (
        <div>
            <h1>
                Ja<span className="highlight">mmm</span>ing
            </h1>
            <div className="App">
                <SearchBar onSearch={search} />
                <div className="App-playlist">
                   <SearchResults searchResults={searchResults} onAdd={addTrack} />
                   <Playlist
                      playlistName={playlistName}
                      playlistTracks={playlistTracks}
                      onNameChange={updatePlaylistName}
                      onRemove={removeTrack}
                      onSave={savePlaylist}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;