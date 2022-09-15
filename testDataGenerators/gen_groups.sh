#!/usr/bin/zsh
for NUM in {1..$1}
do
  UUID="$(cat /proc/sys/kernel/random/uuid)"
  DESCRIPTION="$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w 20 | head -n 1)"
  echo "['$UUID', {id: '$UUID', title: 'TestGroup$NUM', description: '$DESCRIPTION', members:[]}],"
done
