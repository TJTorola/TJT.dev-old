(ns a-maze.location
  (:require [cljs.test :refer-macros [deftest is]]))

(defn parse-location-data [hash-loc]
  (if (= 0 (count hash-loc))
    {:generator nil}
    {:generator hash-loc}))

(deftest test-parse-location-data
  (is (= {:generator "foo"}
         (parse-location-data "foo")))
  (is (= {:generator nil}
         (parse-location-data ""))))

(defn parse-location [routes current-route])

(deftest test-location-map
  (def test-routes {:group "/o/:org-id/g/:group-id"
                    :group-foo "/o/:org-id/g/:group-id/foo"
                    :org-settings "/o/:org-id/settings"
                    :profile-settings "/profile-settings"})

  (is (= (parse-location test-routes "#/o/123/g/456/foo")
         {:route :group-foo
          :params {:org-id "123"
                   :group-id "456"}}))
  (is (= (parse-location test-routes "#/o/889/g/909")
         {:route :group
          :params {:org-id "889"
                   :group-id "909"}}))
  (is (= (parse-location test-routes "#/o/345/settings")
         {:route :org-settings
          :params {:org-id "345"}}))
  (is (= (parse-location test-routes "#/profile-settings")
         {:route :profile-settings
          :params {}}))
  (is (= (parse-location test-routes "")
         {:route nil
          :params {}}))
  (is (= (parse-location test-routes "#")
         {:route nil
          :params {}}))
  (is (= (parse-location test-routes "#/")
         {:route nil
          :params {}})))
