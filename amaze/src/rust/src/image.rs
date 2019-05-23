use super::constants::{ BLACK };
use super::pixel::Pixel;
use super::types::*;

pub struct Image {
    width: usize,
    height: usize,
    data: Vec<Pixel>,
}

impl Image {
    pub fn new(width: usize, height: usize) -> Image {
        let data = vec![Pixel::new(BLACK); (width * height * 4) as usize];

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
        (y * self.width + x) as usize
    }

    pub fn paint_region(&mut self, region: Region, color: Color) {
        let ((x1, y1), (x2, y2)) = region;

        for x in x1..x2 {
            for y in y1..y2 {
                let idx = self.get_idx((x, y));
                self.data[idx].set(color);
            }
        }
    }
}
