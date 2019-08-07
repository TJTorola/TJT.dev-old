(defproject a-maze "0.0"
  :min-lein-version "2.9.1"
  :dependencies [[org.clojure/clojure "1.10.0"]
                 [org.clojure/clojurescript "1.10.520"]
                 [org.clojure/core.async  "0.4.500"]
                 [reagent "0.8.1"]]
  :plugins [[lein-figwheel "0.5.19"]
            [lein-cljsbuild "1.1.7" :exclusions [[org.clojure/clojure]]]]
  :source-paths ["src"]
  :cljsbuild {:builds
              [{:id "dev"
                :source-paths ["src"]
                :figwheel {}
                :compiler {:main a-maze.core
                           :asset-path "js/compiled/out"
                           :output-to "resources/public/js/compiled/a_maze.js"
                           :output-dir "resources/public/js/compiled/out"
                           :source-map-timestamp true
                           :preloads [devtools.preload]}}
               {:id "min"
                :source-paths ["src"]
                :compiler {:output-to "resources/public/js/compiled/a_maze.js"
                           :main a-maze.core
                           :optimizations :advanced
                           :pretty-print false}}]}
  :figwheel {:css-dirs ["resources/public/css"]}
  :profiles {:dev
             {:dependencies [[binaryage/devtools "0.9.10"]
                             [figwheel-sidecar "0.5.19"]
                             [cider/piggieback "0.4.1"]]
              :source-paths ["src" "dev"]
              :repl-options {:nrepl-middleware [cider.piggieback/wrap-cljs-repl]}
              :clean-targets ^{:protect false} ["resources/public/js/compiled"
                                                :target-path]}})
