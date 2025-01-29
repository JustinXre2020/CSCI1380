#!/usr/bin/env node

/*
Search the inverted index for a particular (set of) terms.
Usage: ./query.js your search terms

The behavior of this JavaScript file should be similar to the following shell pipeline:
grep "$(echo "$@" | ./c/process.sh | ./c/stem.js | tr "\r\n" "  ")" d/global-index.txt

Here is one idea on how to develop it:
1. Read the command-line arguments using `process.argv`. A user can provide any string to search for.
2. Normalize, remove stopwords from and stem the query string — use already developed components
3. Search the global index using the processed query string.
4. Print the matching lines from the global index file.

Examples:
./query.js A     # Search for "A" in the global index. This should return all lines that contain "A" as part of an 1-gram, 2-gram, or 3-gram.
./query.js A B   # Search for "A B" in the global index. This should return all lines that contain "A B" as part of a 2-gram, or 3-gram.
./query.js A B C # Search for "A B C" in the global index. This should return all lines that contain "A B C" as part of a 3-gram.

Note: Since you will be removing stopwords from the search query, you will not find any matches for words in the stopwords list.

The simplest way to use existing components is to call them using execSync.
For example, `execSync(`echo "${input}" | ./c/process.sh`, {encoding: 'utf-8'});`
*/


const fs = require('fs');
const {execSync} = require('child_process');
const path = require('path');


function query(indexFile, args) {
  // Step 1: Process the query string
  const queryString = args.join(' '); // Combine all arguments into a single string
  try {
    // Normalize, remove stopwords, and stem the query using external scripts
    const processedQuery = execSync(`echo "${queryString}" | ./c/process.sh | ./c/stem.js | tr "\r\n" " "`, {
      encoding: 'utf-8',
    }).trim();

    if (!processedQuery) {
      console.error('Error: Query processing returned an empty result.');
      return;
    }

    // Step 2: Read and search the global index
    const indexContent = fs.readFileSync(path.resolve(indexFile), 'utf-8'); // Read the global index file
    const indexLines = indexContent.split('\n'); // Split the index into lines

    // Filter lines that contain the processed query
    const matchingLines = indexLines.filter((line) => line.includes(processedQuery));

    // Step 3: Print matching lines
    if (matchingLines.length > 0) {
      console.log(matchingLines.join('\n')); // Print all matching lines
    } else {
      console.log(`No matches found for query: "${queryString}"`);
    }
  } catch (error) {
    console.error('Error during query processing:', error.message);
  }
}

const args = process.argv.slice(2); // Get command-line arguments
if (args.length < 1) {
  console.error('Usage: ./query.js [query_strings...]');
  process.exit(1);
}

const indexFile = 'd/global-index.txt'; // Path to the global index file
query(indexFile, args);
