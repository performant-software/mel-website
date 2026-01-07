import os
import re
import numpy as np
import pandas as pd
from lxml import etree
import matplotlib.pyplot as plt
import seaborn as sns
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def analyze_tei_full(directory_path):
    ns = {'tei': 'http://www.tei-c.org/ns/1.0'}
    analyzer = SentimentIntensityAnalyzer()
    results = []

    for filename in os.listdir(directory_path):
        if filename.endswith(".xml"):
            try:
                tree = etree.parse(os.path.join(directory_path, filename))
                lines = [str(l).strip() for l in tree.xpath('//tei:l/text()', namespaces=ns) if l.strip()]
                
                if not lines: continue

                # Structural Metrics
                lengths = [len(line.split()) for line in lines]
                chaos = np.var(lengths)
                all_text = " ".join(lines)
                
                # Sentiment Metric
                sentiment_score = analyzer.polarity_scores(all_text)['compound']

                results.append({
                    "Poem": filename,
                    "Chaos": chaos,
                    "Sentiment": sentiment_score,
                    "Avg_Length": np.mean(lengths),
                    "Word_Count": len(all_text.split())
                })
            except Exception as e:
                print(f"Error reading {filename}: {e}")

    return pd.DataFrame(results)

def plot_chaos_vs_sentiment(df):
    plt.figure(figsize=(12, 8))
    sns.set_style("darkgrid")

    # X = Structural Chaos, Y = Emotional Sentiment
    plot = sns.scatterplot(
        data=df, 
        x="Chaos", 
        y="Sentiment", 
        size="Word_Count", 
        hue="Sentiment",
        palette="RdBu", # Red for negative, Blue for positive
        sizes=(100, 1000),
        alpha=0.6
    )

    # Add a horizontal line at 0 (Neutral Sentiment)
    plt.axhline(0, color='black', linestyle='--', alpha=0.3)

    # Label the outliers in the four corners
    # (Finding extremes of sentiment and chaos)
    outliers = pd.concat([
        df.nlargest(10, 'Chaos'),
        df.nlargest(10, 'Sentiment'),
        df.nsmallest(10, 'Sentiment')
    ]).drop_duplicates()

    for i, row in outliers.iterrows():
        plt.text(row.Chaos + 0.5, row.Sentiment, row.Poem, fontsize=7)

    plt.title("The Poetic Landscape: Structural Chaos vs. Emotional Sentiment", fontsize=18)
    plt.xlabel("Structural Chaos (Line-Length Variance)", fontsize=14)
    plt.ylabel("Sentiment (Negative <---> Positive)", fontsize=14)
    plt.show()

# --- RUN IT ---
path_to_my_xmls = '/Users/christopher.ohge/Desktop/GitHub/mel-website/xml/battle-pieces' 
df = analyze_tei_full(path_to_my_xmls)

if not df.empty:
    plot_chaos_vs_sentiment(df)