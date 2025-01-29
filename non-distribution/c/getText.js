#!/usr/bin/env node

/*
Extract all text from an HTML page.
Usage: ./getText.js <input > output
*/

const {convert} = require('html-to-text');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
});

const htmlContent = []; // Buffer to store HTML input

rl.on('line', (line) => {
  // 1. Read HTML input from standard input, line by line using the `readline` module.
  htmlContent.push(line); // Append each line to the buffer
});

// 2. after all input is received, use convert to output plain text.
rl.on('close', () => {
  const plainText = convert(htmlContent.join('\n'));
  console.log(plainText);
  return plainText;
});


