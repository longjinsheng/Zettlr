import { customTags } from '../util/custom-tags'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { php } from '@codemirror/lang-php'
import { python } from '@codemirror/lang-python'
import { LanguageSupport, StreamLanguage, Language, LanguageDescription } from '@codemirror/language'
import { frontmatterParser } from './frontmatter-parser'
import { inlineMathParser, blockMathParser } from './math-parser'

// Import all the languages
import { javascript, json, typescript } from '@codemirror/legacy-modes/mode/javascript'
import { c, cpp, csharp, java, kotlin, objectiveC, dart, scala } from '@codemirror/legacy-modes/mode/clike'
import { clojure } from '@codemirror/legacy-modes/mode/clojure'
import { elm } from '@codemirror/legacy-modes/mode/elm'
import { fSharp } from '@codemirror/legacy-modes/mode/mllike'
import { fortran } from '@codemirror/legacy-modes/mode/fortran'
import { haskell } from '@codemirror/legacy-modes/mode/haskell'
import { css, sCSS, less } from '@codemirror/legacy-modes/mode/css'
import { xml, html } from '@codemirror/legacy-modes/mode/xml'
import { stex } from '@codemirror/legacy-modes/mode/stex'
import { r } from '@codemirror/legacy-modes/mode/r'
import { ruby } from '@codemirror/legacy-modes/mode/ruby'
import { sql } from '@codemirror/legacy-modes/mode/sql'
import { swift } from '@codemirror/legacy-modes/mode/swift'
import { shell } from '@codemirror/legacy-modes/mode/shell'
import { vb } from '@codemirror/legacy-modes/mode/vb'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { go } from '@codemirror/legacy-modes/mode/go'
import { rust } from '@codemirror/legacy-modes/mode/rust'
import { julia } from '@codemirror/legacy-modes/mode/julia'
import { perl } from '@codemirror/legacy-modes/mode/perl'
import { turtle } from '@codemirror/legacy-modes/mode/turtle'
import { sparql } from '@codemirror/legacy-modes/mode/sparql'
import { verilog } from '@codemirror/legacy-modes/mode/verilog'
import { vhdl } from '@codemirror/legacy-modes/mode/vhdl'
import { tcl } from '@codemirror/legacy-modes/mode/tcl'
import { scheme } from '@codemirror/legacy-modes/mode/scheme'
import { commonLisp } from '@codemirror/legacy-modes/mode/commonlisp'
import { powerShell } from '@codemirror/legacy-modes/mode/powershell'
import { smalltalk } from '@codemirror/legacy-modes/mode/smalltalk'
import { toml } from '@codemirror/legacy-modes/mode/toml'
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile'
import { diff } from '@codemirror/legacy-modes/mode/diff'
import { octave } from '@codemirror/legacy-modes/mode/octave'
import { citationParser } from './citation-parser'
import { footnoteParser, footnoteRefParser } from './footnote-parser'
import { plainLinkParser } from './plain-link-parser'

const codeLanguages: Array<{ mode: Language|LanguageDescription|null, selectors: string[]}> = [
  {
    // Hear me out: There may be no mermaid syntax highlighting, BUT we need it
    // to be inside a 'FencedCode' Syntax node so that our renderer can pick it
    // up. By defining an empty StreamParser, we can ensure that there will be
    // such a structure, even if it's basically just plain text.
    mode: StreamLanguage.define({ token (stream, state) { stream.skipToEnd(); return null } }),
    selectors: ['mermaid']
  },
  {
    mode: StreamLanguage.define(javascript),
    selectors: [ 'javascript', 'js', 'node' ]
  },
  {
    mode: StreamLanguage.define(json),
    selectors: ['json']
  },
  {
    mode: StreamLanguage.define(typescript),
    selectors: [ 'typescript', 'ts' ]
  },
  {
    mode: StreamLanguage.define(c),
    selectors: ['c']
  },
  {
    mode: StreamLanguage.define(cpp),
    selectors: [ 'c\\+\\+', 'cpp' ]
  },
  {
    mode: StreamLanguage.define(csharp),
    selectors: [ 'c\\#', 'csharp', 'cs' ]
  },
  {
    mode: StreamLanguage.define(clojure),
    selectors: ['clojure']
  },
  {
    mode: StreamLanguage.define(elm),
    selectors: ['elm']
  },
  {
    mode: StreamLanguage.define(fSharp),
    selectors: [ 'f\\#', 'fsharp' ]
  },
  {
    mode: StreamLanguage.define(fortran),
    selectors: ['fortran']
  },
  {
    mode: StreamLanguage.define(java),
    selectors: ['java']
  },
  {
    mode: StreamLanguage.define(kotlin),
    selectors: [ 'kotlin', 'kt' ]
  },
  {
    mode: StreamLanguage.define(haskell),
    selectors: [ 'haskell', 'hs' ]
  },
  {
    mode: StreamLanguage.define(objectiveC),
    selectors: [ 'objective-c', 'objectivec', 'objc' ]
  },
  {
    mode: StreamLanguage.define(scala),
    selectors: ['scala']
  },
  {
    mode: StreamLanguage.define(css),
    selectors: ['css']
  },
  {
    mode: StreamLanguage.define(sCSS),
    selectors: ['scss']
  },
  {
    mode: StreamLanguage.define(less),
    selectors: ['less']
  },
  {
    mode: StreamLanguage.define(html),
    selectors: ['html']
  },
  {
    mode: markdownLanguage,
    selectors: [ 'markdown', 'md' ]
  },
  {
    mode: StreamLanguage.define(xml),
    selectors: ['xml']
  },
  {
    mode: StreamLanguage.define(stex),
    selectors: [ 'latex', 'tex' ]
  },
  {
    mode: php().language,
    selectors: ['php']
  },
  {
    mode: python().language,
    selectors: [ 'python', 'py' ]
  },
  {
    mode: StreamLanguage.define(r),
    selectors: ['r']
  },
  {
    mode: StreamLanguage.define(ruby),
    selectors: [ 'ruby', 'rb' ]
  },
  {
    mode: StreamLanguage.define(sql({})),
    selectors: ['sql']
  },
  {
    mode: StreamLanguage.define(swift),
    selectors: ['swift']
  },
  {
    mode: StreamLanguage.define(shell),
    selectors: [ 'shell', 'sh', 'bash' ]
  },
  {
    mode: StreamLanguage.define(vb),
    selectors: [ 'vb\\.net', 'vb', 'visualbasic' ]
  },
  {
    mode: StreamLanguage.define(yaml),
    selectors: [ 'yaml', 'yml' ]
  },
  {
    mode: StreamLanguage.define(go),
    selectors: ['go']
  },
  {
    mode: StreamLanguage.define(rust),
    selectors: [ 'rust', 'rs' ]
  },
  {
    mode: StreamLanguage.define(julia),
    selectors: [ 'julia', 'jl' ]
  },
  {
    mode: StreamLanguage.define(perl),
    selectors: [ 'perl', 'pl' ]
  },
  {
    mode: StreamLanguage.define(turtle),
    selectors: [ 'turtle', 'ttl' ]
  },
  {
    mode: StreamLanguage.define(sparql),
    selectors: ['sparql']
  },
  {
    mode: StreamLanguage.define(verilog),
    selectors: [ 'verilog', 'v' ]
  },
  // {
  //   mode: 'verilog',
  //   selectors: [ 'systemverilog', 'sv' ]
  // },
  {
    mode: StreamLanguage.define(vhdl),
    selectors: [ 'vhdl', 'vhd' ]
  },
  {
    mode: StreamLanguage.define(tcl),
    selectors: ['tcl']
  },
  {
    mode: StreamLanguage.define(scheme),
    selectors: ['scheme']
  },
  {
    mode: StreamLanguage.define(commonLisp),
    selectors: [ 'clisp', 'commonlisp' ]
  },
  {
    mode: StreamLanguage.define(powerShell),
    selectors: ['powershell']
  },
  {
    mode: StreamLanguage.define(smalltalk),
    selectors: [ 'smalltalk', 'st' ]
  },
  {
    mode: StreamLanguage.define(dart),
    selectors: [ 'dart', 'dt' ]
  },
  {
    mode: StreamLanguage.define(toml),
    selectors: [ 'toml', 'ini' ]
  },
  {
    mode: StreamLanguage.define(dockerFile),
    selectors: [ 'docker', 'dockerfile' ]
  },
  {
    mode: StreamLanguage.define(diff),
    selectors: ['diff']
  },
  {
    mode: StreamLanguage.define(octave),
    selectors: ['octave']
  }
]

// This file returns a syntax extension that provides parsing and syntax
// capabilities
export default function markdownParser (): LanguageSupport {
  return markdown({
    base: markdownLanguage,
    codeLanguages: (infoString) => {
      // First, remove potential curly braces from the info string and split it
      infoString = infoString.replace(/^\{(.+)\}$/, '$1')
      infoString = infoString.split(' ')[0] // First entry must be the language
      // Return an adequate language
      for (const entry of codeLanguages) {
        if (entry.selectors.includes(infoString)) {
          return entry.mode
        }
      }

      return null
    },
    extensions: {
      parseBlock: [
        // This BlockParser parses YAML frontmatters
        frontmatterParser,
        // This BlockParser parses math blocks
        blockMathParser,
        footnoteRefParser
      ],
      parseInline: [
        // Add inline parsers that add AST elements for various additional types
        inlineMathParser,
        footnoteParser,
        citationParser,
        plainLinkParser
      ],
      // We have to notify the markdown parser about the additional Node Types
      // that the YAML block parser utilizes
      defineNodes: [
        { name: 'YAMLFrontmatterStart', style: customTags.YAMLFrontmatterStart },
        { name: 'YAMLFrontmatterEnd', style: customTags.YAMLFrontmatterEnd },
        { name: 'YAMLFrontmatterKey', style: customTags.YAMLFrontmatterKey },
        { name: 'YAMLFrontmatterString', style: customTags.YAMLFrontmatterString },
        { name: 'YAMLFrontmatterBoolean', style: customTags.YAMLFrontmatterBoolean },
        { name: 'YAMLFrontmatterNumber', style: customTags.YAMLFrontmatterNumber },
        { name: 'YAMLFrontmatterPlain', style: customTags.YAMLFrontmatterPlain },
        { name: 'YAMLFrontmatterPair', style: customTags.YAMLFrontmatterPair },
        { name: 'YAMLFrontmatterSeq', style: customTags.YAMLFrontmatterSeq },
        { name: 'YAMLFrontmatterMap', style: customTags.YAMLFrontmatterMap },
        { name: 'Citation', style: customTags.Citation },
        { name: 'Footnote', style: customTags.Footnote },
        { name: 'FootnoteRef', style: customTags.FootnoteRef },
        { name: 'FootnoteBody', style: customTags.FootnoteBody }
      ]
    }
  })
}
