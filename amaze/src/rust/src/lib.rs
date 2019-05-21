mod utils;

use std::convert::TryInto;
use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Grid {
    width: u32,
    height: u32,
    image_data: Vec<u8>,
}

#[wasm_bindgen]
impl Grid {
    pub fn new(width: u32, height: u32) -> Grid {
        let image_data = vec![255 as u8; (width * height * 4).try_into().unwrap()];
        Grid {
            width,
            height,
            image_data,
        }
    }

    pub fn image_data(&self) -> *const u8 {
        self.image_data.as_ptr()
    }
}
