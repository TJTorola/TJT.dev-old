use super::color::Color;

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

