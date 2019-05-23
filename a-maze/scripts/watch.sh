while true; do
	if ! inotifywait -rqe close_write . | git check-ignore -nv --stdin; then
		echo "";
		echo "BUILDING ------------------------------------------------------------------------------";
		make --no-print-directory all;
		echo "";
	fi
done
