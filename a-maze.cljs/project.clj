(defproject a-maze "0.0" 
  :aliases {"dev" ["trampoline" "run" "-m" "figwheel.main" "-b" "a-maze" "-r"]}

  :dependencies [[org.clojure/clojure "1.10.0"]
                 [org.clojure/clojurescript "1.10.339"]
                 [org.clojure/core.async "0.4.474"]
                 [reagent "0.8.1"]]

  :clean-targets ^{:protect false} ["target/public"]

  :plugins [[cider/cider-nrepl "0.21.1"]]

  :profiles {:dev {:dependencies [[org.clojure/clojurescript "1.10.339"]
                                  [cider/piggieback "0.4.1"]
                                  [com.bhauman/figwheel-main "0.2.3"]]}
                  :repl-options {:nrepl-middleware [cider.piggieback/wrap-cljs-repl]}
                  :resource-paths ["target"]})
