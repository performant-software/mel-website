import os
import re
import numpy as np
import pandas as pd
from lxml import etree

def analyze_tei_chaos(directory_path):
    ns = {'tei': 'http://www.tei-c.org/ns/1.0'}
    results = []

    # Check if directory exists
    if not os.path.exists(directory_path):
        print(f"Error: The folder '{directory_path}' was not found.")
        return None

    for filename in os.listdir(directory_path):
        if filename.endswith(".xml"):
            file_path = os.path.join(directory_path, filename)
            try:
                tree = etree.parse(file_path)
                # This extracts the text from all <l> tags
                lines = [str(l).strip() for l in tree.xpath('//tei:l/text()', namespaces=ns) if l.strip()]
                
                if not lines:
                    continue

                # 1. Line Length Variance
                lengths = [len(line.split()) for line in lines]
                line_variance = np.var(lengths)
                avg_length = np.mean(lengths)

                # 2. Punctuation Density
                all_text = " ".join(lines)
                punctuation_count = len(re.findall(r'[^\w\s]', all_text))
                word_count = len(all_text.split())
                punc_density = punctuation_count / word_count if word_count > 0 else 0

                results.append({
                    "Poem": filename,
                    "Total Lines": len(lines),
                    "Avg Line Length": round(avg_length, 2),
                    "Chaos (Variance)": round(line_variance, 2),
                    "Punc Density": round(punc_density, 3)
                })
            except Exception as e:
                print(f"Could not read {filename}: {e}")

    return pd.DataFrame(results)

# --- EXECUTION AREA ---
# UPDATE THIS PATH to your folder
path_to_my_xmls = '/Users/christopher.ohge/Desktop/GitHub/mel-website/xml/battle-pieces' 

df = analyze_tei_chaos(path_to_my_xmls)

if df is not None:
    # Sort by the most chaotic poems first
    df = df.sort_values(by="Chaos (Variance)", ascending=False)
    
    print("\n--- Structural Analysis Results ---")
    print(df.to_string(index=False))
    
# Optional: Save to a spreadsheet
df.to_csv("poetry_analysis_results.csv", index=False)

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
        sizes=(40, 400),
        alpha=0.7
    )