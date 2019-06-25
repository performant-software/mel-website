---
layout: editions_two-columns
title: Transcription Coding
permalink: /transcription-coding
 
---
In transcribing the texts of the boxed revision sites, editors use TEI’s P5 version of XML codes to identify the revision elements and attributes for each site. Apart from being a standard in scholarly digital editing and digital humanities scholarship in general, TEI coding is essential for generating MEL’s diplomatic transcription and for nuanced searching of  _Billy Budd_  and the entire MEL corpus. TEI also ensures consistent formatting regardless of the user’s browser.

TEI elements and attributes enable nuanced description of both manuscript and manuscript inscriptions. Certain elements can be contained within other elements so that, for instance, the restored deletion of an added word is represented by a nesting of codes: &#60;restore&#62;&#60;del&#62;&#60;add&#62;WORD&#60;/add&#62;&#60;/del&#62;&#60;/restore&#62;. Elements also contain attributes that further define the code, indicating how text is render (@rend), where it is positioned (@place), by whom (@hand), and in what stage of composition (@change). Values for each attribute, such as @hand and @change, can be configured in the TEI header by the editor. Users can download MEL’s TEI transcription code through Juxta Editions.

In TextLab’s primary transcription mode, when the editor highlights a transcribed word and then clicks on its corresponding box in the leaf image, a dialogue box offers five initial elements:

-   add
-   delete
-   restore
-   overwrite
-   metamark

The &#60;add&#62; and &#60;del&#62; codes represent any grouping of inserted or cancelled words, respectively. Sometimes Melville restores a deletion, generally by placing dots or dashes beneath the deleted word, and we indicate a restoration by surrounding the &#60;del&#62; with the &#60;restore&#62; code.

Occasionally, Melville alters a word into another word by adding letters or reshaping the original word’s letters. While this kind of “overwriting” happens at the letter level and can involve more than one letter alteration, it is essentially a single revision event that superimposes the addition of one word over the deletion of another. To represent this condition, we use TEI’s &#60;subst&#62; code (for “substitution”), which bundles a &#60;del&#62; and &#60;add&#62; as one unit. But rather than coding such overwritten words at the hyper-granular letter level, we code instead at the word level. That is, if Melville alters the word “is” to “was” by inscribing “wa” over the “i” in “is,” we code the event as the substitution of “was” for “is.” Our decision to follow this strategy has more to do with future searching of MEL’s  _Billy Budd_  database than with attention to detail. If letters not words were coded for our transcription of Melville’s overwritten words, a search of all &#60;subst&#62; codes would yield sets of letters—in this case,  _i_  and  _wa_—that have no discernible context or meaning. But because we code at the word level, such a search would return  _is_  and  _was_, and an immediately understandable context for the revision, in this case a shift in tense. Because the search would also identify the revision site by leaf, the searcher can turn to the leaf image to discern how the overwriting occurred. In this way, word-level context and letter-level inscription are equally available.

Metamarks are inscriptions not intended for publication and generally pertain to composition information, such as folios (leaf numbers), carets and other insertion devices, section dividers, and composition information, such as pointers, squiggles, date entries, or written instructions like “insert here.”

Each of these five TEI elements have their own attribute options, which include inscription descriptors designated by Hayford and Sealts (HS) in their 1962 transcription of  _Billy Budd_.

-   Insertions may be placed in line, above or below it, or in margins.
-   Insertions may be rendered with or without caret and/or in a bubble.
-   Deletions may be achieved by strike through, multi-strike, hashmark, or erasure.
-   Metamarks may represent folio, caret, half-caret, insertion device, and composition instruction.
-   Insertions and deletions may appear on different pieces of paper, as designated by HS:
    -   Clip: a slice of text cut away from a leaf composed at an earlier stage and straight-pinned to a later leaf.
    -   Patch: a slice of text composed in one stage and affixed to a leaf composed at an earlier stage.
    -   Mount: a leaf (often full-length) to which clips or patches are attached, which might also include text of its own.
-   Inscription and deletions may be rendered by different hands:
    -   Herman Melville
    -   His wife Elizabeth Shaw Melville
    -   The editor Raymond Weaver
    -   The staff of Houghton Library
-   Inscription and deletions may be composed in different media
    -   Pencil
    -   Ink (black, gray, brown, blue)
    -   Crayon (green, red, orange, blue)
-   Stages and sub-stages of composition for folios and revisions follow HS designations.

TextLab automatically inserts these TEI element and attribute codes around the editor’s manually transcribed text. TextLab also links the coded revision text to its corresponding, boxed revision site and the entire leaf transcription to its corresponding leaf image.

An overwhelming benefit of TEI coding, as indicated in the discussion of overwriting above, is its facilitation of research. In editing  _Billy Budd_, we have used TEI codes to register the stages and sub-stages of composition that Hayford and Sealts assigned to leaves and revisions, if for no other reason than to enable searches that would cluster revisions not by leaf but by sub-stage, in order to analyze Melville’s revision behaviors. Future scholars can test the excellent work of the HS transcription against their own findings to modify or augment these stages of composition. The coding will also enable us to realize MEL’s projected visualization, titled  _How Billy Grew_, that displays the macro-revision of  _Billy Budd_, in eight stages, from ballad to novella, and permits users to drill down in each stage to the micro-revisions of the sub-stage leaf level, as recorded by TextLab.