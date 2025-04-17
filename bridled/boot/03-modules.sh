#!/bin/sh
for f in /lib/modules-load.d/*.conf \
  /usr/lib/modules-load.d/*.conf; do

  if ! [ -f "$f" ]; then
    continue
  fi

  if  [ -f /etc/modules-load.d/"${f##*/}" ]; then
    continue
  fi

  if [ -f /run/modules-load.d/"${f##*/}" ]; then
    continue
  fi

  sed -e 's/\#.*//g' -e '/^[[:space:]]*$/d' < "$f" \
    | while read module args; do
    modprobe -q $module $args
  done
done

if [ -f /etc/modules ]; then
  sed -e 's/\#.*//g' -e '/^[[:space:]]*$/d' < /etc/modules \
    | while read module args; do
    modprobe -q $module $args
  done
fi

for f in /etc/modules-load.d/*.conf; do
  if [ ! -f "$f" ]; then
    continue
  fi

  if [ -f /run/modules-load.d/"${f##*/}" ]; then
    continue
  fi

  sed -e 's/\#.*//g' -e '/^[[:space:]]*$/d' < "$f" \
    | while read module args; do
    modprobe -q $module $args
  done
done

for f in /run/modules-load.d/*.conf; do
  if [ ! -f "$f" ]; then
    continue
  fi

  sed -e 's/\#.*//g' -e '/^[[:space:]]*$/d' < "$f" \
    | while read module args; do
    modprobe -q $module $args
  done
done