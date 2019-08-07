(defproject a-maze "0.0.0"

  :dependencies [[org.clojure/clojure "1.10.0"]
                 [org.clojure/clojurescript "1.10.520"]
                 [reagent "0.8.1"]]

  :plugins [[lein-cljsbuild "1.1.7" :exclusions [[org.clojure/clojure]]]]

  :source-paths ["src"]

  :cljsbuild {:builds
              [{:id "dev"
                :source-paths ["src"]
                :compiler {:main a-maze.core
                           :asset-path "js"
                           :output-to "public/js/a-maze.js"
                           :output-dir "public/js"
                           :source-map-timestamp true}}]})
