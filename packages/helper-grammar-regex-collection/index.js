import regex from './regex';

export { default as go } from './go.js';

const captureQuotedWord = regex`
  ['"]            # beginning quote
  (?<$1>[^'"\s]+) # capture the word inside the quotes
  ['"]            # end quote
`;

const importMembers = regex`[\r\n\s\w{},*\$]*`;
const from = regex`\s from \s`;

export const REQUIRE = regex`
  ( require(\.resolve)? | import )
  \s* ( \s | \( ) \s*
  ${captureQuotedWord}
`;

export const IMPORT = regex`
  import \s ${importMembers}
  ${from}?
  ${captureQuotedWord}
`;

export const EXPORT = regex`
  export \s ${importMembers}
  ${from}
  ${captureQuotedWord}
`;

export const GEM = regex`
  gem \s ${captureQuotedWord}
`;

export const HOMEBREW = regex`
  (depends_on|conflicts_with)
  ( \s cask: | \s formula: )?
  \s
  ${captureQuotedWord}
`;

export const TYPESCRIPT_REFERENCE = regex`
  \/{3} \s?
  <reference \s path=${captureQuotedWord}
`;

export const DOCKER_FROM = regex`
  FROM \s (?<$1>[^\n]*)
`;

export const VIM_PLUGIN = regex`
  (
    (
      (Neo)?
      Bundle
      (Lazy|Fetch)?
    )
    |
    Plug(in)?
  ) \s
  ${captureQuotedWord}
`;

export const RUST_CRATE = regex`
  \b (extern \s crate | use)
  \s
  (?<$1>[^:;\s]+)
`;

export const PYTHON_IMPORT = regex`
  ^\s*
  (import|from)
  \s
  (?<$1>[^\s]*)
`;

export const HASKELL_IMPORT = regex`
  ((^|\s)import\s+(qualified\s)?)
  (?<$1> [A-Z][\w.]+)
`;

export const CSS_IMPORT = regex`
  ^\s*
  @import
  \s
  ((url|URL)\()?
  ${captureQuotedWord}
`;

export const HTML_IMPORT = regex`
  ^\s*
  <link
  \s
  rel="import"
  \s
  href=${captureQuotedWord}>
`;
