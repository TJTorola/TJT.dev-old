use super::constants::WHITE;
use super::process::Process;
use super::types::*;

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
    pub fn new() -> Graph {
        Graph {
            process: Process::new(None),
            changes: vec![],
            coord: (0, 0),
            bg: WHITE,
        }
    }

    pub fn set_bg(&mut self, bg: Color) {
        self.bg = bg;
    }

    pub fn set_coord(&mut self, cell_coord: Coord) {
        let (x, y) = cell_coord;
        self.coord = (x * 2, y * 2);
    }

    pub fn set_fill(&mut self, cell_coord: Coord, bg: Color) {
        self.set_coord(cell_coord);
        self.set_bg(bg);
        self.fill();
    }

    pub fn fill(&mut self) {
        self.changes.push((self.coord, self.bg))
    }

    pub fn walk(&mut self, dir: Dir) -> Coord {
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
        cell_coord
    }

    pub fn make_step(&mut self) {
        self.process.push(self.changes.clone());
        self.changes = vec![];
    }

    pub fn into_process(self) -> Process {
        self.process
    }
}
