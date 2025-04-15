<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="tei">
    
    <!-- Output method: text -->
    <xsl:output method="text" encoding="UTF-8"/>
    
    <!-- Identity template for text content -->
    <xsl:template match="text()">
        <xsl:value-of select="normalize-space(.)"/>
    </xsl:template>
    
    <!-- Main entry point: TEI body -->
    <xsl:template match="tei:TEI">
        <xsl:apply-templates select=".//tei:body"/>
    </xsl:template>
    
    <!-- Body -->
    <xsl:template match="tei:body">
        <xsl:apply-templates/>
    </xsl:template>
    
    <!-- Paragraphs -->
    <xsl:template match="tei:p">
        <xsl:apply-templates/>
        <xsl:text>&#10;&#10;</xsl:text>
    </xsl:template>
    
    <!-- Headings -->
    <xsl:template match="tei:head">
        
        <xsl:apply-templates/>
        <xsl:text>&#10;&#10;</xsl:text>
    </xsl:template>
    
    <!-- Line breaks -->
    <xsl:template match="tei:lb">
        <xsl:text>&#10;</xsl:text>
    </xsl:template>
    
    <!-- Line elements -->
    <xsl:template match="tei:l">
        <xsl:apply-templates/>
        <xsl:text>&#10;</xsl:text>
    </xsl:template>
    
    <!-- Skip notes and metadata -->
    <xsl:template match="tei:note | tei:teiHeader">
        <!-- Do nothing -->
    </xsl:template>
    
</xsl:stylesheet>