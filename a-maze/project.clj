(defproject a-maze "0.0.0"

  :dependencies [[org.clojure/clojure "1.9.0"]
                 [org.clojure/clojurescript "1.10.312"]
                 [reagent "0.8.1"]]

  :resource-paths ["resources" "target"]

  :clearn-targets ^{:protect false} ["target/public"]

  :profiles {:dev {:dependencies [[com.bhauman/figwheel-main "0.1.5"]]}}

  :aliases {"dev" ["trampoline" "run" "-m" "figwheel.main" "-b" "dev" "-r"]})
