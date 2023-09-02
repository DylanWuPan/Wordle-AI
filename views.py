from flask import Blueprint, render_template, jsonify, request
import json
from main import *

views = Blueprint(__name__, "views")

@views.route("/")

def home():
    return render_template("index.html")

@views.route('/submit', methods=['GET', 'POST'])
def submit():
    wordlistFile = "wordlist.txt"
    newData = request.form
    guessNum = int(newData["guessNum"])
    wordlist = json.loads(newData["wordlist"])

    if guessNum == 1:
        wordlist = loadWords(wordlistFile)
        distribution = letterDistribution(wordlist)

    if newData["startWord"] == "false":
        word = newData["word"]
        state = newData["state"]

        results = dict()

        for i in range(5):
            results[i] = {"letter": word[i], "result": int(state[i])}
        
        wordlist = updateWordlist(wordlist, results)
        distribution = updateDistribution(wordlist, word, state)
        newWord = findWord(wordlist, distribution)

        if newWord == None:
            newWord = ""
        if wordlist == None:
            wordlist = []

    elif newData["startWord"] == "true": 
        newWord = findWord(wordlist, distribution)

    response = {"word": newWord, "wordlist": wordlist}
    return response