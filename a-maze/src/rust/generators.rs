use super::constants::WHITE;
use super::graph::{Dir, Graph};
use super::process::Process;
use super::utils::random_usize;

pub fn hilburt(_cols: usize, _rows: usize) -> Process {
    let mut graph = Graph::new((0, 0), WHITE);
    graph.make_step();

    graph.walk(Dir::Right);
    graph.make_step();
    graph.walk(Dir::Down);
    graph.make_step();
    graph.walk(Dir::Left);
    graph.make_step();
    graph.walk(Dir::Down);
    graph.make_step();
    graph.walk(Dir::Down);
    graph.make_step();
    graph.walk(Dir::Right);
    graph.make_step();
    graph.walk(Dir::Up);
    graph.make_step();
    graph.walk(Dir::Right);
    graph.make_step();
    graph.walk(Dir::Down);
    graph.make_step();
    graph.walk(Dir::Right);
    graph.make_step();
    graph.walk(Dir::Up);
    graph.make_step();
    graph.walk(Dir::Up);
    graph.make_step();
    graph.walk(Dir::Left);
    graph.make_step();
    graph.walk(Dir::Up);
    graph.make_step();
    graph.walk(Dir::Right);
    graph.make_step();

    graph.into_process()
}

pub fn random(cols: usize, rows: usize) -> Process {
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

