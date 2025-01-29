#!/bin/bash
# This is a student test

T_FOLDER=${T_FOLDER:-t}
R_FOLDER=${R_FOLDER:-}

cd "$(dirname "$0")/..$R_FOLDER" || exit 1

DIFF=${DIFF:-diff}

# use d1.txt and d2.txt
if $DIFF <(cat "$T_FOLDER"/d/d1.txt | c/getText.js | sort) <(sort "$T_FOLDER"/d/d2.txt) >&2;
then
    echo "$0 success: texts are identical"
    exit 0
else
    echo "$0 failure: texts are not identical"
    exit 1
fi

