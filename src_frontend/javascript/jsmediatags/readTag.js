function createDataURL(data, format) { // Had to use AI to display the song's image from it's metadata, dude i never knew taking a image from a file and displaying it was that hard.
    const binary = new Uint8Array(data);
    const str = Array.from(binary).map(byte => String.fromCharCode(byte)).join('');
    return `data:${format};base64,${window.btoa(str)}`;
}

function getFileNameWithoutExtension(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
}

function readTags(file) {
    jsmediatags.read(file, {
        onSuccess: function(tag) {
            const tags = tag.tags;
            const album = tags.album || 'Unknown Album';
            const artist = tags.artist || 'Unknown Artist';
            const image = tags.picture ? createDataURL(tags.picture.data, tags.picture.format) : null;
            const src = URL.createObjectURL(file);
            const title = tags.title || getFileNameWithoutExtension(file.name);
            queue.push({ album, artist, image, src, title });
            queue.sort((a, b) => a.title.localeCompare(b.title));
            if (!isPlaying) {
                playAudio(0);
            }
        },
        onError: function(error) {
            console.log('Error while reading tags: ', error);
        }
    });
}