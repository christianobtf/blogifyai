from flask import Flask, request, jsonify 
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import re
import json

app = Flask(__name__)
CORS(app)  # Permet au frontend d'accéder à l'API

def extract_video_id(url):
    pattern = r'(?:v=|youtu\.be/|embed/)([\w-]{11})'
    match = re.search(pattern, url)
    return match.group(1) if match else None

@app.route('/transcribe', methods=['POST'])
def transcribe():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    video_id = extract_video_id(url)

    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    try:
        # Récupérer la transcription de la vidéo
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['fr', 'en'])
        transcription = ' '.join([entry['text'] for entry in transcript])

        # Enregistrer la transcription dans un fichier JSON
        with open("Transcription_Recup.json", "w", encoding="utf-8") as file:
            json.dump({"transcription": transcription}, file, ensure_ascii=False, indent=4)

        return jsonify({"transcription": transcription}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
