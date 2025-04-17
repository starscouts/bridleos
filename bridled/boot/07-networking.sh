#!/bin/sh

: ${cfgfile:="/etc/network/interfaces"}
: ${ifquery:="ifquery"}
: ${ifstate:="/run/ifstate"}

single_iface=

# find interfaces we want to start
find_ifaces() {
	if [ -n "$single_iface" ]; then
		echo $single_iface
		return 0
	fi

	if command -v "$ifquery" >/dev/null; then
		$ifquery -i "$cfgfile" --list -a
		return
	fi

	# fallback in case ifquery does not exist
	awk '$1 == "auto" {for (i = 2; i <= NF; i = i + 1) printf("%s ", $i)}' "$cfgfile"
}

# return the list of interfaces we should try stop
find_running_ifaces() {
	if [ -n "$single_iface" ]; then
		echo $single_iface
		return 0
	fi

	if command -v "$ifquery" >/dev/null; then
		$ifquery --state-file $ifstate -i "$cfgfile" --running
		return
	fi

	# fallback
	awk -F= '{print $2}' $ifstate
}

for iface in $(find_ifaces); do
  if ! ifup -i "$cfgfile" $iface >/dev/null; then
    ifdown -i "$cfgfile" $iface >/dev/null 2>&1
    r=1
  fi
done