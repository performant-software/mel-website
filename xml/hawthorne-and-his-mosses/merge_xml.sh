#!/bin/bash

# Define output file
output_file="merged.xml"

# Create the root element for the merged XML
echo '<?xml version="1.0" encoding="UTF-8"?>' > "$output_file"
echo "<root>" >> "$output_file"  # Root element that wraps all files

# Loop through each XML file passed as argument
for file in "$@"
do
  # Remove the XML declaration from each file and append the content to the output
  sed '1d;$d' "$file" >> "$output_file"  # Remove first (declaration) and last (root closing) lines
done

# Close the root element
echo "</root>" >> "$output_file"

echo "Merged XML content into $output_file"
