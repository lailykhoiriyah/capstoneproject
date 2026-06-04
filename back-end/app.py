from flask import Flask, request, jsonify
from flask_cors import CORS
import keras
import pickle
from keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)
CORS(app)

# Load model
MODEL_PATH = "tripwell_bilstm.keras"
TOKENIZER_PATH = "tokenizer.pkl"

model = keras.models.load_model(MODEL_PATH)

with open(TOKENIZER_PATH, "rb") as f:
    tokenizer = pickle.load(f)

print("Model loaded successfully!")

@app.route("/")
def home():
    return jsonify({
        "message": "TripWell Accessibility API Running"
    })

@app.route("/predict", methods=["POST"])
def predict():

    try:
        data = request.get_json()

        text = data.get("text", "")

        sequence = tokenizer.texts_to_sequences([text])

        padded = pad_sequences(
            sequence,
            maxlen=128,
            padding="post"
        )

        prediction = model.predict(
            padded,
            verbose=0
        )[0]

        prob_negatif = float(prediction[0])
        prob_positif = float(prediction[1])

        label = (
            "Ramah Disabilitas"
            if prob_positif > prob_negatif
            else "Akses Terbatas"
        )

        return jsonify({
            "label": label,
            "negative_score": prob_negatif,
            "positive_score": prob_positif
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000
    )