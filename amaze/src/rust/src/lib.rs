mod constants;
mod generators;
mod graph;
mod image;
mod maze;
mod pixel;
mod process;
mod types;

extern crate web_sys;

use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
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
