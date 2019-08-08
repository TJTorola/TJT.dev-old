(defproject a-maze "0.0"
  :cljsbuild {:builds
              [{:id "dev"
                :compiler {:asset-path "js/compiled/out"
                           :main a-maze.core
                           :output-dir "resources/public/js/compiled/out"
                           :output-to "resources/public/js/compiled/a-maze.js"
                           :preloads [devtools.preload]
                           :source-map-timestamp true}
                :figwheel {}
                :source-paths ["src"]}
               {:id "min"
                :compiler {:main a-maze.core
                           :optimizations :advanced
                           :output-to "resources/public/js/compiled/a-maze.js"
                           :pretty-print false}
                :source-paths ["src"]}]}
  :dependencies [[org.clojure/clojure "1.10.0"]
                 [org.clojure/clojurescript "1.10.520"]
                 [reagent "0.8.1"]]
  :figwheel {:css-dirs ["resources/public/css"]}
  :min-lein-version "2.9.1"
  :plugins [[lein-cljfmt "0.6.4"]
            [lein-cljsbuild "1.1.7" :exclusions [[org.clojure/clojure]]]
            [lein-figwheel "0.5.19"]]
  :profiles {:dev {:clean-targets ^{:protect false} ["resources/public/js/compiled" :target-path]
                   :dependencies [[binaryage/devtools "0.9.10"]
                                  [cljfmt "0.6.4"]
                                  [figwheel-sidecar "0.5.19"]
                                  [cider/piggieback "0.4.1"]]
                   :repl-options {:nrepl-middleware [cider.piggieback/wrap-cljs-repl]}
                   :source-paths ["src" "dev"]}}
  :source-paths ["src"])
