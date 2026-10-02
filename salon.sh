#!/bin/bash

PSQL="psql -U freecodecamp -d salon -Atc"

echo -e "\n~~~ Great Salon ~~~"
MAIN_MENU() {
  echo -e "\nPlease select a service to book:"
  $PSQL "SELECT * FROM services" | while IFS="|" read SERVICE_ID NAME; do
    echo "$SERVICE_ID) $NAME"
  done
  echo -n "> "
  read SERVICE_ID_SELECTED
  SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id = $SERVICE_ID_SELECTED")
  if [[ -z $SERVICE_NAME ]]; then
    MAIN_MENU
  else
    echo -ne "Please enter your phone number:\n> "
    read CUSTOMER_PHONE
    IFS="|" read CUSTOMER_ID CUSTOMER_NAME <<< $($PSQL "SELECT customer_id, name FROM customers WHERE phone = '$CUSTOMER_PHONE'")
    if [[ -z $CUSTOMER_NAME ]]; then
      echo -ne "Please enter your name:\n> "
      read CUSTOMER_NAME
      $PSQL "INSERT INTO customers (phone, name) VALUES ('$CUSTOMER_PHONE', '$CUSTOMER_NAME')" > /dev/null
      CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone = '$CUSTOMER_PHONE'")
    fi
    echo -ne "Hello, $CUSTOMER_NAME!\nAt what time do you want to book '$SERVICE_NAME'?\n> "
    read SERVICE_TIME
    $PSQL "INSERT INTO appointments (customer_id, service_id, time) VALUES ($CUSTOMER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME')" > /dev/null
    echo "I have put you down for a $SERVICE_NAME at $SERVICE_TIME, $CUSTOMER_NAME."
  fi
}
MAIN_MENU
