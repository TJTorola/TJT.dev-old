(ns a-maze.core (:require [reagent.core :as r]))

(defn hello-world [] [:h3 "It works!"])

(r/render hello-world (. js/document (getElementById "app")))
