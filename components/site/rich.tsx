import React from 'react';

/** Acronyms set in small caps: RBC, AI, AKS, IaC and the like */
const ABBR = /\b([A-Z]{2,}s?|IaC)\b/;

/** Typesets copy: text between backticks becomes inline code, acronyms small caps */
export const rich = (text: string) =>
    text.split('`').flatMap((part, i) =>
        i % 2
            ? [<code key={`c${i}`}>{part}</code>]
            : part.split(new RegExp(ABBR.source, 'g')).map((bit, j) =>
                  j % 2 ? (
                      <abbr key={`a${i}-${j}`} className="sc">
                          {bit}
                      </abbr>
                  ) : (
                      bit
                  ),
              ),
    );
