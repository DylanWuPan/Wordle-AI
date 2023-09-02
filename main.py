#Wordle AI

import string
import copy
import sys

wordlistFile = "wordlist.txt"

def loadWords(wordlistFile):
    wordlist = open(wordlistFile, "r")
    wordlist = wordlist.read()
    words = wordlist.split(', ')
    return words

def findMax(distribution):
    max = float("-inf")
    maxLetter = ""
    for letter in distribution:
        if distribution[letter] > max:
            max = distribution[letter]
            maxLetter = letter
    return maxLetter, max

def sortDistribution(distribution):
    sorted = dict()
    distributionCopy = copy.deepcopy(distribution)
    for i in range(26):
        max = findMax(distributionCopy)
        sorted[max[0]] = max[1]
        distributionCopy.pop(max[0])
    return sorted

def letterDistribution(wordlist):
    distribution = dict()
    alphabet = string.ascii_lowercase
    for letter in alphabet:
        distribution[letter] = 0
    for word in wordlist:
        for letter in word:
            distribution[letter] += 1
    return sortDistribution(distribution)

def findWord(wordlist, distribution, indices = [0, 1, 2, 3, 4], modIndex = 4, modIndex2 = 3):
    #ISSUES:
        #Repeat letters
        #Multi letter variation from distribution
    # New Process:
        #Instead of making words, test existing words, give score based on distribution
        #
    letters = list()
    for i in indices:
        letters.append(list(distribution.keys())[i])
    for word in wordlist:
        found = True
        for letter in letters:
            if letter not in word:
                found = False
        if found == True:
            return word

    if list(distribution.values())[modIndex] != float("inf"):
        if indices[modIndex] == 25:
            if modIndex != 0:
                indices[modIndex] = modIndex
                modIndex -= 1
                if modIndex == modIndex2:
                    modIndex -= 1
            else:
                indices[modIndex2] += 1
                modIndex = 4
        else:
            indices[modIndex] += 1
    else:
        if len(wordlist) > 0:
            print("RANDOM")
            ##Could create filter here
            return wordlist[0]
        return None
    
    return findWord(wordlist, distribution, indices, modIndex)
            
def updateDistribution(wordlist, lastGuess, update):
    distribution = letterDistribution(wordlist)
    for i in range(5):
        if int(update[i]) == 0:
            if distribution[lastGuess[i]] != float("inf"):
                distribution[lastGuess[i]] = 0
        else:
            distribution[lastGuess[i]] = float("inf")
    return sortDistribution(distribution)

def updateWordlist(wordlist, results):
    newWordlist = list()
    for word in wordlist:
        fits = True
        for index in results:
            if results[index]["result"] == 2:
                if word[index] != results[index]["letter"]:
                    fits = False
            elif results[index]["result"] == 1:
                if results[index]["letter"] not in word or results[index]["letter"] == word[index]:
                    fits = False
            elif results[index]["result"] == 0:
                if results[index]["letter"] in word:
                    fits = False
                ##ISSUE: If guess contains multiple instances of letter, program eliminates words with that letter
        if fits == True:
            newWordlist.append(word)
    return newWordlist
    
def main():
    win = False
    wordlist = loadWords(wordlistFile)
    distribution = letterDistribution(wordlist)
    guesses = 0

    while guesses <= 6:

        response = input("Choose word: ")
        if response == "":
            word = findWord(wordlist, distribution)
            print(word)
            lastGuess = word
        elif response == "x":
            sys.exit()
        else:
            lastGuess = response
            print(lastGuess)
        guesses += 1

        update = input("Enter response to last guess [0 = Gray, 1 = Yellow, 2 = Green]: \n")
        if update == "22222":
            print("--------------------------------")
            break
        elif response == "x":  
            sys.exit()

        results = dict()

        for i in range(5):
            results[i] = {"letter": lastGuess[i], "result":int(update[i])}
        
        wordlist = updateWordlist(wordlist, results)
        distribution = updateDistribution(wordlist, lastGuess, update)
        print("Remaining words: " + str(len(wordlist)))
    main()

if __name__ == "__main__":
    main()