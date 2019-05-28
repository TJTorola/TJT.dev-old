use super::constants::WHITE;
use super::graph::{Dir, Graph};
use super::process::Process;
use super::utils::random_usize;
use wasm_bindgen::prelude::*;

fn hilburt_dirs(generation: usize) -> Vec<Dir> {
    fn recur(generation: usize, current: usize, dirs: Vec<Dir>) -> Vec<Dir> {
        print!("Gen: {}, cur: {}", generation, current);
        if generation <= current {
            dirs
        } else {
            let next = [
                dirs.clone()
                    .iter()
                    .map(|d| d.flip_hor().rotate_ccw())
                    .collect(),
                vec![Dir::Down],
                dirs.clone(),
                vec![Dir::Right],
                dirs.clone(),
                vec![Dir::Up],
                dirs.clone()
                    .iter()
                    .map(|d| d.flip_vert().rotate_ccw())
                    .collect(),
            ]
            .concat();

            recur(generation, current + 1, next)
        }
    }

    recur(generation, 0, vec![Dir::Down, Dir::Right, Dir::Up])
}

#[cfg(test)]
mod hilburt_dirs_test {
    use super::*;

    #[test]
    fn test_gen_0() {
        assert_eq!(hilburt_dirs(0), vec![Dir::Down, Dir::Right, Dir::Up]);
    }

    #[test]
    fn test_gen_1() {
        assert_eq!(
            hilburt_dirs(1),
            vec![
                Dir::Right,
                Dir::Down,
                Dir::Left,
                Dir::Down,
                Dir::Down,
                Dir::Right,
                Dir::Up,
                Dir::Right,
                Dir::Down,
                Dir::Right,
                Dir::Up,
                Dir::Up,
                Dir::Left,
                Dir::Up,
                Dir::Right,
            ]
        );
    }
}

fn hilburt_dir(idx: usize) -> Dir {
    let mut shf = 0;
    let mut dir = match idx % 4 {
        0 => Dir::Down,
        1 => Dir::Right,
        2 => Dir::Up,
        _ => {
            shf += 2;
            match (idx >> shf) % 3 {
                0 => Dir::Right,
                1 => Dir::Down,
                _ => Dir::Left,
            }
        }
    };

    shf += 2;
    while idx >> shf > 0 {
        dir = match (idx >> shf) % 4 {
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
        shf += 2;
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

    let dirs = hilburt_dirs(4);
    for dir in dirs {
        graph.walk(dir);
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
