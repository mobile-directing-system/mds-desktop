#!/usr/bin/zsh
UUID="$(cat /proc/sys/kernel/random/uuid)"
echo "['$UUID', {id: '$UUID', username: 'admin', first_name: 'admin', last_name: 'admin', is_admin: true, pass: 'admin'}],"
for NUM in {1..$1}
do
  UUID="$(cat /proc/sys/kernel/random/uuid)"
  FIRST_NAME="$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w 20 | head -n 1)"
  LAST_NAME="$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w 20 | head -n 1)"
  echo "['$UUID', {id: '$UUID', username: 'TestUser$NUM', first_name: '$FIRST_NAME', last_name: '$LAST_NAME', is_admin: false, pass: 'testpw'}],"
done
