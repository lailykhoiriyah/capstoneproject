from flask import Flask, request, jsonify
from flask_cors import CORS
import keras
import pickle
import numpy as np
import os
from keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)
CORS(app)

# Load the model
MODEL_PATH = 'tripwell_bilstm_fixed.keras'
TOKENIZER_PATH = 'tokenizer.pkl'

if os.path.exists(MODEL_PATH) and os.path.exists(TOKENIZER_PATH):
    model = keras.models.load_model(MODEL_PATH)
    with open(TOKENIZER_PATH, 'rb') as handle:
        tokenizer = pickle.load(handle)
    print("Model and Tokenizer loaded successfully!")
else:
    print(f"Error: Model or Tokenizer not found at {MODEL_PATH} or {TOKENIZER_PATH}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        text = data.get('text', '').lower().strip()
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400

        # Preprocessing
        sequences = tokenizer.texts_to_sequences([text])
        # Based on testing, 'post' padding works better for distinguishing 'mudah diakses'
        padded = pad_sequences(sequences, maxlen=128, padding='post', truncating='post')
        
        # Prediction
        prediction = model.predict(padded)
        
        # Log for debugging
        print(f"Text: {text}")
        print(f"Raw Prediction: {prediction}")
        
        # Re-mapping based on extensive word testing:
        # Index 0: Akses Terbatas (Negatif) -> triggered by 'buruk', 'sulit', 'jelek'
        # Index 1: Ramah Disabilitas (Positif) -> triggered by 'mudah diakses'
        
        prob_negatif = float(prediction[0][0])
        prob_positif = float(prediction[0][1])
        
        # Keyword Heuristic to help the model
        pos_keywords = ['bagus', 'nyaman', 'mantap', 'oke', 'ramah', 'indah', 'bersih', 'mudah', 'aksesibel', 'rata', 'landai']
        neg_keywords = ['jelek', 'buruk', 'kotor', 'rusak', 'parah', 'payah', 'sulit', 'terbatas', 'tangga', 'curam', 'sempit']
        
        has_pos = any(w in text for w in pos_keywords)
        has_neg = any(w in text for w in neg_keywords)
        
        # Final Decision Logic
        # If model is extremely sure about Index 1 (mudah diakses case), follow model
        if prob_positif > 0.8:
            label = "positif"
        # If keywords are found, they often override the model's Index 0 bias
        elif has_pos and not has_neg:
            label = "positif"
        elif has_neg:
            label = "negatif"
        else:
            # Fallback to model's strongest prediction
            label = "positif" if prob_positif > prob_negatif else "negatif"
            
        confidence = max(prob_positif, prob_negatif)
        if confidence > 1.0: confidence = 0.99
        
        return jsonify({
            'label': label,
            'confidence': confidence,
            'prediction': 1 if label == "positif" else 0
        })
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
