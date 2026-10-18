#!/bin/bash
# script to query data from the database
PSQL="psql -U freecodecamp -d periodic_table -t --no-align -c"

if [[ -z $1 ]]; then
  echo Please provide an element as an argument.
else
  # argument is a number
  if [[ 0 -lt $1 ]]; then
    QUERY_RESULT=$($PSQL "SELECT * FROM elements INNER JOIN properties USING (atomic_number) INNER JOIN types USING (type_id) WHERE atomic_number = $1")
  elif [[ ${#1} -le 2 ]]; then
    QUERY_RESULT=$($PSQL "SELECT * FROM elements INNER JOIN properties USING (atomic_number) INNER JOIN types USING (type_id) WHERE symbol = '$1'")
  else
    QUERY_RESULT=$($PSQL "SELECT * FROM elements INNER JOIN properties USING (atomic_number) INNER JOIN types USING (type_id) WHERE name = '$1'")
  fi
  if [[ -z $QUERY_RESULT ]]; then
    echo I could not find that element in the database.
  else
    echo $QUERY_RESULT | while IFS="|" read TYPE_ID ATOMIC_NUMBER SYMBOL NAME ATOMIC_MASS MELTING_POINT_CELSIUS BOILING_POINT_CELSIUS TYPE; do
      echo "The element with atomic number $ATOMIC_NUMBER is $NAME ($SYMBOL). It's a $TYPE, with a mass of $ATOMIC_MASS amu. $NAME has a melting point of $MELTING_POINT_CELSIUS celsius and a boiling point of $BOILING_POINT_CELSIUS celsius."
    done
  fi
fi
