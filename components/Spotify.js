const clientId = "6604525e0c8d49f3a90ce444a17d1954";
const redirectUri ="http://localhost:3000/";
const clientS = "eb8c78e393c94d3280878b1f7b5efef7"
let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(`${accessToken}`);
        const expiresInMatch = window.location.href.match(`${expiresIn}`);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotift/authorize?client_id=${clientId}&reponse_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => response.json()).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https.//api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                methods: 'POST',
                body: JSON.stringify({name: name})
            }).then(response => response.json()).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                });
            });
        });
    }
};

export default Spotify;