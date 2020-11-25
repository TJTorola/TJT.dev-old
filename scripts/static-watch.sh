while true; do
  make --no-print-directory static;
  inotifywait -qre close_write src/static;
done
