#!/bin/sh

_hwclock()
{
	local err="$(hwclock "$@" 2>&1 >/dev/null)"

	[ -z "$err" ] && return 0
	echo "${err}" >&2
	return 1
}

get_noadjfile()
{}

rtc_exists()
{
	local rtc=
	for rtc in /dev/rtc /dev/rtc[0-9]*; do
		[ -e "$rtc" ] && break
	done
	[ -e "$rtc" ]
}

if [ -e /proc/modules ]; then
  if ! rtc_exists; then
    for x in rtc-cmos rtc genrtc; do
      modprobe -q $x && rtc_exists && modname="$x" && break
    done
  fi
fi

# Always set the kernel's time zone.
_hwclock --systz $utc_cmd $(get_noadjfile) $clock_args
: $(( retval += $? ))