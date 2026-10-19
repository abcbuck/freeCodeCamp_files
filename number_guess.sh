#!/bin/bash

PSQL="psql -U freecodecamp -d number_guess -t --no-align -c"

# generate random number from uniform distribution
NUMBER=$RANDOM
while [[ $NUMBER -ge 32000 ]]; do
  NUMBER=$RANDOM
done
NUMBER=$(( $NUMBER % 1000 ))

echo -n "Enter your username: "
read USERNAME
QUERY=$($PSQL "SELECT name FROM users WHERE name = '$USERNAME'")
if [[ -z $QUERY ]]; then
  echo Welcome, $USERNAME! It looks like this is your first time here.
  $PSQL "INSERT INTO users (name) VALUES ('$USERNAME')" > /dev/null
else
  IFS="|" read GAMES_PLAYED BEST_GAME <<< $($PSQL "SELECT games_played, best_game FROM users WHERE name = '$USERNAME'")
  echo -n Welcome back, $USERNAME! You have played $GAMES_PLAYED games
  if [[ -z $BEST_GAME ]]; then
    echo .
  else
    echo ", and your best game took $BEST_GAME guesses."
  fi
fi

GUESS=-1
NUMBER_OF_GUESSES=0
echo -n "Guess the secret number between 1 and 1000: "
while [[ $GUESS != $NUMBER ]]; do
  read GUESS
  while [[ ! $GUESS =~ [[:digit:]]+ ]]; do
    echo -n "That is not an integer, guess again: "
    read GUESS
  done
  NUMBER_OF_GUESSES=$((NUMBER_OF_GUESSES+1))
  if [[ $GUESS -gt $NUMBER ]]; then
    echo -n "It's lower than that, guess again: "
  elif [[ $GUESS -lt $NUMBER ]]; then
    echo -n "It's higher than that, guess again: "
  else
    echo You guessed it in $NUMBER_OF_GUESSES tries. The secret number was $NUMBER. Nice job!
    break
  fi
done
if [[ -z $BEST_GAME ]]; then
  $PSQL "UPDATE users SET (games_played, best_game) = ($((GAMES_PLAYED+1)), $NUMBER_OF_GUESSES)" > /dev/null
else
  $PSQL "UPDATE users SET (games_played, best_game) = ($((GAMES_PLAYED+1)), $((BEST_GAME<NUMBER_OF_GUESSES?BEST_GAME:NUMBER_OF_GUESSES)))" > /dev/null
fi
