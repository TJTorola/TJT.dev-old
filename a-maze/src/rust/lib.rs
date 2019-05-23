mod constants;
mod generators;
mod graph;
mod image;
mod maze;
mod pixel;
mod process;
mod types;
mod utils;

extern crate web_sys;

use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[allow(unused_macros)]
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub fn a_maze_init() {
    console_error_panic_hook::set_once();
}

pub use maze::Maze;
