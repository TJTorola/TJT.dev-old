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
                dirs.clone().iter().map(|d| { d.flip_hor().rotate_ccw() }).collect(),
                vec![Dir::Down],
                dirs.clone(),
                vec![Dir::Right],
                dirs.clone(),
                vec![Dir::Up],
                dirs.clone().iter().map(|d| { d.flip_vert().rotate_ccw() }).collect(),

            ].concat();

            recur(generation, current + 1, next)
        }
    }

    recur(generation, 0, vec![Dir::Down, Dir::Right, Dir::Up])
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_gen_0() {
        assert_eq!(hilburt_dirs(0), vec![Dir::Down, Dir::Right, Dir::Up]);
    }

    #[test]
    fn test_gen_1() {
        assert_eq!(hilburt_dirs(1), vec![
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
        ]);
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
        let changes = (0..5).map(|_| {(
            (random_usize(cols), random_usize(rows)),
            (random_usize(256) as u8, random_usize(256) as u8, random_usize(256) as u8),
        )}).collect();

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
