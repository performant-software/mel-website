import os
import xml.etree.ElementTree as ET

def merge_xml_files(input_folder, output_file, root_tag='MergedData', item_tag='Item'):
    merged_root = ET.Element(root_tag)

    for filename in os.listdir(input_folder):
        if filename.endswith('.xml'):
            file_path = os.path.join(input_folder, filename)
            tree = ET.parse(file_path)
            root = tree.getroot()

            for child in root:
                # Clone the element into the new tree
                merged_root.append(child)

    # Write merged tree to output file
    merged_tree = ET.ElementTree(merged_root)
    merged_tree.write(output_file, encoding='utf-8', xml_declaration=True)

    print(f'Merged XML files saved to: {output_file}')

# Example usage
merge_xml_files('path/to/your/xml/folder', 'merged_output.xml')
