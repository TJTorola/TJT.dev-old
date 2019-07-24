extern crate js_sys;

use js_sys::Math::random;

pub fn random_usize(to: usize) -> usize {
    (random() * to as f64) as usize
}
