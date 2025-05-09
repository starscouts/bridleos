#!/bin/sh
for f in /lib/sysctl.d/*.conf \
  /usr/lib/sysctl.d/*.conf; do

  if  [ -f /etc/sysctl.d/"${f##*/}" ]; then
    veinfo "Ignoring $f due to /etc/sysctl.d/${f##*/}"
    continue
  fi

  if [ -f /run/sysctl.d/"${f##*/}" ]; then
    veinfo "Ignoring $f due to /run/sysctl.d/${f##*/}"
    continue
  fi

  if [ -f "$f" ]; then
    vebegin "applying $f"
    sysctl $quiet -p "$f"
    status=$?
    if [ $status -gt 0 ]; then
      # Don't change retval= since we expect some package/distro provided
      # sysctl configurations to break, so just warn when the user wants
      # verbose messages
      vewarn "Unable to configure kernel parameters from $f"
    fi
  fi
done

for f in /etc/sysctl.d/*.conf; do

  if [ -f /run/sysctl.d/"${f##*/}" ]; then
    veinfo "Ignoring $f due to /run/sysctl.d/${f##*/}"
    continue
  fi

  if [ -f "$f" ]; then
    vebegin "applying $f"
    sysctl $quiet -p "$f"
    status=$?
    if [ $status -gt 0 ]; then
      retval=$(( $retval + $status ))
      eerror "Unable to configure kernel parameters from $f"
    fi
  fi
done

if [ -f /etc/sysctl.conf ]; then
  vebegin "applying /etc/sysctl.conf"
  sysctl $quiet -p /etc/sysctl.conf
  status=$?
  if [ $status -gt 0 ]; then
    retval=$(( $retval + $status ))
    eerror "Unable to configure kernel parameters from /etc/sysctl.conf"
  fi
fi

for f in /run/sysctl.d/*.conf; do
  if [ -f "$f" ]; then
    vebegin "applying $f"
    sysctl $quiet -p "$f"
    status=$?
    if [ $status -gt 0 ]; then
      retval=$(( $retval + $status ))
      eerror "Unable to configure kernel parameters from $f"
    fi
  fi
done