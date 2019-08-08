(ns a-maze.core (:require [reagent.core :as r]))

(defn play-icon []
  [:svg {:view-box "0 0 16 16"
         :width "23"
         :height "23"}
   [:polygon {:points "0,0 16,8 0,16"}]])

(defn pause-icon []
  [:svg {:view-box "0 0 16 16"
         :width "23"
         :height "23"}
   [:polygon {:points "2,0 2,16 6,16 6,0"}]
   [:polygon {:points "10,0 10,16 14,16 14,0"}]])

(defn app []
  [:main
   [:header.title
    [:h1 "A Maze"]]
   [:section.controls
    [:button.control
     [play-icon]]
    [:input.slider {:type "range"}]]
   [:nav
    [:h2.subheader "Test Patterns"]
    [:hr]
    [:ul.links
     [:li [:a {:href "#hilburt"} "Hilburt's Curve"]]
     [:li [:a {:href "#random"} "Random"]]
     [:li [:a {:href "#rows"} "Rows"]]]]
   [:section.content
    [:div.grid (repeat 9 [:div])]]])

(r/render app (. js/document (getElementById "app")))
