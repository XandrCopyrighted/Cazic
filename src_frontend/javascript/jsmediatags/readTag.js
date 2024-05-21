function readTags(file) {
    jsmediatags.read(file, {
        onSuccess: function(tag) {
            const tags = tag.tags;
            const album = tags.album || 'Unknown Album';
            const artist = tags.artist || 'Unknown Artist';
            const image = tags.image;
            const src = URL.createObjectURL(file);
            const title = tags.title || file.name;            
            queue.push({ album, artist, image, src, title });
            queue.sort((a, b) => a.title.localeCompare(b.title));
            if (!isPlaying) {
                playAudio(0);
            }
        },
        onError: function(error) {
            console.log('Error reading tags: ', error);
        }
    });
}