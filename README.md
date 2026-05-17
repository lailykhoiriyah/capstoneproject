 <a href="https://ibb.co/pxpCNDc"><img src="https://i.ibb.co.com/MyR1XPQK/Trip-Well.png" alt="icon" border="0"></a>

# TripWell – Inclusive Tourism Accessibility Classification

## Project Overview

TripWell is an AI-powered inclusive tourism platform designed to help users identify whether a tourist destination is accessible for people with mobility limitations, such as wheelchair users, elderly visitors, and families with strollers.

This project focuses on analyzing Indonesian tourism reviews using Deep Learning and Natural Language Processing (NLP) techniques.

The AI system automatically classifies tourism reviews into:

- **Ramah Disabilitas** (Accessible)
- **Akses Terbatas** (Limited Accessibility)

This project was developed for:

> Coding Camp 2026 powered by DBS Foundation

---

# Team Information

## Team ID
CC26-PSU116

## Team Members

| Name | Learning Path | Role |
|---|---|---|
| Laily Khoiriyah Isnaini | AI Engineer | Active |
| Okky Puspa Ningrum | AI Engineer | Active |
| Muhammad Hasbi Ramadhani | Data Science | Active |
| Argama Vanesa Nauli Sijabat | Data Science | Active |
| Rumaisya | Full-Stack Developer | Active |
| Annisa Sahindar | Full-Stack Developer | Active |

---

# Background

Tourism accessibility information in Indonesia is still limited and difficult to identify clearly from public reviews. Most tourism platforms mix accessibility-related reviews with unrelated information such as price, scenery, or entertainment.

As a result, users with mobility needs often struggle to determine whether a location is safe and accessible before visiting.

TripWell aims to solve this problem by developing an AI-based review classification system using a Bidirectional LSTM model.

---

# Problem Statement

Lack of accessibility-focused filtering systems in tourism reviews causes users with mobility limitations to struggle in assessing whether a destination is accessible and safe.

---

# Main Features

- Accessibility review classification using NLP
- Binary classification:
  - Positive → Ramah Disabilitas
  - Negative → Akses Terbatas
- Deep Learning model using Bidirectional LSTM
- TensorFlow Functional API implementation
- Custom callback implementation
- Model export in `.keras` format
- Simple inference system
- Ready for API integration

---

# Model Architecture

The model uses:

```text
Input Layer
↓
Embedding Layer
↓
SpatialDropout1D
↓
Bidirectional LSTM
↓
Bidirectional LSTM
↓
GlobalMaxPooling1D
↓
Dense Layer
↓
Dropout
↓
Output Layer (Sigmoid)
```
---

# <div align="center">Presented By :</div>

<div align="center">

| <img src="https://i.ibb.co/xGPVFJD/dicoding-logo-white.png" height="60" alt="dicoding-logo-white" border="0"> | <img src="https://i.ibb.co.com/YMTYskf/DBS.png" height="120" alt="dbs-logo" border="0"> |
| :---: | :---: |

</div>


