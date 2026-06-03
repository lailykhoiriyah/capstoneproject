import keras
import pickle
import numpy as np
from keras.preprocessing.sequence import pad_sequences

MODEL_PATH = 'tripwell_bilstm_fixed.keras'
TOKENIZER_PATH = 'tokenizer.pkl'

model = keras.models.load_model(MODEL_PATH)
with open(TOKENIZER_PATH, 'rb') as handle:
    tokenizer = pickle.load(handle)

single_words = ["bagus", "buruk", "nyaman", "sulit", "ramah", "tangga"]

for word in single_words:
    seq = tokenizer.texts_to_sequences([word])
    padded = pad_sequences(seq, maxlen=128, padding='pre')
    pred = model.predict(padded, verbose=0)
    print(f"Word: {word:<10} | Index 0: {pred[0][0]:.4f} | Index 1: {pred[0][1]:.4f}")
