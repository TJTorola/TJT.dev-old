(ns a-maze.core
  (:require [reagent.core :as r]))

(defn app [] [:div "A-Maze!"])

(r/render app (. js/document (getElementById "app")))
