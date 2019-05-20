mod utils;

use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Grid {
    width: u32,
    height: u32,
}

#[wasm_bindgen]
impl Grid {
    pub fn new(width: u32, height: u32) -> Grid {
        Grid {
            width,
            height,
        }
    }
}
