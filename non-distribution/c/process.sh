#!/bin/bash

# Convert input to a stream of non-stopword terms
# Usage: ./process.sh < input > output

# Convert each line to one word per line, **remove non-letter characters**, make lowercase, convert to ASCII; then remove stopwords (inside d/stopwords.txt)
# Commands that will be useful: tr, iconv, grep

STOPWORDS_FILE="d/stopwords.txt"
tr -c '[:alpha:]' ' ' |    
tr '[:upper:]' '[:lower:]' |              
iconv -c -t ASCII//TRANSLIT |                            
tr -s ' ' '\n' |                          
grep -vFx -f "$STOPWORDS_FILE" | 
grep -v '^$'
