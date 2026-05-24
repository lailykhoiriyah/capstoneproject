import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import matplotlib.patches as mpatches
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer

from streamlit_option_menu import option_menu

st.set_page_config(page_title="TripWell Analytics", layout="wide")
sns.set_theme(style='whitegrid')

# =========================================================
# 1. TARIK DATA YANG SUDAH DI PREPROSESSING
# =========================================================
@st.cache_data
def load_data():
return pd.read_csv("data-science/preprocessed_dataset.csv")

df_mentah = load_data()

# =========================================================
# 2. MESIN AGREGASI (Membentuk df_check otomatis untuk P1)
# =========================================================
df_rating = df_mentah.groupby('location')['rating'].mean().reset_index(name='avg_rating')
df_sentimen = pd.crosstab(df_mentah['location'], df_mentah['accessibility'], normalize='index') * 100
df_sentimen = df_sentimen.reset_index()

rename_dict = {0: 'neg_pct', 1: 'pos_pct', 2: 'neu_pct'}
df_sentimen.rename(columns=rename_dict, inplace=True)
df_check = pd.merge(df_rating, df_sentimen, on='location')

# =========================================================
# 3. SIDEBAR (LOGO & MENU NAVIGASI)
# =========================================================
with st.sidebar:
    
    st.image("data-science/tripwell.png", use_container_width=True) 
    st.markdown("---")
    
    
    pilihan = option_menu(
        menu_title="Navigasi Analisis", 
        options=["Rating", "Top N-Grams", "Bisnis 1", "Bisnis 2", "Bisnis 3"], 
        icons=["star-fill", "chat-text-fill", "1-square-fill", "2-square-fill", "3-square-fill"],
        default_index=0,
        styles={
            "container": {"padding": "5px!important", "background-color": "#f1f3f6", "border-radius": "10px"},
            "icon": {"color": "#6c757d", "font-size": "16px"}, 
            "nav-link": {"font-size": "15px", "text-align": "left", "margin":"5px", "--hover-color": "#e2e6ea"},
            "nav-link-selected": {"background-color": "#0099ff", "color": "white", "font-weight": "bold"},
        }
    )

# =========================================================
# 4. HEADER DASHBOARD UTAMA
# =========================================================
st.title("TripWell Data Analytics Dashboard")
st.markdown("### Dashboard Evaluasi Tingkat Aksesibilitas Fasilitas Wisata Alam di Bandung Barat")
st.divider()

# =========================================================
# OPSI 1: DISTRIBUSI RATING
# =========================================================
if pilihan == "Rating":
    st.subheader(" Distribusi Persebaran Rating pada Keseluruhan Dataset")
    
    rating_counts = df_mentah['rating'].value_counts().sort_index()
    rating_avg = df_mentah['rating'].mean()

    fig_overview = plt.figure(figsize=(10, 5))
    ax_overview = sns.barplot(x=rating_counts.index, y=rating_counts.values, color='Blue')
    ax_overview.bar_label(ax_overview.containers[0], padding=3)

    plt.title('Distribusi Rating Keseluruhan')
    plt.xlabel('Rating')
    plt.ylabel('Jumlah Ulasan')
    plt.tight_layout()

    st.pyplot(fig_overview)
    st.success(f"**Rata-rata rating keseluruhan dataset:** ⭐ {rating_avg:.2f} / 5.0")
    st.success("Data Rating didominasi oleh nilai tinggi, dimana mayoritas pengunjung (sejumlah 7636 dari 11620 ulasan) memberikan nilai 5 dan rata-rata keseluruhan bernilai 4.5. Hal ini menandakan kepuasan yang cukup tinggi secara keseluruhan untuk destinasi wisata alam di Bandung Barat.")

# =========================================================
# OPSI 2: TOP N-GRAMS (BIGRAMS & TRIGRAMS)
# =========================================================
elif pilihan == "Top N-Grams":
    st.subheader(" Kumpulan Pasangan Kata (N-Grams) Paling Sering Muncul")
    
    # Kita bagi layarnya jadi 2 kolom (kiri-kanan)
    col_kiri, col_kanan = st.columns(2)
    
    with col_kiri:
        st.markdown("#### 📊 Top 10 Bigrams (2 Kata)")
        cv_bi = CountVectorizer(ngram_range=(2, 2))
        bigrams = cv_bi.fit_transform(df_mentah['text_clean'].fillna(''))
        count_values_bi = np.asarray(bigrams.sum(axis=0)).flatten()
        gram_freq_bi = pd.DataFrame(sorted([(count_values_bi[i], k) for k, i in cv_bi.vocabulary_.items()], reverse=True))
        gram_freq_bi.columns = ['frequency', 'ngram']

      
        fig_bi = plt.figure(figsize=(8, 6))
        sns.barplot(x=gram_freq_bi['frequency'][:10], y=gram_freq_bi['ngram'][:10])
        plt.title('Top 10 Most Frequent Bigrams', fontsize=12)
        plt.xlabel('Frequency')
        plt.ylabel('Bigram')
        plt.tight_layout()
        st.pyplot(fig_bi)

    with col_kanan:
        st.markdown("#### 📊 Top 10 Trigrams (3 Kata)")
        cv_tri = CountVectorizer(ngram_range=(3, 3))
        trigrams = cv_tri.fit_transform(df_mentah['text_clean'].fillna(''))
        count_values_tri = np.asarray(trigrams.sum(axis=0)).flatten()
        gram_freq_tri = pd.DataFrame(sorted([(count_values_tri[i], k) for k, i in cv_tri.vocabulary_.items()], reverse=True))
        gram_freq_tri.columns = ['frequency', 'ngram']

        fig_tri = plt.figure(figsize=(8, 6))
        sns.barplot(x=gram_freq_tri['frequency'][:10], y=gram_freq_tri['ngram'][:10])
        plt.title('Top 10 Most Frequent Trigrams', fontsize=12)
        plt.xlabel('Frequency')
        plt.ylabel('Trigram')
        plt.tight_layout()
        st.pyplot(fig_tri)
        
    st.write("")
    st.info(" **Catatan:** Bigrams menampilkan pasangan 2 kata yang paling sering muncul, sedangkan Trigrams menampilkan kombinasi 3 kata. Keduanya memberikan gambaran umum mengenai topik utama ulasan wisatawan.")

# =========================================================
# OPSI 3: PERTANYAAN BISNIS 1
# =========================================================
elif pilihan == "Bisnis 1":
    st.subheader("Analisis Pertanyaan Bisnis 1")
    st.info(
        "**Pertanyaan:** Lokasi wisata alam mana di Bandung Barat yang memiliki proporsi ulasan aksesibilitas negatif tertinggi "
        "berdasarkan persentase label negatif terhadap total ulasan per lokasi, dan bagaimana rata-rata rating pada lokasi terkait "
        "selama periode 2019-2023?"
    )
    
    st.markdown("#### Ringkasan Data Utama")
    col1, col2 = st.columns(2)
    with col1:
        lokasi_teratas = df_check.nlargest(1, 'neg_pct').iloc[0]
        st.error(f"Proporsi Negatif Tertinggi: **{lokasi_teratas['location']}** ({lokasi_teratas['neg_pct']:.1f}%)")
    with col2:
        st.warning(f"Rata-rata Rating Lokasi Terkait: **{lokasi_teratas['avg_rating']:.2f} / 5.0**")
    
    st.write("")

    st.markdown("#### 1. Distribusi Rata-rata Rating per Lokasi")
    fig_hist = plt.figure(figsize=(10, 5))
    sns.histplot(df_check['avg_rating'], bins=10, kde=True, color='#4C78A8')
    plt.title('Distribusi Rata-rata Rating per Lokasi', fontsize=12)
    plt.xlabel('Rata-rata Rating')
    plt.ylabel('Jumlah Lokasi')
    plt.xlim(0, 5)
    plt.tight_layout()
    st.pyplot(fig_hist)
    
    st.write("")

    st.markdown("#### 2. Rata-rata Rating Lokasi Wisata (2019–2023)")
    rating_plot = df_check.sort_values(by='avg_rating', ascending=False)
    fig_bar = plt.figure(figsize=(10, 6))
    ax_bar = sns.barplot(data=rating_plot, x='avg_rating', y='location', palette="Blues_r")
    ax_bar.bar_label(ax_bar.containers[0], padding=5, fmt='%.2f')
    plt.title('Rata-rata Rating Lokasi Wisata (2019–2023)', fontsize=12)
    plt.xlabel('Rata-rata Rating')
    plt.ylabel('Lokasi Wisata')
    plt.xlim(0, 5.5)
    plt.tight_layout()
    st.pyplot(fig_bar)
    
    st.write("")

    st.markdown("#### 3. Top 5 Lokasi dengan Proporsi Sentimen Aksesibilitas Negatif Terbesar")
    top_5_locations = df_check.nlargest(5, 'neg_pct').sort_values('neg_pct', ascending=False).copy()
    fig_stack, ax_stack = plt.subplots(figsize=(10, 5))
    
    locations = top_5_locations['location']
    negative = top_5_locations['neg_pct']
    neutral = top_5_locations['neu_pct']
    positive = top_5_locations['pos_pct']

    plt.bar(locations, negative, label='Negative', color='#ff9999')
    plt.bar(locations, neutral, bottom=negative, label='Neutral', color='#ffe162')
    plt.bar(locations, positive, bottom=negative + neutral, label='Positive', color='#b3e6b3')

    for c in ax_stack.containers:
        ax_label = [f'{w:.1f}%' if w > 0 else '' for w in c.datavalues]
        ax_stack.bar_label(c, labels=ax_label, label_type='center', fontsize=10, weight='bold')

    plt.title('Top 5 Lokasi dengan Proporsi Sentimen Aksesibilitas Negatif Terbesar', fontsize=12)
    plt.xlabel('Lokasi Wisata')
    plt.ylabel('Proporsi Sentimen (%)')
    plt.xticks(rotation=15, ha='right')
    plt.ylim(0, 100)
    plt.legend()
    plt.tight_layout()
    st.pyplot(fig_stack)
    
    st.write("")

    st.markdown("#### Kesimpulan Analisis Strategis:")
    st.success("""
    * **Dominasi Curug Malela:** Curug Malela menjadi outlier utama dengan proporsi sentimen negatif aksesibilitas mencapai 52.5% (hampir tiga kali lipat dari peringkat kedua). Ini adalah satu-satunya lokasi dengan keluhan akses mayoritas (>50%).
    * **Pola Mayoritas Netral:** Empat lokasi lainnya dalam Top 5 (Bukit Senyum, Curug Layung, Stone Garden, Sanghyang Heuleut) memiliki pola seragam yang didominasi sentimen netral (77–81%). Mayoritas pengunjung di lokasi tersebut cenderung pasif dalam menilai aksesibilitas secara spesifik.
    * **Konsistensi Rating dan Sentimen:** Kelima lokasi dengan masalah aksesibilitas tertinggi ini rata-rata memiliki rating menengah ke bawah (4.39 - 4.56) dibandingkan lokasi lain di dataset. Ini menunjukkan bahwa kendala aksesibilitas berkontribusi menekan nilai kepuasan pengunjung secara umum.
    * **Anomali Data (Sampel Minim):** Lokasi Sirtwo Island Saguling tercatat memiliki rating sempurna (5.00). Namun, angka ini tidak valid untuk dijadikan acuan karena hanya didasarkan pada total 3 ulasan (sampel terendah), sehingga murni merupakan anomali statistik.
    """)

# =========================================================
# OPSI 4: JIKA MEMILIH PERTANYAAN BISNIS 2
# =========================================================
elif pilihan == "Bisnis 2":
    st.subheader("Analisis Pertanyaan Bisnis 2")
    st.info("**Pertanyaan:** Apa saja kata dan bigram paling diskriminatif untuk membedakan ulasan berlabel aksesibilitas positif dan negatif berdasarkan nilai TF-IDF dalam dataset pada tahun 2019–2023?")
    
    df = df_mentah 

    df_q2 = df[df['accessibility'].isin([0, 2])].copy()
    df_q2['label_name'] = df_q2['accessibility'].map({0: 'Negative', 2: 'Positive'})
    df_q2['text_clean'] = df_q2['text_clean'].fillna('')

    stopwords_removable = {'yang', 'dan', 'di', 'untuk', 'nya', 'juga', 'ke', 'dari', 'ada', 'dengan', 'ini', 'itu'}
    kata_kunci_sentimen = {'tidak', 'kurang', 'belum', 'terlalu', 'sangat', 'bagus', 'mudah', 'jalan', 'akses'}
    custom_stop_words = list(stopwords_removable - kata_kunci_sentimen)

    def compute_ctfidf(df, text_col, label_col, ngram_range=(1,1), top_n=10, stop_words=None):
        labels = df[label_col].unique()
        class_docs = {}
        class_sizes = {}
        for lbl in labels:
            mask = df[label_col] == lbl
            class_docs[lbl] = ' '.join(df.loc[mask, text_col].tolist())
            class_sizes[lbl] = mask.sum()

        corpus = [class_docs[lbl] for lbl in labels]
        vectorizer = TfidfVectorizer(
            ngram_range=ngram_range,
            min_df=1,
            max_df=1.0,
            stop_words=stop_words,
            sublinear_tf=True
        )
        tfidf_matrix = vectorizer.fit_transform(corpus)
        feature_names = np.array(vectorizer.get_feature_names_out())

        results = {}
        for i, lbl in enumerate(labels):
            scores = np.asarray(tfidf_matrix[i].todense()).ravel()
            scores = scores / np.sqrt(class_sizes[lbl])
            top_idx = scores.argsort()[::-1][:top_n]
            results[lbl] = {
                'terms': feature_names[top_idx],
                'scores': scores[top_idx]
            }
        return results

    ctfidf_uni = compute_ctfidf(df_q2, 'text_clean', 'accessibility', ngram_range=(1,1), top_n=10, stop_words=custom_stop_words)
    ctfidf_bi  = compute_ctfidf(df_q2, 'text_clean', 'accessibility', ngram_range=(2,2), top_n=10, stop_words=custom_stop_words)

    COLORS = {'neg_uni': '#E24B4A', 'neg_bi' : '#F09595', 'pos_uni': '#1D9E75', 'pos_bi' : '#5DCAA5'}
    label_map   = {0: 'Negative', 2: 'Positive'}
    label_order = [0, 2]

    fig, axes = plt.subplots(2, 2, figsize=(18, 13))
    fig.suptitle('c-TF-IDF: Kata dan Bigram Diskriminatif per Kelas Aksesibilitas\n(Cluster-level TF-IDF — semakin tinggi skor, semakin eksklusif untuk kelas tersebut)', fontsize=13, fontweight='bold', y=1.01)

    for row_idx, label_id in enumerate(label_order):
        label_name = label_map[label_id]

        uni_terms  = ctfidf_uni[label_id]['terms'][::-1]
        uni_scores = ctfidf_uni[label_id]['scores'][::-1]
        color_uni  = COLORS['neg_uni'] if label_id == 0 else COLORS['pos_uni']

        bars = axes[row_idx, 0].barh(uni_terms, uni_scores, color=color_uni, edgecolor='white', linewidth=0.5)
        axes[row_idx, 0].set_title(f'Top 10 c-TF-IDF Unigrams — {label_name}', fontsize=12, fontweight='bold', color='#A32D2D' if label_id == 0 else '#0F6E56')
        axes[row_idx, 0].set_xlabel('c-TF-IDF Score (normalized by class size)', fontsize=10)
        axes[row_idx, 0].tick_params(axis='y', labelsize=11)
        axes[row_idx, 0].spines[['top', 'right']].set_visible(False)
        axes[row_idx, 0].grid(axis='x', alpha=0.3, linestyle='--')

        for bar, score in zip(bars, uni_scores):
            axes[row_idx, 0].text(bar.get_width() + max(uni_scores)*0.01, bar.get_y() + bar.get_height()/2, f'{score:.4f}', va='center', fontsize=8.5, color='#444')

        bi_terms  = ctfidf_bi[label_id]['terms'][::-1]
        bi_scores = ctfidf_bi[label_id]['scores'][::-1]
        color_bi  = COLORS['neg_bi'] if label_id == 0 else COLORS['pos_bi']

        bars2 = axes[row_idx, 1].barh(bi_terms, bi_scores, color=color_bi, edgecolor='white', linewidth=0.5)
        axes[row_idx, 1].set_title(f'Top 10 c-TF-IDF Bigrams — {label_name}', fontsize=12, fontweight='bold', color='#A32D2D' if label_id == 0 else '#0F6E56')
        axes[row_idx, 1].set_xlabel('c-TF-IDF Score (normalized by class size)', fontsize=10)
        axes[row_idx, 1].tick_params(axis='y', labelsize=11)
        axes[row_idx, 1].spines[['top', 'right']].set_visible(False)
        axes[row_idx, 1].grid(axis='x', alpha=0.3, linestyle='--')
        
        for bar2, score2 in zip(bars2, bi_scores):
            axes[row_idx, 1].text(bar2.get_width() + max(bi_scores)*0.01, bar2.get_y() + bar2.get_height()/2, f'{score2:.4f}', va='center', fontsize=8.5, color='#444')

    neg_patch = mpatches.Patch(color=COLORS['neg_uni'], label='Negative (label 0)')
    pos_patch = mpatches.Patch(color=COLORS['pos_uni'], label='Positive (label 2)')
    fig.legend(handles=[neg_patch, pos_patch], loc='lower center', ncol=2, fontsize=11, frameon=False, bbox_to_anchor=(0.5, -0.02))

    plt.tight_layout()
    st.pyplot(fig) 
    
    st.markdown("#### Temuan Diskriminatif (Insight):")
    st.success("""
    * **Kelas Negatif (Fokus Infrastruktur):** Baik unigram maupun bigram didominasi oleh keluhan kondisi fisik jalan (`jalan`, `rusak parah`, `diperbaiki`), yang keluhannya semakin tajam saat cuaca buruk (`saat hujan`).
    * **Kelas Positif (Fokus Kemudahan):** Lebih menyoroti kenyamanan akses secara menyeluruh (`parkir`, `sangat mudah`, `tidak terlalu jauh`). Destinasi wisata seperti Kawah Ratu dan Tangkuban Perahu secara spesifik banyak mendapat pujian pada aspek ini.
    * **Topik Polarisasi:** Frasa `tiket masuk` muncul kuat di kedua kelas. Hal ini membuktikan bahwa harga tiket diukur berdasarkan kualitas aksesnya—terasa sepadan bagi yang puas dengan kemudahan lokasi, namun dianggap tidak worth it oleh mereka yang kesulitan di jalan.
    """)
# =========================================================
# OPSI 5: JIKA MEMILIH PERTANYAAN BISNIS 3 
# =========================================================
elif pilihan == "Bisnis 3":
    st.subheader(" Analisis Pertanyaan Bisnis 3")
    st.info("**Pertanyaan:** Bagaimana proporsi bulanan label aksesibilitas negatif, netral, dan positif berubah sepanjang 2019 – 2023, dan apakah terdapat tren atau pola musiman?")

    df = df_mentah.copy()

    df['datetime'] = pd.to_datetime(df['datetime'])
    df['month'] = df['datetime'].dt.to_period('M')

    def count_vals(x):
        return x.value_counts().reindex([0, 1, 2], fill_value=0)

    df_monthly = df.groupby('month').agg(rating=('rating', 'mean'), review_count=('id', 'count')).reset_index()

    for col in ['accessibility', 'facility', 'activity']:
        trend = df.groupby('month')[col].apply(count_vals).unstack(fill_value=0)
        trend.columns = [f'{col}_{i}' for i in range(3)]

        for i in range(3):
            trend[f'{col}_{i}_pct'] = (trend[f'{col}_{i}'] / trend.sum(axis=1)) * 100

        df_monthly = df_monthly.merge(trend, on='month')

    df_monthly['month'] = df_monthly['month'].dt.to_timestamp()

    st.markdown("####  1. Tren Rata-rata Rating Per Bulan")
    fig1 = plt.figure(figsize=(12, 5))
    plt.plot(df_monthly['month'], df_monthly['rating'], marker='o', color='gold', linewidth=2, label='Rata-rata Rating')
    plt.ylim(bottom=0, top=5.5)
    plt.title('Tren Rata-rata Rating Per Bulan', fontsize=14)
    plt.xlabel('Bulan')
    plt.ylabel('Rating')
    plt.xticks(rotation=45)
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.legend()
    plt.tight_layout()
    st.pyplot(fig1)

    st.markdown("####  2. Tren Jumlah Review Per Bulan")
    fig2 = plt.figure(figsize=(12, 5))
    plt.plot(df_monthly['month'], df_monthly['review_count'], marker='o', color='steelblue', linewidth=2, label='Jumlah Review')
    plt.title('Tren Jumlah Review Per Bulan', fontsize=14)
    plt.xlabel('Bulan')
    plt.ylabel('Jumlah Review')
    plt.xticks(rotation=45)
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.legend()
    plt.tight_layout()
    st.pyplot(fig2)

    st.markdown("####  3. Tren Proporsi Sentimen Aksesibilitas")
    fig3 = plt.figure(figsize=(12, 4))
    plt.plot(df_monthly['month'], df_monthly['accessibility_0_pct'], label='Negatif (0)', marker='s', color='red')
    plt.plot(df_monthly['month'], df_monthly['accessibility_1_pct'], label='Netral (1)', marker='s', color='orange')
    plt.plot(df_monthly['month'], df_monthly['accessibility_2_pct'], label='Positif (2)', marker='s', color='green')
    plt.title('Tren Proporsi Aksesibilitas', fontsize=12)
    plt.ylabel('Proporsi (%)')
    plt.ylim(0, 100)
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.xticks(rotation=45)
    st.pyplot(fig3)
    
    st.markdown("####  Temuan Tren dan Pola (Insight):")
    st.success("""
    * **Rating bulanan sangat stabil** sepanjang 2019–2023, bergerak dalam rentang sempit 4.35–4.65, tanpa tren naik atau turun yang signifikan.
    * **Jumlah review menunjukkan tren penurunan bertahap** sejak awal 2019 (±2500) hingga awal 2022 (±1850), diikuti oleh *drop* drastis di pertengahan 2022 menjadi sekitar 200 review per bulan. Kemungkinan besar merupakan dampak penutupan atau pembatasan wisata pasca-pandemi.
    * Fluktuasi rating di 2022–2023 yang sedikit lebih terlihat kemungkinan disebabkan oleh volume review yang jauh lebih kecil, sehingga setiap ulasan punya bobot proporsional yang lebih besar terhadap rata-rata.
    * **Tidak terlihat tren atau pola musiman yang konsisten** secara visual pada proporsi label aksesibilitas sepanjang periode 2019–2023.
    """)
# =========================================================
# FOOTER DASHBOARD
# =========================================================
st.markdown("<br><br>", unsafe_allow_html=True) # Ngasih jarak ruang kosong di bawah grafik
st.markdown("---") # Garis pembatas tipis
st.markdown(
    """
    <div style="text-align: center; font-size: 14px; color: #6c757d; padding: 10px;">
        © 2026 TripWell. All rights reserved.
    </div>
    """, 
    unsafe_allow_html=True
)    