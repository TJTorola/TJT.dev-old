mod utils;

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

use std::convert::TryInto;
use wasm_bindgen::prelude::*;

extern crate js_sys;
extern crate im;

type Diffs = Vec<Diff>;
type Steps = Vec<Diffs>;
type Coord = (usize, usize);
type Color = (u8, u8, u8);

fn randNum(to: usize) -> usize {
    (js_sys::Math::random() * to as f64) as usize
}

fn generateRandSteps(rows: usize, cols: usize) -> Steps {
  (0..256).map(|_| {
      (0..5).map(|_| {
          Diff {
              coord: (randNum(rows), randNum(cols)),
              color: (randNum(256) as u8, randNum(256) as u8, randNum(256) as u8)
          }
      }).collect()
  }).collect()
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Pixel(u8, u8, u8, u8);

impl Pixel {
    pub fn new(color: Color) -> Pixel {
        let (r, g, b) = color;
        Pixel(r, g, b, 255)
    }

    pub fn set(&mut self, color: Color) {
        let (r, g, b) = color;
        self.0 = r;
        self.1 = g;
        self.2 = b;
    }
}

pub struct Image {
    width: usize,
    height: usize,
    data: Vec<Pixel>,
}

impl Image {
    pub fn new(width: usize, height: usize) -> Image {
        let data = vec![Pixel::new((0, 0, 0)); (width * height * 4).try_into().unwrap()];

        Image {
            width,
            height,
            data,
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn height(&self) -> usize {
        self.height
    }

    pub fn data(&self) -> *const Pixel {
        self.data.as_ptr()
    }

    fn get_idx(&self, coord: Coord) -> usize {
        let (x, y) = coord;
        (x * self.width + y) as usize
    }

    pub fn paint_region(&mut self, from: Coord, to: Coord, color: Color) {
        let (x1, y1) = from;
        let (x2, y2) = to;

        for x in x1..x2 {
            for y in y1..y2 {
                let idx = self.get_idx((x, y));
                self.data[idx].set(color);
            }
        }
    }
}

pub struct Diff {
    coord: Coord,
    color: Color,
}


#[wasm_bindgen]
pub struct Maze {
    cell_size: usize,
    wall_size: usize,
    cols: usize,
    rows: usize,
    image: Image,
    step: usize,
    steps: Steps,
}

#[wasm_bindgen]
impl Maze {
    pub fn new(cell_size: usize, wall_size: usize, max_width: usize, max_height: usize) -> Maze {
        let full_size = wall_size + cell_size;

        let rows = (max_height + wall_size) / full_size;
        let cols = (max_width + wall_size) / full_size;
        let height = (rows * full_size) - wall_size;
        let width = (cols * full_size) - wall_size;

        let image = Image::new(width, height);

        Maze {
            cell_size,
            wall_size,
            cols,
            rows,
            image,
            step: 0,
            steps: generateRandSteps(rows, cols),
        }
    }

    pub fn image_data(&self) -> *const Pixel {
        self.image.data()
    }

    pub fn width(&self) -> usize {
        self.image.width()
    }

    pub fn height(&self) -> usize {
        self.image.height()
    }

    pub fn step_count(&self) -> usize {
        self.steps.len()
    }

    fn get_region(&self, coord: Coord) -> (Coord, Coord) {
        let (row, col) = coord;
        let full_size = self.cell_size + self.wall_size;
        (
            (row * full_size, col * full_size),
            ((row * full_size) + self.cell_size, (col * full_size) + self.cell_size),
        )
    }

    pub fn set_step(&mut self, new_step: usize) {
        for step in self.step..new_step {
            for i in 0..self.steps[step].len() {
                let diff = &self.steps[step][i];
                let (to, from) = self.get_region(diff.coord);
                self.image.paint_region(to, from, diff.color);
            }
        }
        self.step = new_step;
    }
}
