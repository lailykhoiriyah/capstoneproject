import keras
import pickle
import numpy as np
from keras.preprocessing.sequence import pad_sequences
import os

MODEL_PATH = 'tripwell_bilstm_fixed.keras'
TOKENIZER_PATH = 'tokenizer.pkl'

model = keras.models.load_model(MODEL_PATH)
with open(TOKENIZER_PATH, 'rb') as handle:
    tokenizer = pickle.load(handle)

test_cases = [
    "bagus banget tempatnya ramah disabilitas",
    "sangat nyaman aksesibel kursi roda",
    "mudah sekali diakses",
    "buruk sekali tangganya curam",
    "sulit diakses banyak tangga sempit",
    "tidak ramah disabilitas payah",
    "akses terbatas sangat tidak disarankan"
]

print(f"{'Text':<50} | {'Index 0':<10} | {'Index 1':<10}")
print("-" * 75)

for text in test_cases:
    seq = tokenizer.texts_to_sequences([text.lower()])
    # Test both paddings just in case
    padded_pre = pad_sequences(seq, maxlen=128, padding='pre', truncating='pre')
    pred = model.predict(padded_pre, verbose=0)
    print(f"{text:<50} | {pred[0][0]:.4f}     | {pred[0][1]:.4f}")
