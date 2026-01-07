import os
import re
import numpy as np
import pandas as pd
from lxml import etree
import matplotlib.pyplot as plt
import seaborn as sns

def analyze_tei_chaos(directory_path):
    ns = {'tei': 'http://www.tei-c.org/ns/1.0'}
    results = []

    for filename in os.listdir(directory_path):
        if filename.endswith(".xml"):
            try:
                tree = etree.parse(os.path.join(directory_path, filename))
                lines = [str(l).strip() for l in tree.xpath('//tei:l/text()', namespaces=ns) if l.strip()]
                
                if not lines: continue

                lengths = [len(line.split()) for line in lines]
                all_text = " ".join(lines)
                punc_count = len(re.findall(r'[^\w\s]', all_text))
                word_count = len(all_text.split())

                results.append({
                    "Poem": filename,
                    "Chaos": np.var(lengths),
                    "Punc_Density": punc_count / word_count if word_count > 0 else 0,
                    "Avg_Length": np.mean(lengths)
                })
            except Exception as e:
                print(f"Error reading {filename}: {e}")

    return pd.DataFrame(results)

def plot_poetry_analysis(df):
    plt.figure(figsize=(12, 8))
    sns.set_style("whitegrid")

    # Create the scatter plot
    scatter = sns.scatterplot(
        data=df, 
        x="Chaos", 
        y="Punc_Density", 
        size="Avg_Length", # Dot size represents average line length
        hue="Avg_Length",  # Color represents average line length
        palette="viridis",
        sizes=(150, 800),
        alpha=0.7
    )

    # Label the outliers (Top 10 most chaotic or dense)
    # This helps you identify which file is which on the graph
    outliers = df.nlargest(10, 'Chaos').append(df.nlargest(10, 'Punc_Density'))
    for i in range(outliers.shape[0]):
        plt.text(
            outliers.Chaos.iloc[i]+0.2, 
            outliers.Punc_Density.iloc[i], 
            outliers.Poem.iloc[i], 
            fontsize=8, alpha=0.6
        )

    plt.title("Poetic Structure: Chaos vs. Punctuation Density", fontsize=16)
    plt.xlabel("Line-Length Variance (Chaos)", fontsize=12)
    plt.ylabel("Punctuation Density (Choppiness)", fontsize=12)
    plt.show()

# --- RUN IT ---
path_to_my_xmls = '/Users/christopher.ohge/Desktop/GitHub/mel-website/xml/battle-pieces' 
df = analyze_tei_chaos(path_to_my_xmls)

if not df.empty:
    plot_poetry_analysis(df)