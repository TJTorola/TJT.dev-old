(ns a-maze.core
    (:require [reagent.core :as r]))

(defn a-maze [] [:div "Hello CLJS"])

(r/render-component [a-maze] (. js/document (getElementById "a-maze")))
