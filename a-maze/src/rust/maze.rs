use super::constants::BLACK;
use super::generator::Generator;
use super::image::Image;
use super::pixel::Pixel;
use super::process::Process;
use super::types::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Maze {
    cell_size: usize,
    wall_size: usize,
    cell_rows: usize,
    cell_cols: usize,
    image: Image,
    step_idx: usize,
    process: Process,
}

#[wasm_bindgen]
impl Maze {
    pub fn new(cell_size: usize, wall_size: usize, max_width: usize, max_height: usize) -> Maze {
        let full_size = wall_size + cell_size;

        let cell_rows = (max_height + wall_size) / full_size;
        let cell_cols = (max_width + wall_size) / full_size;
        let height = (cell_rows * full_size) - wall_size;
        let width = (cell_cols * full_size) - wall_size;

        let image = Image::new(width, height);

        Maze {
            cell_size,
            wall_size,
            cell_rows,
            cell_cols,
            image,
            step_idx: 0,
            process: Process::new(None),
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
        self.process.len()
    }

    fn get_region(&self, coord: Coord) -> Region {
        let full_size = self.cell_size + self.wall_size;
        let (x, y) = coord;

        let x1 = (full_size * (x / 2)) + (self.cell_size * (x % 2));
        let y1 = (full_size * (y / 2)) + (self.cell_size * (y % 2));

        let height = if y % 2 == 0 {
            self.cell_size
        } else {
            self.wall_size
        };
        let width = if x % 2 == 0 {
            self.cell_size
        } else {
            self.wall_size
        };

        let x2 = x1 + width;
        let y2 = y1 + height;

        ((x1, y1), (x2, y2))
    }

    pub fn set_generator(&mut self, generator: Generator) {
        self.process = generator.call(self.cell_cols, self.cell_rows);
        self.step_idx = 0;
        self.image.clear();
    }

    pub fn set_step(&mut self, new_step_idx: usize) {
        let map = self.process.get_map(new_step_idx).unwrap();
        let diff = self.process.get_diff(self.step_idx, Some(new_step_idx));

        for coord in diff.iter() {
            let color = match map.get(coord) {
                Some(c) => c.clone(),
                None => BLACK,
            };
            let region = self.get_region(*coord);
            self.image.paint_region(region, color);
        }
        self.step_idx = new_step_idx;
    }
}
