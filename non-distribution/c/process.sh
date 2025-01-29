#!/bin/bash

# Convert input to a stream of non-stopword terms
# Usage: ./process.sh < input > output

# Convert each line to one word per line, **remove non-letter characters**, make lowercase, convert to ASCII; then remove stopwords (inside d/stopwords.txt)
# Commands that will be useful: tr, iconv, grep

STOPWORDS_FILE="d/stopwords.txt"
cat /dev/stdin | \
  tr '[:upper:]' '[:lower:]' | \        # make lowercase
  tr -cd '[:alpha:]\n' | \              # remove non-letter characters
  iconv -f utf8 -t ascii//TRANSLIT | \  # convert to ASCII
  grep -wvf "$STOPWORDS_FILE"           # remove stopwords