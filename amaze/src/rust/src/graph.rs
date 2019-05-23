use super::image::Coord;
use super::process::{ Process, Change };
use super::color::Color;

pub enum Dir {
    Up,
    Down,
    Right,
    Left,
}

pub struct Graph {
    process: Process,
    changes: Vec<Change>,
    coord: Coord,
    bg: Color,
}

impl Graph {
    pub fn new(cell_coord: Coord, bg: Color) -> Graph {
        let (x, y) = cell_coord;
        let coord = (x * 2, y * 2);
        Graph {
            process: Process::new(None),
            changes: vec![(coord, bg)],
            coord,
            bg,
        }
    }

    pub fn set_bg(&mut self, bg: Color) {
        self.bg = bg;
    }

    pub fn set_coord(&mut self, cell_coord: Coord) {
        let (x, y) = cell_coord;
        self.coord = (x * 2, y * 2);
    }

    pub fn fill(&mut self) {
        self.changes.push((self.coord, self.bg))
    }

    pub fn walk(&mut self, dir: Dir) {
        let (x, y) = self.coord;
        let (wall_coord, cell_coord) = match dir {
            Dir::Up => ((x, y - 1), (x, y - 2)),
            Dir::Down => ((x, y + 1), (x, y + 2)),
            Dir::Right => ((x + 1, y), (x + 2, y)),
            Dir::Left => ((x - 1, y), (x - 2, y)),
        };

        self.changes.push((wall_coord, self.bg));
        self.changes.push((cell_coord, self.bg));
        self.coord = cell_coord;
    }

    pub fn make_step(&mut self) {
        self.process.push(self.changes.clone());
        self.changes = vec![];
    }

    pub fn into_process(self) -> Process {
        self.process
    }
}

