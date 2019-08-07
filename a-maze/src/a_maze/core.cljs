(ns a-maze.core
  (:require [reagent.core :as r]))

(defn app [] [:div "Hello CLJS"])

(r/render app (. js/document (getElementById "app")))
