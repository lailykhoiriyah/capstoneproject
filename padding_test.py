import keras
import pickle
import numpy as np
from keras.preprocessing.sequence import pad_sequences

MODEL_PATH = 'tripwell_bilstm_fixed.keras'
TOKENIZER_PATH = 'tokenizer.pkl'

model = keras.models.load_model(MODEL_PATH)
with open(TOKENIZER_PATH, 'rb') as handle:
    tokenizer = pickle.load(handle)

texts = ["bagus banget tempatnya", "buruk sekali tempatnya", "mudah diakses", "sulit diakses"]

for text in texts:
    seq = tokenizer.texts_to_sequences([text])
    
    # Pre padding
    padded_pre = pad_sequences(seq, maxlen=128, padding='pre')
    pred_pre = model.predict(padded_pre, verbose=0)
    
    # Post padding
    padded_post = pad_sequences(seq, maxlen=128, padding='post')
    pred_post = model.predict(padded_post, verbose=0)
    
    print(f"Text: {text}")
    print(f"  PRE  -> Index 0: {pred_pre[0][0]:.4f} | Index 1: {pred_pre[0][1]:.4f}")
    print(f"  POST -> Index 0: {pred_post[0][0]:.4f} | Index 1: {pred_post[0][1]:.4f}")
    print("-" * 30)
