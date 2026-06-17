#!/bin/bash

# Define the output file and the new root element
OUTPUT_FILE="merged_lw.xml"
ROOT_TAG="combined_data"

# Write the opening XML declaration and the new root tag to the output file
echo '<?xml version="1.0" encoding="UTF-8"?>' > "$OUTPUT_FILE"
echo "<${ROOT_TAG}>" >> "$OUTPUT_FILE"

# Loop through ONLY files ending in lw.xml
for file in *lw.xml; do
    # Safety check: If no files match the pattern, 'file' becomes literally "*lw.xml"
    if [[ ! -e "$file" ]]; then
        echo "No files ending in 'lw.xml' were found in this directory."
        # Remove the partially created output file and exit
        rm "$OUTPUT_FILE"
        exit 1
    fi

    # Skip the output file if it happens to be caught in the loop
    if [[ "$file" == "$OUTPUT_FILE" ]]; then
        continue
    fi
    
    echo "Processing $file..."
    
    # Use sed to delete the XML declaration line and append the rest to our output
    sed '/<?xml/d' "$file" >> "$OUTPUT_FILE"
done

# Close the root tag
echo "</${ROOT_TAG}>" >> "$OUTPUT_FILE"

echo "Done! Target files merged into $OUTPUT_FILE"