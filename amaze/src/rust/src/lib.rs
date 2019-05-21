mod utils;

use std::convert::TryInto;
use wasm_bindgen::prelude::*;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Pixel(u8, u8, u8, u8);

impl Pixel {
    pub fn new(r: u8, g: u8, b: u8) -> Pixel {
        Pixel(r, g, b, 255)
    }
}

#[wasm_bindgen]
pub struct Image {
    width: u32,
    height: u32,
    data: Vec<Pixel>,
}

#[wasm_bindgen]
impl Image {
    pub fn new(width: u32, height: u32) -> Image {
        let data = vec![Pixel::new(0, 0, 0); (width * height * 4).try_into().unwrap()];

        Image {
            width,
            height,
            data,
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn data(&self) -> *const Pixel {
        self.data.as_ptr()
    }
}

#[wasm_bindgen]
pub struct Maze {
    cols: u32,
    rows: u32,
    image: Image,
}

#[wasm_bindgen]
impl Maze {
    pub fn new(cell_size: u32, max_width: u32, max_height: u32) -> Maze {
        let wall_size = cell_size / 10;
        let full_size = wall_size + cell_size;

        let rows = max_width / full_size;
        let cols = max_height / full_size;
        let image = Image::new(rows * full_size, cols * full_size);

        Maze {
            cols,
            rows,
            image,
        }
    }

    pub fn image_data(&self) -> *const Pixel {
        self.image.data()
    }

    pub fn width(&self) -> u32 {
        self.image.width()
    }

    pub fn height(&self) -> u32 {
        self.image.height()
    }
}

























