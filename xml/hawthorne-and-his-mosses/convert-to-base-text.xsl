<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0" version="2.0">
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="tei:add">
        <hi rend="bold"><xsl:apply-templates/></hi>
    </xsl:template>
    
    <xsl:template match="tei:metamark"/>
    <xsl:template match="tei:del"/>
    <xsl:template match="tei:note"/>
    <xsl:strip-space elements="*"/>
    
</xsl:stylesheet>