#!/usr/bin/zsh
for NUM in {1..$1}
do
  UUID="$(cat /proc/sys/kernel/random/uuid)"
  TITLE="$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w 20 | head -n 1)"
  DESCRIPTION="$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w 20 | head -n 1)"
  TIME="$(($(date +%s) + $(shuf -i 0-2592000 -n 1)))"
  END_OFFSET="$(shuf -i 1-43200 -n 1)"
  ARCHIVED="$([[ $(shuf -i 0-1 -n 1) = 1  ]] && echo "true" || echo "false")"
  echo "['$UUID', {id: '$UUID', title: '$TITLE', description: '$DESCRIPTION', start: new Date($TIME), end: new Date($(($TIME + $END_OFFSET))), is_archived: $ARCHIVED}],"
done

