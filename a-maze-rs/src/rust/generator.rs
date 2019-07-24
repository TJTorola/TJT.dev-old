use super::constants::WHITE;
use super::graph::{Dir, Graph};
use super::process::Process;
use super::utils::random_usize;
use wasm_bindgen::prelude::*;

fn hilburt_dir(idx: usize) -> Dir {
    let mut i = idx + 1;
    let mut switch = true;

    while i % 4 == 0 {
        switch = !switch;
        i >>= 2;
    };

    let mut dir = match (switch, i % 4) {
        (true, 1) => Dir::Down,
        (true, 2) => Dir::Right,
        (true, 3) => Dir::Up,
        (false, 1) => Dir::Right,
        (false, 2) => Dir::Down,
        (false, 3) => Dir::Left,
        _ => panic!("HILBURT_DIR: Impossible match")
    };

    i >>= 2;
    while i > 0 {
        dir = match i % 4 {
            // Rotate counter clockwise, flip vertically
            1 | 2 => match dir {
                Dir::Up => Dir::Left,
                Dir::Right => Dir::Down,
                Dir::Down => Dir::Right,
                Dir::Left => Dir::Up,
            },

            // Invert bothways
            3 => match dir {
                Dir::Up => Dir::Down,
                Dir::Right => Dir::Left,
                Dir::Down => Dir::Up,
                Dir::Left => Dir::Right,
            },

            _ => dir,
        };
        i >>= 2;
    }

    dir
}

#[cfg(test)]
mod hilburt_dir_test {
    use super::*;

    #[test]
    fn test_i_0() {
        assert_eq!(hilburt_dir(0), Dir::Down);
    }

    #[test]
    fn test_i_2() {
        assert_eq!(hilburt_dir(2), Dir::Up);
    }

    #[test]
    fn test_i_4() {
        assert_eq!(hilburt_dir(4), Dir::Right);
    }

    #[test]
    fn test_i_10() {
        assert_eq!(hilburt_dir(10), Dir::Left);
    }

    #[test]
    fn test_i_15() {
        assert_eq!(hilburt_dir(15), Dir::Down);
    }

    #[test]
    fn test_i_16() {
        assert_eq!(hilburt_dir(16), Dir::Right);
    }

    #[test]
    fn test_i_37() {
        assert_eq!(hilburt_dir(37), Dir::Right);
    }

    #[test]
    fn test_i_68() {
        assert_eq!(hilburt_dir(68), Dir::Down);
    }
}

pub fn hilburt(_cols: usize, _rows: usize) -> Process {
    let mut graph = Graph::new();
    graph.set_fill((0, 0), WHITE);
    graph.make_step();

    for idx in 0..1023 {
        graph.walk(hilburt_dir(idx));
        graph.make_step();
    }

    graph.into_process()
}

pub fn random(cell_cols: usize, cell_rows: usize) -> Process {
    let cols = (cell_cols * 2) - 1;
    let rows = (cell_rows * 2) - 1;

    let mut process = Process::new(None);
    for _ in 0..255 {
        let changes = (0..5)
            .map(|_| {
                (
                    (random_usize(cols), random_usize(rows)),
                    (
                        random_usize(256) as u8,
                        random_usize(256) as u8,
                        random_usize(256) as u8,
                    ),
                )
            })
            .collect();

        process.push(changes);
    }
    process
}

pub fn fill_rows(cols: usize, rows: usize) -> Process {
    let mut graph = Graph::new();

    for y in 0..rows {
        graph.set_fill((0, y), WHITE);
        graph.make_step();

        for _ in 1..cols {
            graph.walk(Dir::Right);
            graph.make_step();
        }
    }

    graph.into_process()
}

#[wasm_bindgen]
pub enum Generator {
    Hilburt,
    Random,
    Rows,
}

impl Generator {
    pub fn call(&self, cols: usize, rows: usize) -> Process {
        match &self {
            Generator::Hilburt => hilburt(cols, rows),
            Generator::Random => random(cols, rows),
            Generator::Rows => fill_rows(cols, rows),
        }
    }
}
