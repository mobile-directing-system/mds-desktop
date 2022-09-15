#!/usr/bin/zsh
for NUM in {1..$1}
do
  UUID="$(cat /proc/sys/kernel/random/uuid)"
  DESCRIPTION="$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w 20 | head -n 1)"
  TIME="$((($(date +%s) + $(shuf -i 0-2592000 -n 1)) * 1000  ))"
  END_OFFSET="$(($(shuf -i 120-43200 -n 1) * 1000))"
  ARCHIVED="$([[ $(shuf -i 0-1 -n 1) = 1  ]] && echo "true" || echo "false")"
  echo "['$UUID', {id: '$UUID', title: 'TestOperation$NUM', description: '$DESCRIPTION', start: new Date($TIME), end: new Date($(($TIME + $END_OFFSET))), is_archived: $ARCHIVED}],"
done

