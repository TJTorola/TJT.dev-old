(ns a-maze.location
  (:require [cljs.test :refer-macros [deftest is run-tests]]))

(defn parse-location-data [hash-loc]
  (if (= 0 (count hash-loc))
    {:generator nil}
    {:generator hash-loc}))

(deftest test-parse-location-data
  (is (= {:generator "foo"}
         (parse-location-data "foo")))
  (is (= {:generator nil}
         (parse-location-data ""))))

(defn handle-hash-change []
  (js/console.log js/window.location.hash))

(.addEventListener
 js/window
 "hashchange"
 handle-hash-change
 false)
