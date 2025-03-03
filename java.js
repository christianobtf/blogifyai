async function requestTranscription() { 
    const videoUrl = document.getElementById('videoUrl').value;

    if (!videoUrl) {
        alert('Please enter a valid YouTube URL');
        return;
    }

    // Clear previous transcription and video
    document.getElementById('videoTitle').textContent = "Vidéo: N/A";
    document.getElementById('transcriptionOutput').innerHTML = "";
    document.getElementById('videoFrame').src = "";

    const response = await fetch('http://127.0.0.1:5000/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl })
    });

    const result = await response.json();

    if (response.ok) {
        // Set the video title
        const title = result.title || "N/A";
        const transcription = result.transcription || "No transcription available.";

        // Show the video section
        document.getElementById('videoSection').style.display = 'flex';

        // Set video iframe
        const videoId = extractVideoId(videoUrl);
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        document.getElementById('videoFrame').src = embedUrl;

        // Set the video title text
        document.getElementById('videoTitle').textContent = `Vidéo: ${title}`;

        // Format and display the transcription
        const formattedTranscription = formatTranscriptionWithTimestamps(transcription);
        document.getElementById('transcriptionOutput').innerHTML += formattedTranscription;

        // Send the transcription to ChatGPT for article generation
        await sendToChatGPTAndGenerateDocx(transcription);
    } else {
        alert('Error: ' + result.error);
    }
}

function extractVideoId(url) {
    const pattern = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/;
    const match = url.match(pattern);
    return match ? match[1] : null;
}

function formatTranscriptionWithTimestamps(transcription) {
    const lines = transcription.split('\n');
    let formattedText = '';
    let minute = 0;

    lines.forEach(line => {
        if (line.trim()) {
            const timestamp = `${String(minute).padStart(2, '0')}:${String(0).padStart(2, '0')}`;
            formattedText += `<strong>${timestamp}</strong> ${line}<br>`;
            minute += 1;
        }
    });

    return formattedText;
}

async function sendToChatGPTAndGenerateDocx(transcription) {
    const response = await fetch('http://127.0.0.1:5001/generate_article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription })
    });

    const result = await response.json();

    if (response.ok) {
        // Display the generated article section
        document.getElementById('articleSection').style.display = 'block';

        // Create and add the new box with title and description
        const articleTitle = "Article issue de ChatGPT";
        const articleDescription = "Ici la description de la vidéo";
        
        // Insert title and description before the article
        const articleContainer = document.getElementById('articleOutput');
        articleContainer.innerHTML = `
            <div class="article-header">
                <h2>${articleTitle}</h2>
                <p>${articleDescription}</p>
            </div>
            <p>${result.article.replace(/\n/g, '<br>')}</p>
        `;
    } else {
        alert('Error: ' + result.error);
    }
}
