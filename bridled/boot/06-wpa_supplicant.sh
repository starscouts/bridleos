#!/bin/sh

command=/sbin/wpa_supplicant
wpa_supplicant_if=${wpa_supplicant_if:+-i}$wpa_supplicant_if
command_args="$wpa_supplicant_args $wpa_supplicant_if"

default_conf=/etc/wpa_supplicant/wpa_supplicant.conf

find_wireless() {
	local iface=
	for iface in /sys/class/net/*; do
		if [ -e "$iface"/wireless -o -e "$iface"/phy80211 ]; then
			echo "${iface##*/}"
			return 0
		fi
	done

	return 1
}

append_wireless() {
	local iface= i=

	iface=$(find_wireless)
	if [ -n "$iface" ]; then
		for i in $iface; do
			command_args="$command_args -i$i"
		done
	fi
}

start_pre() {
	case " $command_args" in
	*" -i"*) ;;
	*) append_wireless;;
	esac

	# use default conf if it exists
	if [ -f "${default_conf}" ]; then
		: ${wpa_supplicant_conf:=${default_conf}}
	fi
}

start_pre
$command -B $command_args -c${wpa_supplicant_conf:=${default_conf}}