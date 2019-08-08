(ns a-maze.core (:require [reagent.core :as r]))
(declare app loader pause-icon play-control play-icon step-control)

(defonce playing (r/atom false))
(defonce step (r/atom 0))

(defn to-int [string-number]
  (js/parseInt string-number 10))

(defn app []
  [:main
   [:header.title
    [:h1 "A Maze"]]
   [:section.controls
    [play-control]
    [step-control]]
   [:nav
    [:h2.subheader "Test Patterns"]
    [:hr]
    [:ul.links
     [:li [:a {:href "#hilburt"} "Hilburt's Curve"]]
     [:li [:a {:href "#random"} "Random"]]
     [:li [:a {:href "#rows"} "Rows"]]]]
   [:section.content
    [loader]]])

(defn loader []
  [:div.grid (repeat 9 [:div])])

(defn pause-icon []
  [:svg {:view-box "0 0 16 16"
         :width "23"
         :height "23"}
   [:polygon {:points "2,0 2,16 6,16 6,0"}]
   [:polygon {:points "10,0 10,16 14,16 14,0"}]])

(defn play-control []
  [:button.control {:on-click #(swap! playing not)}
   (if @playing [pause-icon] [play-icon])])

(defn play-icon []
  [:svg {:view-box "0 0 16 16"
         :width "23"
         :height "23"}
   [:polygon {:points "0,0 16,8 0,16"}]])

(defn step-control []
  [:input.slider {:on-change #(reset! step (to-int (.. % -target -value)))
                  :type "range"
                  :value @step}])

(r/render app (. js/document (getElementById "app")))
